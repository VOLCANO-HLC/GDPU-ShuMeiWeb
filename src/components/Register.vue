<template>
  <div class="register">
    <commonHeader :isFixed="true"></commonHeader>
    <!-- 成功消息框 -->
    <dialogSimple v-if="openDialog" @closeDialog="gotoLogin" :message="resMsg"></dialogSimple>
    <!-- 成功消息框 --> 
    <div class="bgMark">
      <div class="registerWrap">
        <!-- 注册标题 -->
        <div class="title">
          <h1>注册</h1>
        </div>
        <!-- 注册标题 -->
        <!-- 表单 -->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" 
          status-icon label-width=".59rem"  class="demo-ruleForm" label-position="left" hide-required-asterisk>
            <el-form-item label="用户名:" prop="username">
              <el-input v-model="ruleForm.username" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input type="password" v-model="ruleForm.password" clearable autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" clearable autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="mobile">
              <el-input v-model.number="ruleForm.mobile" @blur="checkMobile" clearable></el-input>
            </el-form-item>
            <el-form-item class="verifiedCode">
              <sendCheckCode :banSend="isBan" :isTrue="isVerified" @send="sendShortMsg" @onBlur="checkCode"></sendCheckCode>
            </el-form-item>
            <el-form-item
              prop="email"
              label="邮箱:"
            >
              <el-input v-model="ruleForm.email" clearable></el-input>
            </el-form-item>
            <el-form-item class="buttonBar">
              <el-button type="primary" @click="submitForm('ruleForm')" :disabled="subBtnDown">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        <!-- 表单 -->
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/resetCss/reRegister.css';
import {request} from '@/network/request';
import dialogSimple from './common/dialogSimple';
import commonHeader from './common/CommonHeader';
import sendCheckCode from './common/sendCheckCode';
import api_list from '@/network/api_list'
  export default{
    name:'Register',
    data(){
      //检测密码的变量
      var check = (rule, value, callback) => {
        if(value === ''){
          return callback(new Error('请确认密码'));
        } else if( value !== this.ruleForm.password){
          return callback(new Error('再次输入的密码不正确'));
        } else {
          callback();
        }
      };
      //检验手机号
      var mobile = (rule, value, callback) => {
        if(value === ''){
          return callback(new Error('请输入手机号'));
        } else if( !(/^1[3-9][0-9]{9}$/).test(value)){
          return callback(new Error('格式错误'));
        } else {
          callback();
        }
      };
      return{
        ruleForm:{
          username:'',
          password:'',
          checkPass:'',
          mobile:'',
          code:'',
          email:'',
        },
        //是否有验证码
        isVerified: true,
        // 是否禁用发送按钮
        isBan: true,
        // 是否验证码正确
        isCheck: false,
        //消息确认
        openDialog: false,
        //返回的消息
        resMsg: '',
        // 按下提交按钮
        subBtnDown: false,
        //认证规则
        rules:{
          //校验用户名
          username:[
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          //校验密码
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          //邮箱
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '邮箱地址错误', trigger: 'blur'}
          ],
          //检验重输入密码
          checkPass:[
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {validator:check, trigger:'blur'}
          ],
          //检测手机号
          mobile:[
            {validator:mobile, trigger:'blur'}
          ]
        }
      }
    },
    methods:{
      //跳转登录界面
      gotoLogin(){
        this.openDialog = false;
        if(this.resMsg.includes('成功')){
          this.$router.push('/Login');
        }
      },
      // 验证手机号，判断是否禁用发送按钮
      checkMobile(){
        let reg = new RegExp(/^1[3-9][0-9]{9}$/);
        this.isBan = !reg.test(this.ruleForm.mobile);
      },
      // 验证码校验
      checkCode(_code){
        let reg = /[^\s]/;
        if(!this.ruleForm.mobile || !reg.test(_code)){
          return;
        }
        request({
          url: api_list.api_checkShortMessageCode,
          method: 'post',
          data:{
            phoneNumber: this.ruleForm.mobile,
            verificationCode: _code
          }
        }).then(res => {
          console.log(res)
          this.ruleForm.code = _code;
          this.isVerified = res.success;
          this.isCheck = res.success;
        })
      },
      //发送短信
      sendShortMsg(){
        if(!this.ruleForm.mobile){
          return false;
        }
        request({
          url: api_list.api_sendShortMessage,
          method: 'post',
          params:{
            type: 0,
          },
          data:{
            phoneNumber: this.ruleForm.mobile
          }
        }).then(res => {
          // console.log(res)
        })
      },
      //提交
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid && this.isCheck) {
            // 加载
            let loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });  
            this.subBtnDown = true;  // 禁用提交按钮
            //发送请求
            request({
              url: api_list.api_register,
              method: 'post',
              data: {
                name: this.ruleForm.username,
                email: this.ruleForm.email,
                mobile: this.ruleForm.mobile,
                code: this.ruleForm.code,
                password: this.ruleForm.password
              }
            }).then( res => {
              //如果注册成功
              this.resMsg = res.message
              this.openDialog = true;
              this.subBtnDown = false;
              loading.close();
            }).catch(err => {
              this.subBtnDown = false;
              loading.close();
            })
          } else {
            return false;
          }
        });
        // console.log(this.ruleForm.code)
        //判断验证码是否填写
        this.isVerified = this.ruleForm.code === ''? false : true;
      },
      //重置输入信息
      resetForm(formName){
        // console.log(this.$refs[formName])
        this.$refs[formName].resetFields();
        this.isVerified = true;
      }
    },
    components:{
      dialogSimple,
      commonHeader,
      sendCheckCode
    }
  }
</script>

<style scoped>
.register{
  width: 100%;
  height: 100vh;
  background-image: url('../assets/imgs/login_backImg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
.bgMark{
  width: 100%;
  height: 100%;
  padding-top: 0;
  background: rgb(0,0,0,.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.registerWrap{
  width: 2.5rem;
  background: rgb(255,255,255,.5);
  margin: 0 auto;
  box-shadow: .01rem .01rem .06rem rgb(136, 136, 136);
  padding: .1rem .2rem;
  border-radius: 10px;
  animation: formDown 0.5s forwards;
}
.title h1{
    padding: .1rem;
    margin: 0;
    font-size: .2rem;
    text-align: center;
    font-weight: 500;
    font-family: "宋体";
}
.verifiedCode{
  height: .3rem;
}
.buttonBar{
  margin-top: .2rem;
}

@keyframes formDown {
  from{transform: scale(0.5);}
  to{transform: scale(1);}
}
</style>