<template>
  <div class="collectList" :style="{color:textColor}">
    <!-- 收藏面板 -->
    <van-overlay :show="showCollectForm">
      <collectForm v-if="showCollectForm" :workIdList="checkList" @collectSuccess="getCollectListData(groups[activeKey].id)" @close="showCollectForm = false"></collectForm>
    </van-overlay>
    <!-- 收藏面板 -->
    <!-- 创建分组 -->
    <el-dialog
      :visible.sync="isAdd"
      width="30%">
      <el-input
        placeholder="请输入组名"
        v-model="newGroupName"
        maxlength="10"
        show-word-limit
        clearable>
      </el-input>
      <el-checkbox v-model="isPublic">公开</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeNewGroupWrap">取 消</el-button>
        <el-button type="primary" @click="confirAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建分组 -->
    <!-- 左侧导航栏 -->
    <div class="left-sider">
      <leftSider :activeKey="activeKey" :siderNames="siderNames"
      @dbclick="updateGroupName" @change="onChange" @removeGroup="delGroup" v-if="isLoad"></leftSider>
      <div class="add-group">
        <div class="add-text" @click="isAdd = true" >
          <van-icon name="plus" size=".13rem"/>
        </div>
      </div>
      <div class="manage-collect">
        <div class="open-manage" v-show="!isMange">
          <i class="el-icon-setting" @click="isMange = true"> 批量操作</i>
        </div>
        <div class="open-manage" v-show="isMange">
          <i class="el-icon-circle-check" @click="checkAll"> 全选</i>
          <i class="el-icon-remove-outline" @click="toggleAll"> 反选</i>
          <i class="el-icon-delete" @click="delCollect"> 删除</i>
          <i class="el-icon-sort" @click="showCollectForm = true"> 移动</i>
          <i class="el-icon-circle-close" @click="cancelMange"> 取消</i>
        </div>
      </div>
    </div>
    <!-- 左侧导航栏 -->
    <!-- 列表内容 -->
    <div class="right-sider">
      <div class="collect-content">
        <van-checkbox-group v-model="checkList" ref="checkboxGroup">
          <div class="collect-list">
            <workShowCart v-for="(item,index) in collectContentData" :key="item.id"
             :work="item" :scale="false" :stopLink="!isMange">
              <van-checkbox class="check-item" :name="item.id" shape="square" v-show="isMange"></van-checkbox></el-checkbox>
            </workShowCart>
          </div>
        </van-checkbox-group>
        <p class="load-text" v-if="loadState===1">加载中...</p>
        <p class="load-text" v-if="loadState===0">加载失败</p>
        <p class="load-text" v-if="loadState===2">没有更多了</p>
        <el-pagination class="page-bar"
          @current-change="loadMore"
          :current-page="pageIndex"
          :page-size="count"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 列表内容 -->
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import worksCart from './worksCart'
import leftSider from './leftSider'
import workShowCart from './workShowCart'
import collectForm from './collectForm'
import '@/assets/resetCss/reSpace.css'
import '@/assets/resetCss/reVantCss.css'
  export default {
    name:'collectList',
    data(){
      return{
        //选择的左侧边索引
        activeKey:0,
        // 双击选择的左侧栏索引
        dbIndex:undefined,
        //列表名字数组
        groups:[],
        //当前获取的收藏列表内容
        collectContentData:[],
        //选择列表
        checkList:[],
        //是否添加新组
        isAdd:false,
        //新的组名
        newGroupName:'',
        //新分组的公开状态
        isPublic: false,
        //打开收藏面板
        showCollectForm:false,

        //一开始加载的数量
        count: 12,
        //加载的页数
        pageIndex:1,
        //总收藏数
        total:0,
        //加载状态
        loadState:null,
        //数据加载完成
        isLoad:false,
        //批量操作作品
        isMange:false
      }
    },
    created(){
      //刚加载需要传值，表示加载完组名就直接根据组名获取第一组数据
      this.getGroupsName(1);
    },
    computed:{
      //计算文字颜色
      textColor(){
        return this.$store.state.textColor;
      },
      //取出组名
      siderNames(){
        return  this.groups.map(n=>{
          return n.name;
        })
      }
    },
    mounted(){

    },
    components:{worksCart,leftSider,workShowCart,collectForm},
    methods:{
      //取消管理
      cancelMange(){
        this.isMange = false;
        //清空选择
        this.checkList = [];
      },
      //全选
      checkAll() {
        this.$refs.checkboxGroup.toggleAll(true);
      },
      //反选
      toggleAll() {
        this.$refs.checkboxGroup.toggleAll();
      },
      //删除分组
      delGroup(inx){
        if(inx > 1){
          this.$confirm('是否删除该分组', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            request({
              url:api_list.api_delCollectGroup,
              method: 'delete',
              params:{
                groupId: this.groups[inx].id
              }
            }).then( res => {
              if(res.success){
                this.groups.splice(inx,1);
                if(inx == this.activeKey){
                  this.activeKey = 0;
                }
              }
            }).catch( err => {
  
            })
          })
        } else {
          this.$dialog({
            message:'该收藏夹不能删除'
          })
        }
      },
      //切换分组
      onChange(index){
        this.activeKey = index;
        //状态改为还有数据
        this.loadState = null;
        //重置当前分页
        this.pageIndex = 1;
        this.collectContentData = [];
        this.loadMore();
      },
      // 更改分组名
      updateGroupName(index){
        // 默认分组不能修改
        if(index <= 1){
          return
        }
        // 显示当前组的信息
        this.newGroupName = this.groups[index].name;
        this.isPublic = this.groups[index].publicStatus !==0 ? true : false;
        this.dbIndex = index;
        this.isAdd = true;
      },
      //确认添加分组
      confirAdd(){
        const loading = this.$loading({
          lock: true,
          text: 'update...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        if(this.newGroupName == ''){
          this.isAdd = false;
          this.newGroupName = '';
        } else if(this.dbIndex){    //修改分组名
          let publicStatus = 0;
          this.isPublic? publicStatus=1 : publicStatus = 0;
          request({
            url:api_list.api_updateCollectGroupName,
            method:'put',
            data:{
              id: this.groups[this.dbIndex].id,
              name: this.newGroupName,
              publicStatus: publicStatus
            }
          }).then( res => {
            loading.close();
            //重新获取组名
            this.getGroupsName();
            //关闭面板
            this.closeNewGroupWrap();
          }).catch(err => {
            loading.close();
          })
        } else {  //增加分组
          

          let publicStatus = 0;
          this.isPublic? publicStatus=1 : publicStatus = 0;
          request({
            url:api_list.api_createCollectGroup,
            method: 'post',
            data:{
              name: this.newGroupName,
              publicStatus:publicStatus
            }
          }).then( res => {
            loading.close();
            if(res.success){
              // console.log(res)
              //重新获取组名
              this.getGroupsName();
              //关闭面板
              this.closeNewGroupWrap();
            }
          }).catch( err => {
            loading.close();
            this.closeNewGroupWrap();
          })
        }
      },
      //加载
      loadMore () {
        //判断是否还有数据
        if(this.loadState!==2&&this.groups.length){

          //获取更多数据
          this.getCollectListData(this.groups[this.activeKey].id);
        }
      },
      //取消收藏
      delCollect(){
        // console.log(this.checkList)
        if(this.checkList.length){
          this.$dialog.alert({
            message: '是否取消收藏',
            showCancelButton: true
          }).then(()=>{
            let idList = this.checkList.splice(0,this.checkList.length);
            console.log(idList)
            console.log(this.groups[this.activeKey].id)
            request({
              url:api_list.api_removeCollections,
              method:'delete',
              data:{
                workIdList: idList,
                collectGroupId:this.groups[this.activeKey].id,
              }
            }).then( res => {
              // console.log(res)
              if(res.success){
                //获取数据，刷新页面
                this.getCollectListData(this.groups[this.activeKey].id);
              } else {
                this.$dialog.alert({
                  message: '取消失败',
                })
              }
            })
          });
        }
      },
      //关闭新建分组面板
      closeNewGroupWrap(){
        this.dbIndex = null;
        this.newGroupName = '';
        this.isPublic = false;
        this.isAdd = false;
      },
      //获取全部收藏分组名
      getGroupsName(_start){
        //获取全部收藏列表分组名
        request({
          url: api_list.api_getCollectGroups,
          method: 'get'
        }).then( res => {
          if(res.success && res.data.items !==''){
            // console.log(res)
            this.groups = res.data.items;
            //获取组名名后，再根据id获取第一个组名的内容,_start作用是区分是否新建分组，是就不用再次加载数据
            if(_start){
              this.getCollectListData(this.groups[0].id);
            }
            this.isLoad = true;
          } 
        }).catch( err => {
          this.loadState = 0;
        })
      },
      //获取收藏列表数据
      getCollectListData(groupId){
        //显示加载状态
        this.loadState = 1;
        request({
          url: api_list.api_getCollectGroupList,
          method: 'get',
          params:{
            customerId: this.$cookies.get('user_id'),
            collectGroupId:groupId,
            page: this.pageIndex,
            limit: this.count,
          }
        }).then( res => {
          // console.log(res)
          this.checkList = [];
          if(res.success){
            this.total = Number(res.data.total);
            if(res.data.total === '0'){
              this.collectContentData = [];
              this.loadState = 2;
            } else{
              this.collectContentData = res.data.rows;
              this.loadState = null;
            }
          } else {
            this.loadState = 0;
          }
        }).catch(err=>{
          if(err){
            this.loadState = 0;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .collectList{
    width: 100%;
    height: 98%;
    position: relative;
  }
  .list-content{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    /* overflow-y: scroll; */
  }
  .msgText{
    margin-top: .1rem;
    font-size: .1rem;
    text-align: center;
  }
  .left-sider{
    position: absolute;
    width: 12%;
    height: 100%;
    border-right: 1px solid rgba(192, 192, 192, 0.5);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .right-sider{
    position: absolute;
    right: 0;
    width: 88%;
    height: 100%;
    padding: 0 .1rem;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .collect-content{
    height: 100%;
  }
  .collect-list{
    display: flex;
    width: 100%;
    max-height: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .load-text{
    font-size: .1rem;
    text-align: center;
    font-weight: 500;
  }
  .add-group{
    padding: .1rem 0;
    border-top: 1px solid rgba(192, 192, 192, 0.5);
  }
  .add-text{
    cursor: pointer;
    font-size: .1rem;
    font-weight: 500;
    line-height: .1rem;
    text-align: center;
  }
  .del-sider{
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    top: 0;
    right: .02rem;
    width: .1rem;
    height: initial;
  }
  .mins-icon{
    display: block;
    line-height: .3rem;
  }
  .manage-collect{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: .1rem 0;
    border-top: 1px solid rgba(192, 192, 192, 0.5);
  }
  .open-manage{
    display: flex;
    cursor: pointer;
    flex-direction: column;
    align-items: center;
  }
  .el-icon-setting,.el-icon-circle-check,.el-icon-remove-outline,.el-icon-circle-close,.el-icon-delete,.el-icon-sort{
    font-size: .1rem;
    margin-bottom: .1rem;
  }
  .page-bar{
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 0;
    height: .2rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .dialog-footer{
    display: flex;
    justify-content: flex-end;
  }
  .check-item{
    position: absolute;
    font-size: .1rem;
    top: .02rem;
    right: .02rem;
  }
</style>
