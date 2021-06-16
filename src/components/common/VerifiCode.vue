<template>
  <div class="verifiCode">
    <input type="text" v-model="ruleForm.code" placeholder="请输入验证码" @blur="">
    <el-button type="info" @click="sendCode" ref="sendBtn" :disabled="isSend">发送<span v-show="isSend">({{timeNum}})</span></el-button>
    <p v-show="!isVerified">请填写验证码</p>
  </div>
</template>

<script>
  export default{
    name:'verifiCode',
    data(){
      return{
        //是否有验证码
        isVerified: true,
        //是否点击发送
        isSend: false,
        //验证码倒计时
        timeNum:60,
      }
    }
  }
</script>

<style scoped>
.verifiCode{
  height: .3rem;
}
.verifiCode input{
  width: 1rem;
  height: .2rem;
  background: rgb(255,255,255,.5);
  border: 1px solid rgb(255,255,255,.5);
  font-size: .1rem;
  outline: none;
  padding-left: .05rem;
}
.verifiCode p{
  font-size: .08rem;
  line-height: .06rem;
  margin-top: .02rem;
  padding: 0;
  color: #F56C6C;
}
</style>