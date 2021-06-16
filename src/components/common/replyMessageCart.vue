<template>
  <div class="reply-message-cart">
   
    <div class="user-avatar" @click="gotoAuthorSpace" :style="{backgroundImage: 'url(' + messageObj.customerAvatar + ')'}"></div>
    
    <div class="message-content">
      <div class="msg-info"><span class="user-name">{{messageObj.customerName}}</span>回复了你:</div>
      <div :class="{'reply-content': true, 'text-overflow': !moreText}">
        {{messageObj.comment}}
        <span v-show="!moreText && isOverText" class="more-text" @click="moreText = moreText? false : true">详情</span>
        <span v-show="moreText && isOverText" class="more-text" @click="moreText = moreText? false : true">收起</span>
      </div>
      
      <div class="mesg-meta">{{messageObj.gmtCreate}}
        <!-- <van-icon name="good-job-o" size=".1rem" @click="giveLike"/> -->
        <van-icon v-if="!isUser" name="chat-o" size=".1rem" @click="openReply = openReply? false : true"/>
      </div>
      <div class="comment-reply">
        <commentBar v-if="openReply" :hideAvatar="true" @reply="beforeSend"></commentBar>
      </div>
    </div>
    <!-- 链接 -->
    <div class="more-info" :style="{backgroundColor:linkColor}">
      <div class="more-link" v-if="linkType === 1" @click="gotoMoreDetail">{{userName}}:{{messageObj.repliedComment}}</div>
      <div class="more-link" v-if="linkType === 0" @click="gotoMoreDetail">{{userName}}:{{messageObj.repliedComment}}</div>
    </div>
    <!-- 链接 -->
  </div>
</template>

<script>
import commentBar from './commentBar.vue'
import {request} from '@/network/request'
import api_list from '@/network/api_list'
export default{
  name: 'replyMessageCart',
  data(){
    return {
      linkType: 0,
      // 展开更多文本信息
      moreText: false,
      openReply: false,
      isLiked: 1,
    }
  },
  props:{
    messageObj: {
      type: Object,
      default: {}
    }
  },
  components: {commentBar},
  computed: {
    // 超出文本长度
    isOverText(){
      if(this.messageObj.comment.length > 79){
        return true;
      } else {
        return false;
      }
    },
    linkColor(){
      return this.$store.state.spaceColor;
    },
    isUser(){
      return this.$store.state.userInfo.id === this.messageObj.customerId
    },
    userName(){
      return this.$store.state.userInfo.name
    }
  },
  created(){
    this.linkType = this.messageObj.type;

  },
  methods: {
    
    // 回复按钮
    beforeSend(_content){
      // this.$emit('send', _content);
      if(this.linkType){
        // 动态
        this.sendToFeed(_content, this.messageObj.parentCommentId);
      } else {
        // 作品
        this.sendToWork(_content, this.messageObj)
      }
    },
    // 发送给作品下的评论
    sendToWork(_content, _message){
      // console.log(_message)
      let parentId = _message.parentCommentId;
      if(!parentId){
        parentId = this.messageObj.commentId;
      }
      request({
        url: api_list.api_postReplyToPerson,
        method: 'post',
        data: {
          workId: _message.workId,
          content: _content,
          repliedCommentId: _message.commentId,
          repliedCustomerId: _message.customerId,
          parentCommentId: parentId,
        }
      }).then(res => {
        // console.log(res)
      })
      
    },
    // 发送给动态下的评论
    sendToFeed(_content,parentCommentId){
      let parentId = null;
      if(!parentCommentId){
        parentId = this.messageObj.commentId;
      } else {
        parentId = parentCommentId;
      }
      let _url = api_list.api_sendCommentReply;
      request({
        url: _url,
        method: 'post',
        data: {
          feedId: this.messageObj.feedId,
          content: _content,
          repliedCommentId: this.messageObj.commentId,
          repliedCustomerId: this.messageObj.customerId,
          parentCommentId: parentId,
        }
      }).then(res => {
        // console.log(res)
        if(res.success){
          this.$toast({
            message: '回复成功'
          })
        }
      })
    },
    // 回复
    reply(){

    },
    // 跳转到详情页面
    gotoMoreDetail(){
      this.$emit('detail');
    },
    // 跳转到用户中心
    gotoAuthorSpace(){
      this.$router.push({path:'/AuthorSpace', query:{id: this.messageObj.customerId}})
    }
  }
}
</script>

<style scoped>
.reply-message-cart{
  position: relative;
  display: flex;
  width: 100%;
  border: 1px solid rgb(255, 255, 255);
  /* align-items: center; */
  padding: .1rem .1rem;
  box-sizing: border-box;
  border-radius: 10px;
}
.user-avatar{
  width: .3rem;
  height: .3rem;
  border: 1px solid #fff;
  border-radius: 50%;
  background-size: cover;
  cursor: pointer;
}
.user-name{
  font-size: .12rem;
  margin-right: .1rem;
  font-weight: 600;
}
.message-content{
  position: relative;
  margin-left: .2rem;
}
.msg-info{
  font-size: .1rem;
}
.mesg-meta{
  font-size: .05rem;
  margin-bottom: .05rem;
}
.mesg-meta i{
  margin-left: .1rem;
}
.more-info{
  position: absolute;
  right: .1rem;
  width: .5rem;
  height: .5rem;
  /* border: 1px solid black; */
}
.reply-content{
  position: relative;
  font-size: .1rem;
  font-family: "宋体";
  margin: .05rem 0;
  width: 3rem;
  text-overflow: ellipsis;
  overflow: hidden;
}
.more-text{
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: .08rem;
  color: rgb(37, 138, 253);
 
}
.text-overflow{
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.more-link{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: .08rem;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: .05rem;
  cursor: pointer;
}
</style>