<template>
  <div class="upWork" :style="{backgroundImage:'url(' + backgroundUrl + ')'}">
    <div class="go-back" @click="goBack">
      <i class="iconfont icon-fanhui" :style="{color: textColor}"></i>
    </div>
    <div class="upWorkwrap">
      <div class="up-work-content">
        <el-form :model="workObj" :rules="rules" status-icon ref="workObj" label-width=".6rem" class="demo-workObj">
          <el-form-item label="标题" prop="title">
            <el-input type="text" v-model="workObj.title" maxlength="10"
            show-word-limit clearable autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="作品类型" prop="typeId">
            <el-select v-model="workObj.typeId" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作品介绍" prop="description">
            <el-input type="textarea" v-model="workObj.description"></el-input>
          </el-form-item>

          <el-form-item label="动态内容" prop="feedWord">
            <el-input type="textarea" placeholder="将会同时发送动态" v-model="workObj.feedWord"></el-input>
          </el-form-item>

          <el-form-item label="网盘链接" prop="netdiskUrl">
            <el-input type="text" v-model="workObj.netdiskUrl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="网盘验证码">
            <el-input type="text" v-model="workObj.netdiskCode" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="封面" :rules="rules.cover">
            <van-uploader v-model="coverList" :after-read="uploadCoverImg"
             :max-count="1" :before-read="beforeRead" @delete="workObj.cover = ''"
             :preview-options="{closeable: true}" />
          </el-form-item>
          <el-form-item label="作品图片">
            <van-uploader v-model="imgsList" :after-read="uploadImgs" multiple
              @delete="removeFormImg" :before-read="beforeRead" 
             :preview-options="{closeable: true}">
              <div class="up-img-button">
                <van-icon name="plus" size=".2rem" color="#eee"/>
              </div>
            </van-uploader>
          </el-form-item>
          <el-form-item label="视频">
            <el-upload ref="elUpload"
              class="upload-demo"
              drag
              action=""
              :http-request="upLoadVideo"
              :auto-upload="true"
              :before-upload="beforeUpload"
              :before-remove="removeVideo"
              :show-file-list="false"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击选择视频</em></div>
              <div class="el-upload__tip" slot="tip">只能上传常用的视频格式文件</div>
            </el-upload>
          </el-form-item>
          <div class="upload-list">
            <progressBar v-for="(proFile,index) in videoFileList" :key="index" :file="proFile" @stopUpload="stopUpload" @delete="removeVideoList(proFile)"></progressBar>
          </div>
          <el-form-item>
            <el-button type="primary" :disabled="!isComplete" @click="submitForm">投稿</el-button>
            <el-button type="primary" plain @click="saveUpWork">保存</el-button>
            <!-- <el-button type="primary" plain @click="delSaveUpWork">删除暂存</el-button> -->
            <el-button @click="clearForm('workObj')">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import axios from 'axios'
import progressBar from './common/progressBar'
  export default{
    name:'upWork',
    data(){
      //验证链接url
      var netdiskUrl = (rule, value, callback)=>{
        let reg = new RegExp('^((https|http|ftp|rtsp|mms)?://)'
          + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
          + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
          + '|' // 允许IP和DOMAIN（域名） 
          + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
          + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
          + '[a-z]{2,6})' // first level domain- .com or .museum 
          + '(:[0-9]{1,4})?' // 端口- :80 
          + '((/?)|' // a slash isn't required if there is no file name 
          + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$');
        if(reg.test(value) || value===''){
          callback();
        } else {
          callback(new Error('链接错误'))
        }
      };
      return{
        //取消上传
        source:null,
        //作品信息对象
        workObj:{
          title:'',
          typeId:'',
          cover:'',
          description:'',
          netdiskUrl:'',
          netdiskCode:'',
          feedWord: '',
          //视频列表
          workVideoInfoList:[],
          //图片列表
          workPictureInfoList:[]
        },
        //表单对象的copy
        copyObj: null,
        //校验规则
        rules:{
          title:[
            {required:true,message:'请填写标题',trigger:'blur'}
          ],
          typeId:[
            {required:true,message:'请选择类型',trigger:'blur'}
          ],
          cover:[
            {required:true,message:'请上传封面',trigger:'blur'}
          ],
          netdiskUrl:[
            {required:false,message:'请选择类型',trigger:'blur'},
            {validator: netdiskUrl, trigger:"blur"}
          ],
        },
        //类型选择的值
        typeValue:'',
        //选项数组
        options:[],
        //上传封面图片的预览
        coverList: [],
        //上传多张图片的预览
        imgsList:[],
        //上传视频预览列表
        videoFileList:[],
        // 是否保存投稿
        isSave: false,
        // 是否已经提交
        isSubmit: false
      }
    },
    components:{progressBar},
    created(){
      //请求用户数据
      // this.getUserInfo();
      //获取作品草稿
      this.getSaveUpWork();
      //获取作品类型，供用户选择
      this.getWorkTypes();

    },
    computed:{
      //判断是否有作品相关的文件，没有就禁用提交
      isComplete(){
        if(this.workObj.cover !== '' && (this.workObj.workPictureInfoList.length !== 0 || this.workObj.workVideoInfoList.length !== 0)){
          return true;
        }
      },
      //背景图片的url
      backgroundUrl(){
        if(this.$store.state.userInfo){
          return this.$store.state.userInfo.background;
        }
      },
      textColor(){
        if(this.$store.state.userInfo){
          return this.$store.state.userInfo.textColor;
        }
      }
    },

    methods:{
      // 返回
      goBack(){
        this.$router.go(-1);
      },
      // 保存投稿
      saveUpWork(){
        // 加载画面
        const loading = this.$loading({
          lock: true,
          text: 'save...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        request({
          url: api_list.api_saveUpWork,
          method: 'post',
          data: this.workObj
        }).then(res => {
          // console.log(res);
          loading.close();
          if(res.success){
            this.$toast({
              message: '保存成功'
            })
            this.isSave = true;
            //copy之前先删掉原有的资源
            this.clearServerResource();
            //copy现在的表单对象
            this.copyFormObj();
            //标记所有图片资源为保存
            this.imgsList.map(item => {
              item.isSave = true;
            });
            //标记所有视频资源为保存
            this.videoFileList.map(item => {
              item.isSave = true;
            })
          } else {
            loading.close();
            this.$toast({
              message: '保存失败'
            })
          }         
        }).catch(err => {
          loading.close();
        })
      },
      //删除已保存的作品草稿
      delSaveUpWork(){
        request({
          url: api_list.api_delSaveUpWork,
          method: 'delete'
        }).then(res => {
          console.log(res)
        })
      },
      //删除表单中的视频信息
      removeFormVideo(file){
        for(let i = 0; i<this.workObj.workVideoInfoList.length; i++){
          if(this.workObj.workVideoInfoList[i].videoSourceId === file.videoSourceId){
            this.workObj.workVideoInfoList.splice(i,1);
            break;
          }
        }
      },
      //移除表单中作品图片
      removeFormImg(file){
        for(let i = 0; i<this.workObj.workPictureInfoList.length; i++){
          if(this.workObj.workPictureInfoList[i].pictureUrl === file.url){
            this.workObj.workPictureInfoList.splice(i,1);
            //如果是没有保存的图片直接删掉
            if(!file.isSave){
              this.deletImg(file.url)
            }
            break;
          }
        }
        // console.log(this.workObj.workPictureInfoList)
      },
      //删除预览视频数组中的视频信息
      removeVideoList(file){
        // console.log(file)
        for(let index in this.videoFileList){
          if(this.videoFileList[index].videoSourceId === file.videoSourceId){
            this.videoFileList.splice(index,1);
            this.removeFormVideo(file);
            //如果是没保存的视频直接删掉
            if(!file.isSave){
              this.removeVideo(file)
            }
            return;
          }
        }
      },
      //删除上传的视频
      removeVideo(file){
        // console.log(file)

        //如果已经上传成功
        if(file.status === 'success'){
          request({
            url:api_list.api_removeVideo,
            method:'delete',
            params:{
              videoSourceId:file.videoSourceId,
            }
          }).then( res => {
            if(res.success){
              console.log(res)
            }
          }).catch( err=>{
            if(err){
              this.$toast('删除失败');
              return false;
            }
          });
        } else if(file.status === 'fail' || file.status === 'stop'){
          //如果是上传服务器失败的视频，或者停止了上传，直接从预览数组中删除
          this.removeVideoList(file);
          // console.log(this.videoFileList)
        } else if(file.status === 'uploading'){
          this.stopUpload(file);
          this.removeVideoList(file);
        }
      },
      //批量删除上传的图片
      deletImages(_urls){
        // console.log(_urls)
        //如果图片已经上传成功
        if(!_urls.length){
          return ;
        }

        request({
          url:api_list.api_delMoreUpLoadImages,
          method:'delete',
          data:{
            urlList: _urls
          }
        }).then( res => {
          if(res.success){
            console.log(res)
          }
        })
      },
      //删除上传的图片
      deletImg(_url){
        if(!_url){
          return;
        }
        request({
          url:api_list.api_deleteLoadImage,
          method:'delete',
          data:{
            url:_url
          }
        }).then( res => {
          console.log(res)
         
        }).catch(err => {
    
        });
        
      },
      //上传前判断图片格式
      beforeRead(file){
        // console.log(file)
        let isImg = true;
        //循环的原因是处理多张图片一起上传
        if(file instanceof Array){
          for(let i = 0; i<file.length; i++){
            if(file[i].type.search('image') == -1 ){
              isImg = false;
              break;
            } 
          }
        } else {
          if(file.type.search('image') == -1 ){
            isImg = false;
          } 
        }
        return isImg; 
      },
      //上传视频前的回调,判断视频的格式
      beforeUpload(file){
        if(file.type.match(/video/)){
          return true;
        } else {
          this.$toast('请上传视频文件');
          return false;
        }
      },
      //停止上传视频
      stopUpload(fileObj){
        if(fileObj.source){
          fileObj.source.cancel();
        }
      },
      //上传视频
      upLoadVideo(fileObj){
        fileObj.status = 'uploading';
        fileObj.percentage = 0;
        fileObj.name = fileObj.file.name;
        //加入停止上传的变量，来分开实现每个文件的停止上传功能
        fileObj.source = axios.CancelToken.source();
        //往预览视频数组里面添加要预览视频的进度信息
        this.videoFileList.push(fileObj);
        const formData = new FormData();
        formData.append('file',fileObj.file);
        formData.append('type',fileObj.file.type);
        request({
          url:api_list.api_upLoadVideo,
          method:'post',
          data:formData,
          timeout:600000,
          cancelToken:fileObj.source.token,
          onUploadProgress: progressEvent=>{
            //如果正在上传
            let percent = (progressEvent.loaded / progressEvent.total * 100 || 0).toFixed(0);
            fileObj.percentage = Number(percent);
          }
        }).then( res => {
          if(res.success){
            console.log(res)
            //取消请求设为null
            fileObj.source = null;
            this.percentage = 0;
            let videoObjInfo = {};
            //向表单的视频数组添加url和title
            videoObjInfo.videoSourceId = res.data.videoSourceId;
            // 去掉后缀名，给视频重命名
            videoObjInfo.title = fileObj.file.name.split('.')[0];
            this.workObj.workVideoInfoList.push(videoObjInfo);
            //将videoSourceId也添加到预览视频的数组对象中
            fileObj.videoSourceId = res.data.videoSourceId;
            //视频状态改为已经上传
            fileObj.status = 'success';
            // console.log(this.videoFileList)
            // console.log(this.workObj.workVideoInfoList)
          }
        }).catch(thrown=>{
          if(axios.isCancel(thrown)){
            fileObj.status = 'stop'
          } else {
            //取消请求设为null
            fileObj.source = null;
            fileObj.status = 'fail';
            this.$toast('上传视频失败');
          }
        })
      },
      //上传图片,区分是批量上传还是上传单张
      uploadImgs(fileObj){
        console.log(fileObj)
        let isImg = true;
        if(fileObj instanceof Array){
          for(let i = 0; i<fileObj.length; i++){
            this.startUploadImgs(fileObj[i])
          }
        } else {
          this.startUploadImgs(fileObj);
        }
      },
      //开始上传图片
      startUploadImgs(fileObj){

        fileObj.status = 'uploading';
        fileObj.message = '上传中...';
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('type', fileObj.file.type);
        request({
          url:api_list.api_uploadImage + '/' + '?module=showPicture',
          method:'post',
          data:formData,
          timeout:60000
        }).then(res=>{
          console.log(res)
          if(res.success){
            fileObj.status = 'done';
            fileObj.message = '上传成功';
            this.workObj.workPictureInfoList.push({pictureUrl: res.data.url});
            //向预览图片的数组添加url
            fileObj.url = res.data.url;
          }
        }).catch( err=>{
          if(err){
            fileObj.status = 'failed';
            fileObj.message = '上传失败';
          }
        })
      },
      //上传封面图片
      uploadCoverImg(fileObj){
        fileObj.status = 'uploading';
        fileObj.message = '上传中...';
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('type', fileObj.file.type);
        request({
          url:api_list.api_uploadImage + '/' + '?module=cover',
          method:'post',
          data:formData
        }).then(res=>{
          if(res.success){
            console.log(res)
            // 表单添加封面url
            this.workObj.cover = res.data.url;
            console.log(this.workObj)
            fileObj.status = 'done';
            fileObj.message = '上传成功';
          }
        }).catch( err=>{
          fileObj.status = 'failed';
          fileObj.message = '上传失败';
        })
      },
      //提交
      submitForm(){
        this.$refs.workObj.validate((valid) => {
          if (valid) {
            console.log(this.workObj);

            const loading = this.$loading({
              lock: true,
              text: 'up...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });

            request({
              url:api_list.api_addPersonalWork,
              method:'post',
              data:this.workObj
            }).then(res=>{
              // console.log(res)
              loading.close();
              if(res.success){
                this.isSubmit = true;
                this.$confirm('投稿成功, 是否返回用户中心?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(() => {
                  this.$router.push('/UserSpace')
                });
              }
            }).catch(err=>{
              loading.close();
              if(err){
                this.$dialog({
                  message:'投稿失败'
                })
              }
            });
            // 清除不要的资源
            this.clearServerResource();
          } else {
            return false;
          }
        });
      },
      //监听离开事件，并删除为保持数据
      beforeunloadFn(){
        if(this.isSubmit){
          return;
        }
        // 离开页面前，把未保存的图片资源删掉
        let urlList = [];
        for(let i = 0; i<this.imgsList.length; i++){
          if(!this.imgsList[i].isSave){
            urlList.push(this.imgsList[i].url)
          }
        }
        this.deletImages(urlList);
        // 离开页面前，把未保存的视频资源删掉
        for(let i = 0; i<this.videoFileList.length; i++){
          if(!this.videoFileList[i].isSave){
            this.removeVideo(this.videoFileList[i]);
          }
        }
      },
      //清空表单
      clearForm(formName){
        //清除基本信息，暂时不清除服务器资源
        this.$refs[formName].resetFields();
        this.workObj.cover = '';
        this.coverList = [];
        this.workObj.workPictureInfoList = [];
        this.imgsList = [];
        this.workObj.workVideoInfoList = [];
        this.videoFileList = [];
      },
      //清除服务器上原有的图片和视频资源
      clearServerResource(){
        if(!this.copyObj){
          return;
        }
        // 删除封面, 如果没有换封面就不用删除
        if(this.copyObj.cover !== null && (this.copyObj.cover !== this.workObj.cover)){
          this.deletImg(this.copyObj.cover);
        }
        // 删除作品图片
        let urlList = [];
        // 双重循环查找用户去掉的图片
        for(let i = 0; i<this.copyObj.workPictureInfoList.length; i++){
          let temp = this.copyObj.workPictureInfoList[i];
          let exist = false;
          for(let j = 0; j<this.workObj.workPictureInfoList.length; j++){
            if(temp.pictureUrl === this.workObj.workPictureInfoList[j].pictureUrl){
              exist = true
              break;
            }
          }
          if(!exist){
            urlList.push(this.copyObj.workPictureInfoList[i].pictureUrl);
          }
        }
        // console.log(urlList)
        this.deletImages(urlList);

        // 删除视频
        for(let i = 0; i<this.copyObj.workVideoInfoList.length; i++){
          let temp = this.copyObj.workVideoInfoList[i];
          let exist = false;
          for(let j = 0; j<this.workObj.workVideoInfoList.length; j++){
            if(temp.videoSourceId === this.workObj.workVideoInfoList[j].videoSourceId){
              exist = true
              break;
            }
          }
          if(!exist){
            this.removeVideo({
              videoSourceId:this.copyObj.workVideoInfoList[i].videoSourceId,
              status: 'success'
            });
          }
        }
      },

      //copy表单对象，用于删除原有表单的信息资源，便于重置
      copyFormObj(){
        // copy表单对象，标记图片视频资源是已经保存
        this.copyObj = {
          title: this.workObj.title,
          typeId: this.workObj.typeId,
          cover: this.workObj.cover,
          description: this.workObj.description,
          netdiskUrl: this.workObj.netdiskUrl,
          netdiskCode: this.workObj.netdiskCode,
          feedWord: this.workObj.feedWord,
          workVideoInfoList: this.workObj.workVideoInfoList.map(item => {
            return {videoSourceId: item.videoSourceId, title: item.title, isSave: true};
          }),
          workPictureInfoList: this.workObj.workPictureInfoList.map(item => {
            return {pictureUrl: item.pictureUrl, isSave: true};
          })
        };
      },
      //获取作品的类型
      getWorkTypes(){
        request({
          url: api_list.api_getAllWorksSortName,
          method: 'get'
        }).then(res => {
          if(res.success && res.data.item){
            this.options = res.data.item;
          }
        })
      },
      //获取投稿作品草稿
      getSaveUpWork(){
        request({
          url: api_list.api_getSaveUpWork,
          method: 'get'
        }).then(res => {
          // console.log(res)
          if(res.success && res.data.item){
            this.workObj = res.data.item;
            if(res.data.item.cover){
              this.coverList = [{url: res.data.item.cover}]
            }
            this.imgsList = res.data.item.workPictureInfoList.map(item => {
              return {url: item.pictureUrl, isSave: true}
            });
            this.videoFileList = res.data.item.workVideoInfoList.map(item => {
              return {status: 'success', percentage: 100, name: item.title, videoSourceId: item.videoSourceId, isSave: true}
            })
            this.copyFormObj();
          }
        })
      },
      //获取用户信息
      getUserInfo(){
        request({
          url:api_list.api_getUserInfo,
          method:'get'
        }).then(res => {
          this.$store.commit('updateUserInfo',res.data.item)
        });
      }
    },
    
    beforeRouteLeave(to,from,next){
      if(!this.isSubmit){
        const answer = window.confirm('你确定要离开吗，未保存的数据不会保留')
        if (answer) {
          this.beforeunloadFn();
          next()
        }
      } else {
        next()
      }
    },
  }
</script>

<style scoped>
  .upWork{
    overflow-x: hidden;
    overflow-y: auto;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .go-back{
    position: absolute;
    display: flex;
    top: .1rem;
    left: .2rem;
  }
  .go-back i{
    color: #fff;
    font-size: .2rem;
  }
  .upWorkwrap{
    position: relative;
    width: 6rem;
    min-height: 100vh;
    margin: 0 auto;
    padding-top: .2rem;
    background: #fff;
  }
  .upWorkwrap::after{
    content: '';
    display: block;
    clear: both;
  }
  .up-work-content{
    padding: 0 .2rem;
  }
  .video-item{
    position: relative;
    width: 100%;
    height: .2rem;
    text-align: left;
    line-height: .2rem;
    border-top: 1px solid #eee;
  }
  .video-item i{
    margin-right: .05rem;
  }
  .cross-icon{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: .2rem;
    margin-left: 2rem;
    cursor: pointer;
  }
  .percent-bar{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: .5rem;
    margin-left: 2rem;
  }
  .up-img-button{
    width: .5rem;
    height: .5rem;
    border: 1px dashed rgb(180, 180, 180);
    border-radius: .05rem;
    text-align: center;
    line-height: .65rem;
  }
  .upload-list{
    width: 80%;
    max-height: 1rem;
    border-radius: 5px;
    overflow-y: auto;
    margin: .05rem auto;
    padding: 0 .05rem;
  }
  
</style>