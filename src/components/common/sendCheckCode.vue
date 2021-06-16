<template>
  <div class="send-check-code">
    <input class="check-input" type="text" placeholder="请填写验证码" v-model="checkCode" @blur="onBlur">
    <el-button type="info" @click="sendCode" ref="sendBtn" :disabled="isSend || banSend">发送<span v-show="isSend">({{timeNum}})</span></el-button>
    <p class="check-msg" v-show="!isTrue">请输入正确验证码</p>
  </div>
</template>

<script>
export default {
  name: 'sendCheckCode',
  data(){
    return {
      //验证码倒计时
      timeNum: 0,
      //是否点击发送
      isSend: false,
      //是否有验证码
      isVerified: false,
      checkCode: ''
    }
  },
  props:{
    banSend: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 60
    },
    isTrue:{
      type: Boolean,
      default: false
    }
  },
  created(){
    this.timeNum = this.count
  },
  methods: {
    //倒计时
    countDown(){
      let timer = setInterval(() => {
        this.timeNum --;
        if(this.timeNum === 0){
          this.isSend = false;
          this.timeNum = this.count;
          clearInterval(timer);
        }
      }, 1000); 
    },
    //发送验证码
    sendCode(){
      this.$emit('send');
      this.isSend = true
      this.countDown();
    },
    onBlur(){
      this.$emit('onBlur', this.checkCode);
    }
  }
}
</script>

<style scoped>
.send-check-code{
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  /* align-items: center; */
}
.check-input{
  width: 1rem;
  height: .2rem;
  background: rgb(255,255,255,.5);
  border: 1px solid rgb(255,255,255,.5);
  font-size: .1rem;
  outline: none;
  padding-left: .05rem;
}
.check-msg{
  font-size: .08rem;
  line-height: .06rem;
  margin-top: .02rem;
  padding: 0;
  color: #F56C6C;
}
</style>