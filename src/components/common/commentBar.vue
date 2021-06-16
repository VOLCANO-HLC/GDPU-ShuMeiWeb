<template>
  <div class="comment-bar">
    <div class="login-btn" v-if="!isLogin">
      <router-link to="/Login" class="login-btn">登录</router-link> 或 
      <router-link to="/Register" class="register-btn">注册</router-link>
    </div>
    <div class="user-avatar" :style="{backgroundImage: 'url(' + avatar + ')'}" v-if="isLogin && !hideAvatar"></div>
    <div class="comment-banner">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="textarea"
        resize="none"
        rows="3"
        :maxlength="maxCount"
        show-word-limit
        >
      </el-input>
    </div>
    <div class="reply-btn">
      <el-button type="primary" @click="replyBtn" :disabled="bandSend">发送</el-button>
    </div>
  </div>
</template>

<script>
export default{
  name: 'commentBar',
  data(){
    return {
      textarea: '',
      isLogin: false
    }
  },
  props:{
    maxCount: {
      type: Number || String,
      default: 1000
    },
    hideAvatar: {
      type: Boolean,
      default: false
    },
    bandSend: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    avatar(){
      return this.$store.state.userInfo.avatar;
    }
  },
  created(){
    this.loginCheck();
  },
  methods: {
    // 回复按钮
    replyBtn(){
      if(this.isLogin){
        // console.log(this.textarea)
        this.$emit('reply', this.textarea);
        this.textarea = '';
      } else {
        this.$toast({
          message: '请先登录'
        })
      }
    },
    // 检查是否登录
    loginCheck(){
      this.isLogin = this.$cookies.get('user_token')? true : false;
      // console.log(this.isLogin)
    }
  }
}
</script>

<style scoped>
.comment-bar{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 .05rem;
}
.user-avatar{
  width: .3rem;
  height: .3rem;
  border: 1px solid #fff;
  border-radius: 50%;
  background-size: cover;
}
.comment-banner,.reply-btn{
  display: flex;
}
.comment-banner{
  width: 3rem;
}
.login-btn{
  font-size: .1rem;
}
</style>