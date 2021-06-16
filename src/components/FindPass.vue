<template>
  <div class="findPass">
    <dialogSimple v-if="openDialog" @closeDialog="gotoLogin" :message="resMsg"></dialogSimple>
    <div class="mark">
      <div class="finPassWrap">
        <div class="title">
          <h1>修改密码</h1>
        </div>
        <!-- 手机验证 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
        status-icon  class="demo-ruleForm" label-position="left">
          <el-form-item prop="mobile">
            <el-input v-model="ruleForm.mobile" placeholder="手机号:" suffix-icon="el-icon-user" @blur="checkMobile"></el-input>
          </el-form-item>
          
          <el-form-item v-if="showModify" prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="新密码:" clearable autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item v-if="showModify" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" placeholder="确认密码:" clearable autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item v-if="!showModify" class="verifiedCode">
            <sendCheckCode :isTrue="isCheck" :banSend="isBan" @send="sendMsg" @onBlur="checkCode"></sendCheckCode>
          </el-form-item>

          <el-form-item class="confirm-btn">
            <el-button v-if="!showModify" type="primary" @click="confirm">确定</el-button>
            <el-button v-if="showModify" type="primary" @click="save('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
        <!-- 手机验证 -->
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request';
import api_list from '@/network/api_list';
import sendCheckCode from './common/sendCheckCode';
import dialogSimple from './common/dialogSimple';
  export default{
    name:'findPass',
    data(){
      //正则检验手机号
      var checkMobile = (rule, value, callback) => {
        let reg = /^1[3-9][0-9]{9}$/;
        if(reg.test(value)){
          callback();
        } else {
          callback(new Error('格式错误'))
        }
      };
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
      return{
        ruleForm:{
          mobile:'',
          password: '',
          checkPass: '',
        },
        // 是否禁用发送按钮
        isBan: true,
        // 是否验证码正确
        isCheck: false,
        // 显示修改框
        showModify: false,
        // 打开对话框
        openDialog: false,
        // 修改信息
        resMsg: '',
        //校验规则
        rules:{
          mobile:[
            {required:true, message:"请输入手机号", trigger:"blur"},
            {validator: checkMobile, trigger:"blur"}
          ],
          //校验密码
          password:[
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          //检验重输入密码
          checkPass:[
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {validator:check, trigger:'blur'}
          ]
        }
      }
    },
    components:{sendCheckCode,dialogSimple},
    methods:{
      // 跳转登录界面
      gotoLogin(){
        this.openDialog = false;
        if(this.resMsg.includes('修改成功')){
          this.$router.push('/Login');
        }
      },
      // 发送短信
      sendMsg(){
        if(!this.ruleForm.mobile){
          return;
        }

        request({
          url: api_list.api_sendShortMessage,
          method: 'post',
          params: {
            type: 1,
          },
          data:{
            phoneNumber: this.ruleForm.mobile
          }
        })
      },
      // 检测验证码是否正确
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
          this.isCheck = res.success;
        })
      },
      // 验证手机号，决定是否禁用发送按钮
      checkMobile(){
        let reg = new RegExp(/^1[3-9][0-9]{9}$/);
        this.isBan = !reg.test(this.ruleForm.mobile);
      },
      confirm(){
        if(!this.isCheck || !this.ruleForm.mobile){
          return;
        }

        this.showModify = true;
      },
      // 保存修改
      save(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            console.log(this.ruleForm.mobile)
            console.log(this.ruleForm.password)
            request({
              url: api_list.api_modifyUserPassWord,
              method: 'put',
              data:{
                mobile: this.ruleForm.mobile,
                password: this.ruleForm.password
              }
            }).then(res => {
              console.log(res)
              this.openDialog = true;
              if(res.success){
                this.resMsg = '修改成功'
              } else {
                this.resMsg = '修改失败'
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
.findPass{
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
.finPassWrap{
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
.verifiedCode{
  width: 70%;
  height: .3rem;
}
.confirm-btn{
  display: flex;
  justify-content: center;
}

@keyframes formDown {
  from{padding-top: 0;}
  to{padding-top: 1.1rem}
}
</style>