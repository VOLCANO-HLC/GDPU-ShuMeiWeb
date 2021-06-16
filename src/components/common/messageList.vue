<template>
  <div class="message-list" :style="{color:textColor}">
    <van-overlay v-if="showDetail" :show="showDetail">
      <messageDetail :messageObj="msgDetailObj"></messageDetail>
      <div class="close-detail" @click.stop="showDetail = false">
        <i class="el-icon-close"></i>
      </div>
    </van-overlay>
    <div class="left-sider">
      <leftSider :activeKey="activeKey" :siderNames="siderNames" :closeBtn="false"
       @change="onChange" :bages="noReadCount" v-if="isLoad"></leftSider>
    </div>

    <div class="right-sider">
      <div class="message-content">
        <div v-infinite-scroll="loadMore" :infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="true">
          <div v-if="activeKey === 0" v-for="(item, index) in likedMsgList" :key="item.likeId" style="margin-bottom: .05rem;">
            <goodMessageCart
            :messageObj="item"
            @detail="gotoDetail(item)"
            ></goodMessageCart>
          </div>
          <div v-if="activeKey === 1" v-for="(item, index) in replyMsgList" :key="item.commentId" style="margin-bottom: .05rem;">
            <replyMessageCart
            :messageObj="item" @detail="gotoDetail(item)" @send="replyFn(item)"></replyMessageCart>
          </div>
          <p class="load-text" v-if="loadState===1">加载中...</p>
          <p class="load-text" v-if="loadState===0">加载失败</p>
          <p class="load-text" v-if="loadState===2">没有更多了</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import leftSider from './leftSider.vue'
import messageDetail from './messageDetail.vue'
import replyMessageCart from './replyMessageCart.vue'
import goodMessageCart from './goodMessageCart.vue'

export default{
  name: 'messageList',
  data(){
    return {
      siderNames: ['点赞','回复'],
      isLoad: true,
      // 左侧栏的选择
      activeKey: 0,
      // 控制加载
      busy: true,
      // 加载状态
      loadState: 2,
      // 当前页数
      pageCount: 1,
      // 每次加载的个数
      limitCount: 15,
      // 点赞消息列表
      likedMsgList: [],
      // 回复消息列表
      replyMsgList: [],
      // 消息总数
      msgTotal: 0,
      // 显示消息详情
      showDetail: false,
      // 要显示的详情消息对象
      msgDetailObj: {},
      // 未读消息数量
      noReadCount: []
    }
  },
  components:{leftSider,goodMessageCart,replyMessageCart,messageDetail},
  computed:{
    textColor(){
      return this.$store.state.textColor;
    }
  },
  created(){
    this.refreshList();
    this.getNoReadCommentCount();
    
  },
  methods: {

    // 改变未读信息数量
    changeNoReadCount(){
      this.$set(this.noReadCount, this.activeKey, 0);
    },
    // 去往详情页面
    gotoDetail(_item){
      // console.log(_item)
      if(_item.workId){
        this.$router.push({path:'/WorkExhibition', query: {id: _item.workId, customerId: this.$store.state.userInfo.id}});
      } else {
        this.showDetail = true;
        this.msgDetailObj = _item;
      }
    },
    // 加载更多
    loadMore(){
      // 如果已经没有更多了，就返回
      if(this.loadState === 2){
        return;
      }
      this.refreshList();
    },
    // 切换分组
    onChange(_index){
      this.activeKey = _index;
      this.pageCount = 1;
      this.likedMsgList = [];
      this.replyMsgList = [];
      this.refreshList();
      this.changeNoReadCount();
      // console.log(this.activeKey)
    },
    // 刷新列表
    refreshList(){
      this.getMessageList().then(res => {
        // console.log(res)
        this.$set(this.$store.state.noReadMessage, 3, {index: 3, likedCount: 0, commentCount: 0, count: 0})
        this.busy = false;
        if(res.success){
          if(!res.data.rows){
            this.loadState = 2;
            return;
          }
          this.msgTotal = res.data.total;
          // 判断获取哪个分组的消息
          if(this.activeKey === 0){
            this.likedMsgList = this.likedMsgList.concat(res.data.rows);
            // 如果总数超过了，就不在获取了
            if(this.likedMsgList.length >= res.data.total){
              this.loadState = 2;
              this.busy = true;
            }
          } else {
            this.replyMsgList = this.replyMsgList.concat(res.data.rows);
            // 如果总数超过了，就不在获取了
            if(this.replyMsgList.length >= res.data.total){
              this.loadState = 2;
              this.busy = true;
            }
          }
        } else {
          this.loadState = 0;
        }
      }).catch(err => {
        this.busy = false;
        this.loadState = 0;
      });
    },
    // 获取未读评论数量
    getNoReadCommentCount(){
      request({
        url: api_list.api_getNoReadCommentCount,
        method: 'get',
      }).then(res => {
        // console.log("aa",res);
        this.$set(this.noReadCount, 1, res.data.count);
        
      })
    },
    // 获取未读点赞数量
    getNoReadLikedCount(){
      request({
        url: api_list.api_getNoReadLikedCount,
        method: 'get',
      }).then(res => {
        console.log(res);
        this.$set(this.noReadCount, 0, 0);
      })
    },

    // 获取消息列表信息
    getMessageList(){
      this.busy = true;
      this.loadState = 1;
      let _url = null;
      if(this.activeKey === 0){
        _url = api_list.api_getLikedMessage;
      } else {
        _url = api_list.api_geReplyMessage;
      }
      return request({
        url: _url,
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
.message-list{
  position: relative;
  width: 100%;
  height: 100%;
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
.close-detail{
  position: absolute;
  top: 0;
  right: .1rem;
  color: rgb(185, 185, 185);
  font-size: .2rem;
  cursor: pointer;
}
</style>scoped