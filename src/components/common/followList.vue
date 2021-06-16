<template>
  <div class="followList" :style="{color:textColor}">
    <div class="left-sider">
      <leftSider :activeKey="activeKey" :siderNames="siderNames"
       @change="onChange" @removeGroup="delGroup" v-if="isLoad"></leftSider>
      <!-- <input class="addInput" type="text" v-model="newGroupName" v-if="isAdd" @blur="confirAdd" @keyup.enter="confirAdd"> -->
      <el-input v-model="newGroupName" maxlength="10" show-word-limit v-if="isAdd" @blur="confirAdd" @keyup.enter.native="confirAdd"></el-input>
      <div class="add-group">
        <div class="add-text" @click="showAddInput" >
          <van-icon name="plus" size=".13rem" v-if="!isAdd"/>
          <van-icon name="cross" size=".13rem" v-if="isAdd"/>
        </div>
      </div>
    </div>
    <!-- 列表内容 -->
    <div class="right-sider">
      <div class="follow-content">
        <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
          <fansCart v-for="(item,index) in followContentData" :key="index" @delSelf="delCart(index)" @clickAvatar="gotoSpace(item)"
              :name="item.name" :sign="item.sign" :avatar="item.avatar" :showDel="true"></fansCart>
          <p class="load-text" v-if="loadState===1">加载中...</p>
          <p class="load-text" v-if="loadState===0">加载失败</p>
          <p class="load-text" v-if="loadState===2">没有更多了</p>
        </div>
      </div>
    </div>
    <!-- 列表内容 -->
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import fansCart from './fansCart'
import leftSider from './leftSider'
import '@/assets/resetCss/reSpace.css'
import '@/assets/resetCss/reVantCss.css'
  export default {
    name:'followList',
    data(){
      return{
        //选择的左侧边索引
        activeKey:0,
        //列表名字数组
        groups:[],
        //当前获取的关注列表内容
        followContentData:[],
        //是否添加新组
        isAdd:false,
        //新的组名
        newGroupName:'',
        //一开始加载的数量
        count: 8,
        pageIndex:1,
        busy:false,
        loadState:null,
        //加载数据完成
        isLoad:false,
      }
    },
    created(){
      //获取全部关注列表分组名
      this.getFollowGroupNames(1);
    },
    computed:{
      textColor(){
        return this.$store.state.textColor;
      },
      siderNames(){
        return this.groups.map(n=>{
          return n.groupName
        });
      }
    },
    components:{fansCart,leftSider},
    methods:{
      //去往用户空间
      gotoSpace(item){
        this.$router.push({path:'/AuthorSpace', query:{id:item.customerId}});
      },
      //删除分组
      delGroup(inx){
        if(inx !== 0 && inx !== 1){
          this.$confirm('是否删除该分组', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            request({
              url:api_list.api_deletFollowGroup,
              method: 'delete',
              params:{
                followGroupId: this.groups[inx].id
              }
            }).then( res => {
              // console.log(res)
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
            message:'不能删除默认和特别分组'
          })
        }
      },
      //切换分组
      onChange(index){
        this.activeKey = index;
        //状态改为还有数据
        this.loadState = null;
        this.pageIndex = 1;
        this.followContentData = [];
        this.loadMore();
      },
      //打开输入框
      showAddInput(){
        if(this.isAdd){
          this.isAdd = false;
        } else {
          this.isAdd = true;
        }
      },
      //确认添加分组
      confirAdd(){
        if(this.newGroupName == ''){
          this.isAdd = false;
          this.newGroupName = '';
        } else {
          request({
            url:api_list.api_createFollowGroup,
            method: 'post',
            data:{
              groupName: this.newGroupName
            }
          }).then( res => {
            if(res.success){
              this.groups.push(res.data.item);
              this.newGroupName = '';
              this.isAdd = false;
            }
          }).catch( err => {

          })
        }
      },
      //加载
      loadMore () {
        //判断是否还有数据
        if(this.loadState!==2&&this.groups.length){
          this.busy = false;

          //获取更多数据
          this.getFollowListData(this.groups[this.activeKey].id);
        }
      },
      //取关
      delCart(inx){
        this.$dialog.alert({
          message: '是否取关',
          showCancelButton: true
        }).then(()=>{
          request({
            url:api_list.api_unFollow,
            method:'put',
            params:{
              customerId:this.followContentData[inx].customerId,
            }
          }).then( res => {
            if(res.success){
              this.followContentData.splice(inx,1);
            } else {
              this.$dialog.alert({
                message: '删除失败',
              })
            }
          })
        });
      },
      //获取关注列表名
      getFollowGroupNames(_start){
        request({
          url: api_list.api_getFollowGroups,
          method: 'get'
        }).then( res => {
          if(res.success && res.data.items !==''){
            this.groups = res.data.items;
            this.isLoad = true;
            //获取组名名后，再根据id获取第一个组名的内容
            if(_start){
              this.getFollowListData(this.groups[0].id);
            }
          } 
        }).catch( err => {
          this.loadState = 0;
        })
      },
      //获取关注列表数据
      getFollowListData(groupId){
        //显示加载状态
        this.loadState = 1;
        this.busy = true;
        request({
          url: api_list.api_getFollowList,
          method: 'get',
          params:{
            followGroupId: groupId,
            page: this.pageIndex++,
            limit: this.count
          }
        }).then( res => {
          this.busy = false;
          if(res.success){
            if(res.message === '数据为空'){
              this.busy = true;
              this.pageIndex--;
              this.loadState = 2;
            } else{
              this.followContentData = this.followContentData.concat(res.data.rows);
              this.loadState = null;
            }
          } else {
            //失败就把页数减回去
            this.loadState = 0;
            this.pageIndex--;
          }
        }).catch(err=>{
          if(err){
            this.busy = false;
            this.loadState = 0;
            this.pageIndex--;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .followList{
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
  .addInput{
    display: block;
    width: 90%;
    background: rgba(192, 192, 192, 0.5);
    outline: none;
    border: 1px solid rgb(0,0,0,.5);
    height: .2rem;
    font-size: .12rem;
    margin: 0 auto;
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
</style>
