<template>
  <div class="Login">
    <commonHeader></commonHeader>
    <!-- 成功消息框 -->
    <dialogSimple v-if="openDialog" @closeDialog="openDialog=false" :message="resMsg"></dialogSimple>
    <!-- 成功消息框 -->
    <div class="mark">
      <div class="loginWrap">
        <!-- 登录标题 -->
        <div class="title">
          <h1>登录</h1>
        </div>
        <!-- 登录标题 -->

        <!-- 表单 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
        status-icon  class="demo-ruleForm" label-position="left">
          <el-form-item prop="mobile">
            <el-input v-model.trim="ruleForm.mobile"  placeholder="手机号:" suffix-icon="el-icon-user" @keyup.enter.native="confirm('ruleForm')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" suffix-icon="el-icon-lock" autocomplete="off" placeholder="密码:" @keyup.enter.native="confirm('ruleForm')"></el-input>
          </el-form-item>
          
          <div class="login-serve">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
            <span @click="findPassBtn">忘了密码？</span>
          </div>
          
          <el-form-item>
            <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
            <el-button @click="reset('ruleForm')">重置</el-button>
          </el-form-item>
          <div class="registerBar">
            <span @click="registerBtn">注册</span>
          </div>
        </el-form>
      <!-- 表单 -->
      
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request';
import api_list from '@/network/api_list';
import dialogSimple from './common/dialogSimple';
import commonHeader from './common/CommonHeader';
import '@/assets/resetCss/reLogin.css';
  export default{
    name:'Login',
    data(){
      //正则检验手机号
      var checkMobile = (rule, value, callback) => {
        let reg = /^1[3-9][0-9]{9}$/;
        if(reg.test(value)){
          callback();
        } else {
          callback(new Error('格式错误'))
        }
      }
      return{
        ruleForm:{
          mobile:'',
          password:'',
        },
        //记住密码
        checked: false,
        //消息确认
        openDialog: false,
        //返回的消息
        resMsg: '',
        rules:{
          //手机号校验
          mobile:[
            {required:true, message:"请输入手机号", trigger:"blur"},
            {validator: checkMobile, trigger:"blur"}
          ],
          //密码校验
          password:[
            {required:true, message:"请输入密码", trigger:"blur"}
          ]
        }
      }
    },
    created(){
      //判断是否cookie存储了密码
      if(this.$cookies.isKey("user_pass")){
        this.ruleForm.mobile = this.$cookies.get("user_moblie");
        this.ruleForm.password = this.$cookies.get("user_pass");
      }
    },
    methods:{
      //找回密码
      findPassBtn(){
        this.$router.push({path:"/FindPass",query:{id:this.ruleForm.mobile}});
      },
      //注册
      registerBtn(){
        this.$router.push('/register')
      },
      //登录
      confirm(formName){
        //用refs调用表单对象，并调用validate方法判断是否有输入，valid为Boolean类型
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loginInfo = {
              mobile: this.ruleForm.mobile,
              password: this.ruleForm.password
            }
            //发送请求
            request({
              url: api_list.api_login,
              method: 'post',
              data: {
                mobile: this.ruleForm.mobile,
                password: this.ruleForm.password
              }
            }).then( res => {
              //成功
              if(res.success){
                //用cookie保存token
                this.$cookies.set("user_token",res.data.token,'3*24*60*6000');
                //记住密码就cookie保存
                if(this.checked){
                  this.$cookies.set("user_moblie",this.ruleForm.mobile,'3*24*60*6000');
                  this.$cookies.set("user_pass",this.ruleForm.password,'3*24*60*6000');
                }
                this.$router.push('/');
              } else if(res.code === 28008) {
                //失败,密码不正确
                this.$refs.ruleForm.fields[1].validateMessage = "密码不正确";
                this.$refs.ruleForm.fields[1].validateState = "error";
                this.ruleForm.password = '';
              } else if(res.code === 28001){
                this.$refs.ruleForm.fields[0].validateMessage = "账号不存在";
                this.$refs.ruleForm.fields[0].validateState = "error";
              } else {
                this.resMsg = "登录失败";
                this.openDialog = true;
              }
              
            }).catch(err => {
              console.log(err)
              this.resMsg = "登录失败";
              this.openDialog = true;
            });

          } else {
            return false;
          }
        });
        // this.$refs.ruleForm.fields[1].validateState = "error"
        // console.log(this.$refs.ruleForm.fields[1].validateState)
      },
      //重置表单
      reset(formName){
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields();
      }
    },
    components:{
      dialogSimple,
      commonHeader
    }
  }
</script>

<style scoped>
  .Login{
    width: 100vw;
    height: 100vh;
    background-image: url("../assets/imgs/login_backImg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;

    box-sizing: border-box;
  }
  .mark{
    width: 100%;
    height: 100vh;
    padding-top: 0;
    background: rgb(0,0,0,.4);
    animation: formDown .6s;
    animation-fill-mode: forwards;
  }
  .loginWrap{
    width: 2.5rem;
    background: rgb(255,255,255,.5);
    margin: 0 auto;
    box-shadow: .01rem .01rem .06rem rgb(136, 136, 136);
    padding: .1rem .2rem;
    border-radius: .2rem;
  }
  .title h1{
    padding: 0;
    font-size: .2rem;
    text-align: center;
    font-weight: 500;
    font-family: "宋体";
  }
  .login-serve{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: .2rem;
    margin-bottom: .15rem;
  }
  .login-serve span{
    font-size: .07rem;
    float: right;
    text-decoration: none;
    color: #551a8b;
    cursor: pointer;
  }
  .registerBar{
    height: .1rem;
  }
  .registerBar span{
    font-size: .08rem;
    display: block;
    text-align: center;
    color: #551a8b;
    cursor: pointer;
    text-decoration: underline;
  }
 
  @keyframes formDown {
    from{padding-top: 0;}
    to{padding-top: 1.1rem}
  }
</style>