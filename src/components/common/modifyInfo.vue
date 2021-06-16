<template>
  <div class="modifyInfo">
    <div class="mark">
      <div class="modifyWrap">
        <div class="modify-title">
          修改信息
          <van-icon class="close-icon" name="cross" size=".1rem" @click="closeWrap"/>
        </div>

        <div class="modify-content">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" 
          status-icon label-width=".53rem"  class="demo-ruleForm" label-position="right" hide-required-asterisk>
            
            <el-form-item label="用户名:" prop="name">
              <el-input v-model="ruleForm.name" clearable></el-input>
            </el-form-item>

            <el-form-item label="个性签名:" prop="sign">
              <el-input v-model="ruleForm.sign" clearable></el-input>
            </el-form-item>

            <el-form-item label="手机号:" prop="mobile">
              <el-input v-model.number="ruleForm.mobile" clearable></el-input>
            </el-form-item>
            
            <el-form-item
              prop="email"
              label="邮箱:"
            >
              <el-input v-model="ruleForm.email" clearable></el-input>
            </el-form-item>

            <el-form-item label="性别">
              <el-radio label="男" v-model="ruleForm.sex"></el-radio>
              <el-radio label="女" v-model="ruleForm.sex"></el-radio>
            </el-form-item>

            <el-form-item label="头像">
              
              <van-uploader :after-read="uploadAvatarFn"  v-model="fileListAvatar"
               multiple :max-count="1" close-preview="closePreview" :before-read="beforeRead"
               :preview-options="{closeable: true}" @delete=""/>
              
            </el-form-item>

            <el-form-item label="背景图">
              <van-uploader :after-read="uploadBackgroundFn" v-model="fileListBackground"
              :preview-options="{closeable: true}" close-preview="closePreview" :max-count="1" :before-read="beforeRead" @delete=""/>
            </el-form-item>

            <el-form-item class="buttonBar">
              <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
              <router-link class="modify-password" to="/FindPass">修改密码</router-link>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/resetCss/reModify.css'
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import dialogSimple from './dialogSimple'
  export default{
    name:'modifyInfo',
    data(){
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
        fileListAvatar:[],
        fileListBackground:[],
        ruleForm:{
          id:'',
          name: '',
          avatar:'',
          sign:'',
          mobile:'',
          email:'',
          sex:0,
          background:''
        },
        rules:{
          //用户名
          name:[
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          //邮箱
          email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '邮箱地址错误', trigger: 'blur'}
          ],
          //检测手机号
          mobile:[
            {validator:mobile, trigger:'blur'}
          ]
        }
      }
    },
    created(){
      //赋值，不能直接等于对象，不然会直接指向原本的对象
      if(this.userInfo){
        this.copyInfo();
      }
    },
    props:{
      userInfo:Object
    },
    components:{dialogSimple},
    methods:{
      closePreview(){
        // console.log("xxx")
      },
      //上传背景图片代码
      uploadBackgroundFn(fileObj){
        console.log(fileObj)
        fileObj.status = 'uploading';
        fileObj.message = '上传中...';

        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('type', fileObj.file.type);
        request({
          url:api_list.api_uploadImage + '/' + '?module=background',
          method:'post',
          data:formData,
          timeout:60000
        }).then(res=>{
          if(res.success){
            // console.log(res)
            this.ruleForm.background = res.data.url;
            fileObj.status = 'success';
            fileObj.message = '上传成功';
          }
        }).catch( err=>{
          fileObj.status = 'failed';
          fileObj.message = '上传失败';
        })
      },
      //上传头像图片
      uploadAvatarFn(fileObj){
        // console.log(fileObj)
        fileObj.status = 'uploading';
        fileObj.message = '上传中...';

        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('type', fileObj.file.type);
        request({
          url:api_list.api_uploadImage + '/' + '?module=Avatar',
          method:'post',
          data:formData
        }).then(res=>{
          if(res.success){
            // console.log(res)
            fileObj.status = 'success';
            fileObj.message = '上传成功';
            this.ruleForm.avatar = res.data.url;
          }
        }).catch( err=>{
          fileObj.status = 'failed';
          fileObj.message = '上传失败';
        })
      },
      //上传图片时校验格式
      beforeRead(file){
        if (file.type == 'image/jpeg' || file.type == 'image/png') {
          return true;
        } else {
          this.$toast('请上传 jpg 或者 png格式图片');
          return false;
        }
        
      },
      //删除上传的背景图片
      handleBgRemove(_url){
        if(this.userInfo.background === this.ruleForm.background){
          return;
        }
        request({
          url:api_list.api_deleteLoadImage,
          method:'delete',
          data:{
            url: _url
          }
        }).then( res => {
          if(res.success){
            // console.log(res)
            // this.ruleForm.background = this.userInfo.background;
          }
        })
      },
      //删除上传的头像图片
      handleAvatarRemove(_url){
        if(this.userInfo.avatar === this.ruleForm.avatar){
          return;
        }
        request({
          url:api_list.api_deleteLoadImage,
          method:'delete',
          data:{
            url: _url
          }
        }).then( res => {
          if(res.success){
            // console.log(res)
            // this.ruleForm.avatar = this.userInfo.avatar;
            // console.log(this.ruleForm);
          }
        })
      },
      //用户信息复制
      copyInfo(){
        this.ruleForm.name = this.userInfo.name;
        this.ruleForm.id = this.userInfo.id;
        this.ruleForm.avatar = this.userInfo.avatar;
        this.ruleForm.sign = this.userInfo.sign;
        this.ruleForm.mobile = this.userInfo.mobile;
        this.ruleForm.email = this.userInfo.email;
        this.ruleForm.background = this.userInfo.background;
        if(this.userInfo.sex === 0){
          this.ruleForm.sex = "男"
        } else {
          this.ruleForm.sex = "女"
        }
        // console.log(this.ruleForm)
        this.fileListAvatar = [{url: this.userInfo.avatar}];
        this.fileListBackground = [{url: this.userInfo.background}]
      },
      //重置
      resetForm(formName){
        // 先从服务器清除已经上传的图片
        if(this.userInfo.avatar !== this.ruleForm.avatar){
          this.handleAvatarRemove(this.ruleForm.avatar);
        }
        if(this.userInfo.background !== this.ruleForm.background){
          this.handleBgRemove(this.ruleForm.background);
        }
        this.copyInfo();
      },
      //提交
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            if(this.ruleForm.sex === '男'){
              this.ruleForm.sex = 0;
            } else {
              this.ruleForm.sex = 1;
            }

            const loading = this.$loading({
              lock: true,
              text: 'update...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            // console.log(this.ruleForm);
            request({
              url:api_list.api_updateInfo,
              method:'put',
              data:this.ruleForm
            }).then( res => {
              // console.log(res)
              loading.close();
              if(res.success){
                this.$cookies.set('user_token', res.data.token);
                // 提交后，清除服务器上原来的图片
                this.handleAvatarRemove(this.userInfo.avatar);
                this.handleBgRemove(this.userInfo.background);
                this.$confirm('修改成功', '提示', {
                  confirmButtonText: '确定',
                }).then(()=>{
                  this.$router.go(0);
                }).catch(() => {
                  this.$router.go(0);
                });
              } else {
                this.$dialog({
                  message: "修改失败"
                })
              }
            }).catch( err => {
              loading.close();
              this.$dialog({
                  message: "修改失败"
                })
            })
          }
        })
      },
      //关闭
      closeWrap(){
        // 先从服务器清除已经上传的图片
        this.handleAvatarRemove(this.ruleForm.avatar);
        this.handleBgRemove(this.ruleForm.background);
        this.$emit("close");
      }
    }
  }
</script>

<style scoped>
  .modifyInfo{
    position: fixed;
    z-index: 20;
    width: 100%;
  }
  .mark{
    width: 100%;
    background: rgb(0,0,0,.5);
    display: flex;
    align-items: center;
    height: 100vh;
    overflow-y: hidden;
  }
  .modifyWrap{
    width: 3rem;
    background: #fff;
    margin: 0 auto;
    border-radius: .1rem;
  }
  .modify-title{
    height: .3rem;
    font-size: .1rem;
    text-align: center;
    line-height: .3rem;
    font-weight: 600;
  }
  .modify-content{
    display: flex;
    justify-content: center;
  }
  .close-icon{
    float: right;
    margin: .05rem .05rem 0 0;
    cursor: pointer;
  }
  .del-icon{
    position: absolute;
    top:0;
    right: 0;
    width: .1rem;
    height: .1rem;
    background: rgb(0,0,0,.5);
    font-size: .05rem;
    line-height: .1rem;
    text-align: center;
    border-radius: 0 0 0 .05rem;
    color: #fff;
  }
  .del-icon:hover{
    color: rgb(45, 152, 240);
  }
  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }
  .uploadMark{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgb(0,0,0,.3);
    font-size: .05rem;
    line-height: .3rem;
  }
  .modify-password{
    margin-left: .5rem;
    font-size: .08rem;
    text-decoration: underline;
  }
</style>