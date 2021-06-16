<template>
  <div class="message-detail">
    <div class="user-info" v-if="messageObj.workId">
      <div class="user-avatr" :style="{backgroundImage: 'url(' + messageObj.customerAvatar + ')'}"></div>
      <div class="user-name">{{messageObj.customerName}}</div>
    </div>
    <div class="message-content">
      <feedMsgCart v-if="!messageObj.workId && feedObj" :feedObj="feedObj" :openComment="true" :showOptions="false"></feedMsgCart>
      <worksCart v-if="messageObj.workId" ：workObj="workObj"></worksCart>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import feedMsgCart from './feedMsgCart.vue'
import worksCart from './worksCart.vue'
export default{
  name: 'messageDetail',
  data(){
    return {
      // 动态详情对象
      feedObj: null,
      // 作品对象
      workObj: {}
    }
  },
  props: {
    messageObj:Object
  },
  components: {feedMsgCart,worksCart},
  created(){
    // console.log(this.messageObj)
    this.getMessageDetail();
  },
  methods: {
    // 获取消息详细内容
    getMessageDetail(){
      if(this.messageObj.workId){
        request({
          url: api_list.api_getWorkInfo,
          method: 'get',
          params: {
            workId: this.messageObj.workId
          }
        }).then(res => {
          console.log(res);
          if(res.success){
            this.workObj = res.data.item
          }
        })
      } else {
        request({
          url: api_list.api_getFeedDetail,
          method: 'get',
          params: {
            feedId: this.messageObj.feedId
          }
        }).then(res => {
          // console.log(res)
          if(res.success){
            this.feedObj = res.data.item
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.message-detail{
  width: 5rem;
  height: 100%;
  background-color: #fff;
  margin: 0 auto;
  padding: .1rem;
  box-sizing: border-box;
  overflow-y: auto;
}
.user-info{
  display: flex;
  width: 100%;
  align-items: center;
  padding-bottom: .2rem;
  border-bottom: 1px solid rgb(211, 211, 211);
}
.user-avatr{
  width: .3rem;
  height: .3rem;
  background-size: cover;
  border-radius: 50%;
}
.user-name{
  font-size: .1rem;
  color: black;
  font-weight: 600;
  margin-left: .2rem;
}
.message-content{
  overflow-y: auto;
}
</style>