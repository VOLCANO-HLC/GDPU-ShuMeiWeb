<template>
  <div class="feed-comment">
    <div class="user-info">
      <div class="user-avatar" :style="{backgroundImage: 'url(' + commentObj.avatar + ')'}" @click="clickAvatar"></div>
      <div class="user-name">{{commentObj.customerName}}</div>
      <div class="call-other" v-if="replyOther" @click="clickOther">@{{commentObj.repliedCustomerName}}</div>
    </div>
    <div style="position: relative;display: flex;">
      <div :class="{'comment-content': true, 'text-overflow': !open}">{{commentObj.content}}</div>
      <span class="more-text" v-if="overMaxLength && !open" @click="open = true">详情...</span>
      <span class="more-text" v-if="overMaxLength && open" @click="open = false">收起</span>
    </div>
    <div class="comment-info">
      <div class="comment-time">{{commentObj.gmtCreate}}</div>
      <div class="comment-meta">
        <van-icon name="good-job-o" :class="{'is-like': isGive}" style="cursor: pointer;" @click="giveGood">{{likeCount}}</van-icon>
        <van-icon name="chat-o" v-if="!hideComment" style="cursor: pointer;" @click="reply">{{replyCount}}</van-icon>
        <span class="comment-reply" v-if="!isUser" style="cursor: pointer;" @click="comment">评论</span>
        <span class="comment-reply" v-if="isUser" style="cursor: pointer;" @click="delComment">删除</span>
      </div>
    </div>
    <div class="comment-banner" v-if="showCommentBar">
      <commentBar :bandSend="bandSend" @reply="sendReply"></commentBar>
    </div>
  </div>
</template>

<script>
import commentBar from './commentBar'
export default{
  name: 'feedComment',
  data(){
    return {
      open: false,
      // 点赞样式
      isGive: false,
      // 点赞数
      likeCount: 0,
      // 是否打开评论框
      openCommentBar:false
    }
  },
  components:{commentBar},
  props:{
    commentObj: {
      type: Object,
    },
    showCommentBar:{
      type: Boolean,
      default: false
    },
    hideComment:{
      type: Boolean,
      default: false
    },
    bandSend: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    overMaxLength(){
      return this.commentObj.content.length > 101;
    },
    // 显示数量控制在99+
    replyCount(){
      if(this.commentObj.replyCount > 99){
        return '99+';
      } else {
        return this.commentObj.replyCount;
      }
    },
    replyOther(){
      return this.commentObj.repliedCommentId !== this.commentObj.parentCommentId;
    },
    isUser(){
      return this.$store.state.userInfo.id === this.commentObj.customerId
    }
  },
  created(){
    // console.log(this.commentObj)
    this.initStyle()
  },
  methods:{
    // 点击头像
    clickAvatar(){
      this.$emit('clickAvatar')
    },
    // 点击回复的用户
    clickOther(){
      this.$emit('clickOther')
    },
    // 发送评论
    sendReply(_content){
      // console.log(this.commentObj)
      this.$emit('sendReply',{_content,commentObj: this.commentObj})
    },
    // 删除评论按钮
    delComment(){
      this.$emit('delComment')
    },
    // 评论按钮
    comment(){
      this.$emit('comment')
    },
    // 回复按钮
    reply(){
      this.$emit('reply')
    },
    // 点赞
    giveGood(){
       // 点赞后更新点赞状态
      this.likeCount += this.isGive? -1 : 1;
      this.isGive = this.isGive? false : true;
      this.$emit('giveLike');
    },
    initStyle(){
      this.isGive = this.commentObj.liked;
      this.likeCount = this.commentObj.likeCount;
    }
  }
}
</script>

<style scoped>
.feed-comment{
  position: relative;
  box-sizing: border-box;
  width: 100%;
  /* border: 1px solid black; */
  padding: .05rem .1rem;
}
.user-info{
  width: 100%;
  height: .2rem;
  display: flex;
  align-items: center;
}
.user-avatar{
  width: .2rem;
  height: .2rem;
  border: 1px solid #fff;
  border-radius: 50%;
  background-size: cover;
  cursor: pointer;
}
.user-name{
  font-size: .1rem;
  margin-left: .1rem;
  color:rgb(75, 75, 75);
}
.call-other{
  font-size: .08rem;
  margin-left: .1rem;
  color:rgb(23, 169, 226);
  cursor: pointer;
}
.comment-content{
  font-size: .08rem;
  text-indent: .16rem;
  margin: .05rem .1rem;
}
.text-overflow{
  /* position: relative; */
  /* height: .16rem; */
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.more-text{
  display: block;
  position: absolute;
  right: 0;
  bottom: .05rem;
  font-size: .05rem;
  color: rgb(23, 169, 226);
  cursor: pointer;
}
.comment-info{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.1rem;
}
.comment-time{
  font-size: .06rem;
  color:rgb(75, 75, 75);
}
.comment-meta{
  font-size: .08rem;
  display: flex;
  align-items: center;
}
.comment-meta i{
  margin-right: .1rem;
}
.is-like{
  color: #3395d6;
}
.comment-reply{
  margin-left: .1rem;
}
.comment-banner{
  margin: .1rem 0;
}
</style>