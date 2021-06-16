<template>
  <div class="worksList" :style="{color:textColor}">
    <div class="left-sider">
      <leftSider :activeKey="activeKey" :siderNames="siderNames" :closeBtn="false" @change="onChange"></leftSider>
      <input class="addInput" type="text" v-model="newSortName" v-if="isAdd" @blur="confirAdd" @keyup.enter="confirAdd">
    </div>
    <!-- 列表内容 -->
    <div class="right-sider">
      <div class="works-content">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <worksCart v-for="(work,index) in allWorksData" :key="index" :workObj="work"
          @modify="modifyWork(index)" @delSelf="delCart(index)"></worksCart>
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
import worksCart from './worksCart'
import leftSider from './leftSider'
import '@/assets/resetCss/reSpace.css'
import '@/assets/resetCss/reVantCss.css'
  export default {
    name:'worksList',
    data(){
      return{
        //选择的左侧边索引
        activeKey:0,
        //列表名字数组
        sorts:[{name:'全部作品'}],
        //当前获取的作品列表内容
        allWorksData:[],
        //是否添加新组
        isAdd:false,
        //新的组名
        newSortName:'',
        //每次加载的数量
        count: 8,
        pageIndex:1,
        //控制加载方法的量
        busy:false,
        loadState:null,
      }
    },
    created(){
      //获取全部作品列表
      this.getWorkData();
    },
    computed:{
      textColor(){
        return this.$store.state.textColor;
      },
      siderNames(){
        return ['全部作品']
      }
    },
    components:{worksCart,leftSider},
    methods:{
      //加载更多作品
      loadMore(){
        if(this.loadState!==2){
          this.pageIndex++;
          this.getWorkData();
        }
      },
      //删除
      delCart(inx){
        this.$confirm('是否删除该作品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          request({
            url:api_list.api_delPersonalWork,
            method:'delete',
            params:{
              workId:this.allWorksData[inx].id,
            }
          }).then( res => {
            if(res.success){
              this.allWorksData.splice(inx,1);
            } else {
              this.$dialog.alert({
                message: '删除失败',
              })
            }
          }).catch(err=>{
            this.$dialog.alert({
              message: '删除失败',
            })
          })
        });
      },
      //获取作品数据
      getWorkData(){
        this.busy = true;
        this.loadState = 1;
        request({
          url: api_list.api_getPersonalWorksSorts,
          method: 'get',
          params:{
            page: this.pageIndex,
            limit: this.count,
          }
        }).then( res => {
          // console.log(res)
          if(res.success){
            this.allWorksData = this.allWorksData.concat(res.data.rows);
            if(this.allWorksData.length >= res.data.total){
              this.loadState = 2;
            } else {
              this.loadState = null;
              this.busy = false;
            }
          } else {
            this.loadState = 0;
          }
        }).catch( err => {
          this.loadState = 0;
        });
      },
      


      // //删除分类
      delSort(inx){
        console.log(inx)
        if(inx !== 0 && inx !== 1){
          request({
            url:api_list.api_deletFollowGroup,
            method: 'delete',
            params:{
              followGroupId: this.sorts[inx].id
            }
          }).then( res => {
            // console.log(res)
            if(res.success){
              this.sorts.splice(inx,1);
              if(inx == this.activeKey){
                this.activeKey = 0;
              }
            }
          }).catch( err => {

          })
        } else {
          this.$dialog({
            message:'不能删除默认和特别分类'
          })
        }
      },
      //切换分类
      onChange(index){
        //状态改为还有数据
        this.noMore = false;
        this.pageIndex = 0;
        this.allWorksData = [];
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
      // //确认添加分类
      confirAdd(){
        // if(this.newSortName == ''){
        //   this.isAdd = false;
        //   this.newSortName = '';
        // } else {
        //   request({
        //     url:api_list.api_createFollowGroup,
        //     method: 'post',
        //     data:{
        //       groupName: this.newSortName
        //     }
        //   }).then( res => {
        //     if(res.success){
        //       this.sorts.push(res.data.item);
        //       this.newSortName = '';
        //       this.isAdd = false;
        //     }
        //   }).catch( err => {

        //   })
        // }
      },

    }
  }
</script>

<style scoped>
  .worksList{
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
  .add-work{
    width: 100%;
    height: .2rem;
  }
</style>
