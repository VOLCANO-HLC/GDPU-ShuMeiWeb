<template>
  <div class="feedsList" :style="{color:textColor}">
    <van-overlay class="feed-mark" :show="showFeedForm" v-if="showFeedForm">
      <feedForm @close="showFeedForm = false;refreshFeedList()"></feedForm>
    </van-overlay>
    <div class="left-bar">
      <leftSider :siderNames="leftItems" :closeBtn="false" @change="onChange"></leftSider>
      <div class="send-feed" @click="showFeedForm = true">
        <i class="el-icon-upload2"> 发布动态</i>
      </div>
    </div>
    <div class="right-content">
      <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
        <feedMsgCart v-for="(item, index) in feedList" :key="item.id" 
        :feedObj="item" 
        :showDelBtn="userId === item.customerId"
        @delBtn="removeFeed(index)"
        @hideBtn="hideFeed(index)"
        ></feedMsgCart>
        <p class="load-text" v-if="loadState===1">加载中...</p>
        <p class="load-text" v-if="loadState===0">加载失败</p>
        <p class="load-text" v-if="loadState===2">没有更多了</p>
      </div>
    </div>
    
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import feedMsgCart from './feedMsgCart'
import leftSider from './leftSider'
import feedForm from './feedForm'
import '@/assets/resetCss/reSpace.css'
import '@/assets/resetCss/reVantCss.css'
export default {
  name:'feedsList',
  data(){
    return{
      // 左侧导航栏的名字
      leftItems: ['全部动态','个人动态'],
      // 动态列表
      feedList: [],
      // 页数
      pageCount: 1,
      // 每次获取的数量
      limitCount: 10,
      // 后台动态的总数
      feedTotal: 0,
      // 左侧列表的下标
      activeKey: 0,
      // 打开发布动态框
      showFeedForm: false,
      // 加载状态
      loadState:null,
      // 控制加载方法的调用
      busy:false,
    }
  },
  components:{feedMsgCart,leftSider,feedForm},
  computed:{
    textColor(){
      return this.$store.state.textColor;
    },
    userId(){
      return this.$store.state.userInfo.id;
    }
  },
  created(){
    
    this.refreshFeedList();
  },
  methods:{
    // 将未读动态数量变为0
    changeNoReadCount(){
      this.$set(this.$store.state.noReadMessage, 0, {index: 0, count: 0})
      // this.$store.commit('updateNoReadMessageCount',{index: 0, count: 0})
    },
    // 加载更多
    loadMore(){
      // 如果已经没数据了，就不要再请求了
      if(this.feedList.length >= this.feedTotal){
        this.loadState = 2;
        return;
      }
      this.getFeedData().then(res => {
        // console.log(res)
        if(res.success){
          this.feedList = this.feedList.concat(res.data.rows);
        }
      });
      this.busy = false;
      this.loadState = null;
    },
    // 隐藏动态
    hideFeed(_index){
      // console.log(_index);
      this.feedList.splice(_index,1)
    },
    // 删除动态信息
    removeFeed(_index){
      // console.log(_index);
      this.$confirm('是否删除该动态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request({
          url: api_list.api_delFeed,
          method: 'delete',
          params:{
            feedId: this.feedList[_index].id
          }
        }).then(res => {
          // console.log(res);
          if(res.success){
            this.$toast({
              message: '删除成功'
            })
            this.hideFeed(_index);
          }
        })
      })
    },
    // 切换动态分组
    onChange(index){
      this.activeKey = index; 
      this.feedList = [];   
      this.refreshFeedList();
    },
    // 刷新动态列表数据
    refreshFeedList(){
      this.pageCount = 1;
      this.busy = false;

      this.getFeedData().then(res => {
        this.feedList = res.data.rows;
        this.feedTotal = res.data.total;
        this.loadState = this.feedTotal>10? null : 2;
        // console.log(res)
        this.changeNoReadCount();
      }).catch(err => {
        this.loadState = 0;
      });

      this.busy = false;
    },
    // 获取动态列表数据
    getFeedData(){
      // 判断请求哪个接口
      let tempUrl = this.activeKey? api_list.api_getPersonalFeedList : api_list.api_getAllFeedData;
      // console.log(tempUrl)
      this.busy = true;
      this.loadState = 1;
      return  request({
        url: tempUrl,
        method: 'get',
        params: {
          page: this.pageCount++,
          limit: this.limitCount
        }
      })
    }
  }
}
</script>

<style scoped>
  .feedsList{
    position: relative;
    height: 98%;
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
  .left-bar{
    position: absolute;
    width: 12%;
    height: 100%;
    border-right: 1px solid rgba(192, 192, 192, 0.5);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .right-content{
    position: absolute;
    right: 0;
    width: 88%;
    height: 100%;
    padding: 0 .1rem;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .send-feed{
    display: flex;
    margin-top: .2rem;
    padding: .1rem 0;
    justify-content: center;
    font-size: .1rem;
    border: 1px solid;
    border-radius: 5px;
    cursor: pointer;
  }
  .feed-mark{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .load-text{
    font-size: .1rem;
    text-align: center;
    font-weight: 500;
  }
</style>
