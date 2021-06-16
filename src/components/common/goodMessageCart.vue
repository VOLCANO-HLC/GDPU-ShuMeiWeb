<template>
  <div class="good-message-cart">
    <div class="user-avatar" @click="gotoAuthorSpace" :style="{backgroundImage: 'url(' + messageObj.customerAvatar + ')'}"></div>
    <div class="message-content">
      <div class="msg-info"><span class="user-name">{{messageObj.customerName}}</span>给你点赞了</div>
      <div class="message-time">{{messageObj.gmtCreate}}</div>
    </div>
    <!-- 链接 -->
    <div class="more-info" :style="{backgroundColor:linkColor}">
      <div class="more-link" v-if="linkType === 0" @click="gotoMoreDetail">{{userName}}:{{messageObj.commentContent}}</div>
      <div class="more-link" v-if="linkType === 1" @click="gotoMoreDetail">{{userName}}:{{messageObj.commentContent}}</div>
    </div>
    <!-- 链接 -->
  </div>
</template>

<script>
  export default{
    name: 'goodMessageCart',
    data(){
      return {
        

      }
    },
    props:{
      messageObj:{
        type: Object
      }
    },
    computed:{
      // 链接类型
      linkType(){
        if(this.messageObj.feedId){
          return 0;
        } else if(this.messageObj.workId){
          return 1;
        }
      },
      linkColor(){
        return this.$store.state.spaceColor;
      },
      userName(){
        return this.$store.state.userInfo.name
      }
    },
    created(){
    },
    methods: {
      // 跳转到详情页面
      gotoMoreDetail(){
        this.$emit('detail');
      },
      // 跳转到用户中心
      gotoAuthorSpace(){
        this.$router.push({path:'/AuthorSpace', query:{id: this.messageObj.customerId}});
      }
    }
  }
</script>

<style scoped>
.good-message-cart{
  position: relative;
  display: flex;
  width: 100%;
  height: .5rem;
  border: 1px solid rgb(255, 255, 255);
  align-items: center;
  padding: 0 .1rem;
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
.message-time{
  /* position: absolute; */
  font-size: .05rem;
  margin-top: .05rem;
}
.more-info{
  position: absolute;
  right: .1rem;
  width: .5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* border: 1px solid black; */
}
.more-link{
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: .08rem;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: .05rem;
}
</style>