<template>
  <div class="modifyWork clearFix" :style="{backgroundImage:'url(' + backgroundUrl + ')'}">
    <div class="modifyWrap clearFix">
      <div class="modify-content clearFix">
        <h6 class="base-info-title">基本信息</h6>
        <div class="base-info">
          <el-form :model="workObj" status-icon :rules="rules" ref="workObj" label-width="100px" class="demo-workObj">
            <el-form-item label="标题" prop="title">
              <el-input type="text" v-model="workObj.title" maxlength="10" show-word-limit clearable autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="typeId">
              <el-select v-model="workObj.typeId" clearable placeholder="请选择">
                <el-option
                  v-for="item in workTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input type="textarea" v-model="workObj.description"></el-input>
            </el-form-item>
            <el-form-item label="封面" :rules="rules.cover">
              <van-uploader v-model="coverList" :after-read="uploadCover" 
              :max-count="1" :before-read="beforeRead" @delete="deletCover"
             :preview-options="{closeable: true}"/>
            </el-form-item>
            <el-form-item label="网盘链接" prop="netdiskUrl">
              <el-input type="text" v-model="workObj.netdiskUrl" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="网盘验证码" prop="netdiskCode">
              <el-input type="text" v-model="workObj.netdiskCode" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">保存</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 图片 -->
        <div class="imgs-info">
          <h6 class="imgs-info-title">图片</h6>
          <div class="imgs-list">
            <van-checkbox-group v-model="selectImgs" ref="checkImgGroup" > 
              <div class="img-item" @mouseenter="showOption=index" @mouseleave="showOption=(selectImgs.length!==0)"
              v-for="(item,index) in workObj.workPictureInfoList" :key="index">
              <van-image-preview v-model="showPreview" :images="showPreviewArr" closeable :showIndex="false">
              </van-image-preview>
                <div class="check-mark" v-show="showOption === index">
                  <van-icon name="search" size=".13rem" color="#fff" style="cursor:pointer" @click="showPreviewFn(item.pictureUrl)"/>
                  <van-icon name="delete-o" size=".13rem" color="#fff" style="cursor:pointer" @click="deletImg(index)"/>
                </div>
                <div class="item-content" :style="{backgroundImage:'url(' + item.pictureUrl + ')'}">
                </div>
                <van-checkbox :name="index" v-show="true"></van-checkbox>
              </div>
            </van-checkbox-group>
            <van-loading color="#1989fa" v-if="isLoading"/>
          </div>
          <div class="select-option">
            <van-button type="primary" @click="checkAllImgs">全选</van-button>
            <van-button type="info" @click="toggleAllImgs">反选</van-button>
            <van-uploader :after-read="uploadImgs" :before-read="beforeRead">
              <van-button icon="plus" type="primary">添加图片</van-button>
            </van-uploader>
            <van-button plain type="info" color="red" @click="delMoreImgs">批量删除</van-button>
          </div>
        </div>
        <!-- 图片 -->
        <!-- 视频 -->
        <div class="videos-info">
          <h6 class="videos-info-title">视频</h6>
          <div class="video-list">
            <van-checkbox-group v-model="selectVideo" ref="checkVideoGroup">
              <van-cell-group>
                <van-cell
                  v-for="(item, index) in workObj.workVideoInfoList"
                  clickable
                  :key="index"
                  :title="item.title"
                  @click="toggle(index)"
                >
                  <template #icon="">
                    <i class="el-icon-video-camera-solid video-icon"></i>
                  </template>
                  <template #right-icon>
                    <van-checkbox :name="item" ref="checkboxes" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
            <progressBar :file="fileObj" v-for="fileObj in videoFileList" :key="fileObj.file.uid"
            @stopUpload="stopUpload" @delete="removeVideosPreview"></progressBar>
          </div>
          <div class="select-option">
            <van-button type="primary" @click="checkAllVideos">全选</van-button>
            <van-button type="info" @click="toggleAllVideos">反选</van-button>
            <van-button plain type="info" color="red" @click="delMoreVideos">删除</van-button>
            <el-upload
              class="upload-demo"
              action=""
              :http-request="uploadVideos"
              :before-upload="beforeUpVideo"
              :show-file-list="false"
              multiple>
              <el-button size="small" type="primary">上传视频</el-button>
            </el-upload>
          </div>
        </div>
        <!-- 视频 -->
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import progressBar from './common/progressBar'
import axios from 'axios'
import '../assets/resetCss/reModifyWork.css'
import '../assets/resetCss/commonCss.css'

  export default{
    name:'modifyWork',
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
        showPreview:false,
        showPreviewArr:[],
        workObj:{},
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
            {validator:netdiskUrl, trigger:"blur"}
          ]
        },
        //作品类型
        workTypeList: [],
        options:[{
          value:"1",
          label:'动画'
        },
        {
          value:"2",
          label:'游戏'
        },
        {
          value:"3",
          label:'影视后期'
        },
        {
          value:"4",
          label:'绘画'
        }],
        //封面预览列表
        coverList:[],
        //上传视频预览列表
        videoFileList:[],
        //选择的图片
        selectImgs:[],
        //选择的视频
        selectVideo:[],
        //展示删除图片按钮
        showOption:false,
        //上传中的标记
        isLoading:false
      }
    },
    components:{progressBar},
    created(){
      //获取数据
      if(this.$route.query){
        this.getWorkInfo();
      }
      //请求用户信息
      this.getUserInfo();
      this.getWorkType();
    },
    computed:{
      backgroundUrl(){
        if(this.$store.state.userInfo){
          return this.$store.state.userInfo.background;
        }
      }
    },
    methods:{
      //预览图片
      showPreviewFn(_url){
        let previewArr = []
        this.showPreview = true;
        previewArr.push(_url);
        this.showPreviewArr = previewArr;
      },
      //视频点击选择功能
      toggle(index) {
        this.$refs.checkboxes[index].toggle();
      },
      //全选视频
      checkAllVideos(){
        this.$refs.checkVideoGroup.toggleAll(true);
      },
      //反选视频
      toggleAllVideos() {
        this.$refs.checkVideoGroup.toggleAll();
      },
      //全选图片
      checkAllImgs(){
        this.showOption = true;
        this.$refs.checkImgGroup.toggleAll(true);
      },
      //批量删除视频
      delMoreVideos(){
        if(this.selectVideo.length !== 0){
          this.$confirm('此操作将删除视频, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            let videosObj = [];
            this.selectVideo.map(n => {
              videosObj.push({
                id:n.id,
                videoSourceId:n.videoSourceId
              });
            });
            console.log(videosObj)
            request({
              url:api_list.api_delWorkVideo,
              method:'delete',
              data:videosObj,
              params:{
                workId:this.workObj.id
              }
            }).then( res => {
              console.log(res)
              if(res.success){
                this.$toast('删除成功');
                this.getVideosList();
              }
            }).catch(err => {
              this.$toast('删除失败');
            })
          })
        }
      },
      //上传视频时验证
      beforeUpVideo(fileObj){
        if(fileObj.type.match(/video/)){
          return true;
        } else {
          this.$toast('请上传视频文件')
          return false;
        }
      },
      //停止上传
      stopUpload(fileObj){
        if(fileObj.source){
          fileObj.source.cancel();
        }
      },
      //上传视频得到url
      uploadVideos(fileObj){
        let titleName = fileObj.file.name.split('.')[0];
        fileObj.status = 'uploading';
        fileObj.percentage = 0;
        fileObj.name = fileObj.file.name;
        fileObj.source = axios.CancelToken.source();
        //往预览视频数组里面添加要预览视频的进度信息
        this.videoFileList.push(fileObj);
        console.log(fileObj);
        const formData = new FormData();
        formData.append('file',fileObj.file);
        formData.append('type',fileObj.file.type);
        request({
          url:api_list.api_upLoadVideo,
          method:'post',
          data:formData,
          timeout:60000,
          cancelToken:fileObj.source.token,
          onUploadProgress: progressEvent=>{
            //如果正在上传
            let percent = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
            fileObj.percentage = Number(percent);
          }
        }).then( res => {
          // console.log(res)
          if(res.success){
            //取消请求设为null
            fileObj.source = null;
            fileObj.status = 'success';
            let videoObj = {
              workId:this.workObj.id,
              videoSourceId:res.data.videoSourceId,
              title:titleName
            }
            //添加新的视频url
            this.addVideosUrl(videoObj);
            //从预览数组中清除
            this.removeVideosPreview(fileObj);
          }
        }).catch( thrown => {
          //如果是停止上传
          if(axios.isCancel(thrown)){
            fileObj.status = 'stop';
          } else {
            //如果是上传失败
            //取消请求设为null
            fileObj.source = null;
            fileObj.status = 'fail';
            this.$toast('上传失败');
            //从预览数组中清除
            this.removeVideosPreview(fileObj);
          }
        })
      },
      //添加新的视频url
      addVideosUrl(videoObj){
        request({
          url:api_list.api_addWorkVideos,
          method:'post',
          data:videoObj
        }).then( res => {
          // console.log(res)
          if(res.success){
            this.$toast('上传成功')
            //更新页面的视频信息
            this.getVideosList();
          }
        }).catch(err => {
          if(err){
            this.$toast('上传失败')
          }
        })
      },
      //反选图片
      toggleAllImgs() {
        this.showOption = true;
        this.$refs.checkImgGroup.toggleAll();
      },
      //批量删除图片
      delMoreImgs(){
        if(this.selectImgs.length !== 0){
          this.$confirm('此操作将删除图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            let delImgsArr = [];
            this.selectImgs.map(n=>{
              delImgsArr.push({
                id:this.workObj.workPictureInfoList[n].id,
                pictureUrl:this.workObj.workPictureInfoList[n].pictureUrl
              })
            });
            request({
              url:api_list.api_delModeWorkImg,
              method:'delete',
              data:delImgsArr,
              params:{
                workId:this.workObj.id
              }
            }).then( res => {
              console.log(res);
              if(res.success){
                this.$toast('删除成功')
                //从workObj中移除对应的图片
                this.getWorkImgsList();
                  
                //选着标记清空
                this.selectImgs = [];
                this.showOption = false;
              }
            }).catch( err => {
              this.$toast('删除失败')
            })
          })
        }
      },
      //删除单张图片
      deletImg(index){
        this.delWorkImg(this.workObj.workPictureInfoList[index].id, index);
      },
      //删除封面图
      deletCover(fileObj){
        this.workObj.cover = '';
        this.coverList = [];
      },
      //上传作品图片，获得图片的url
      uploadImgs(fileObj){
        this.isLoading = true;
        console.log(fileObj)
        const formData = new FormData();
        formData.append('file', fileObj.file);
        formData.append('type', fileObj.file.type);
        request({
          url:api_list.api_uploadImage + '/' + '?module=showPicture',
          method:'post',
          data:formData
        }).then(res=>{
          if(res.success){
            console.log(res)
            this.addImgUrl(res.data.url);
          }
        }).catch( err=>{
          this.isLoading = false;
          this.$toast('上传失败');
        })
      },
      //添加新上传图片的url
      addImgUrl(imgUrl){
        request({
          url:api_list.api_addWorkImgs,
          method:'post',
          data:{
            workId:this.workObj.id,
            pictureUrl:imgUrl
          }
        }).then( res => {
          if(res){
            this.isLoading = false;
            this.$toast('上传成功'); 
            this.getWorkImgsList();
          }
        }).catch( err => {
          if(err){
            this.isLoading = false;
            this.$toast('上传失败')
          }
        })
      },
      //上传封面图
      uploadCover(fileObj){
        console.log(fileObj);
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
      //上传图片时校验
      beforeRead(fileObj){
        let isImg = true;
        //循环的原因是处理多张图片一起上传
        for(let i = 0; i<fileObj.length; i++){
          if(fileObj[i].type.search('image') == -1 ){
            isImg = false;
            this.$toast('请上传图片格式')
            break;
          } 
        }
        return isImg; 
      },
      //保存基本信息
      submitForm(){
        this.$refs.workObj.validate((valid) => {
          if (valid) {
            if(this.workObj.cover === ''){
              this.$dialog({
                message:'请上传封面'
              })
            } else {
              request({
                url:api_list.api_updateWork,
                method:'put',
                data:this.workObj
              }).then( res=>{
                console.log(res);
                if(res.success){
                  this.coverList = [];
                  this.getWorkInfo();
                  this.$toast('修改成功')
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      //重置基本信息
      resetForm(){
        this.getWorkInfo();
      },
      //获取作品图片信息列表
      getWorkImgsList(){
        request({
          url:api_list.api_getWorkImgsList,
          method:'get',
          params:{
            workId:this.workObj.id
          }
        }).then( res => {
          this.workObj.workPictureInfoList = res.data.items;
        })
      },
      //获取作品视频信息列表
      getVideosList(){
        request({
          url:api_list.api_getWorkVideosList,
          method:'get',
          params:{
            workId:this.workObj.id
          }
        }).then(res => {
          this.workObj.workVideoInfoList = res.data.items;
        })
      },
      //获取作品详细数据
      getWorkInfo(){
        request({
          url:api_list.api_getWorkInfo,
          method:'get',
          params:{
            workId:this.$route.query.id
          }
        }).then( res => {
          console.log(res);
          this.workObj = res.data.item;
          //获取封面图并展示
          this.coverList = [];
          this.coverList.push({url:this.workObj.cover});
        })
      },
      //删除上传视频预览列表中的信息
      removeVideosPreview(fileObj){
        // console.log(fileObj.status)
        if(!(fileObj.status === 'uploading')){
          for(let i = 0; i<this.videoFileList.length; i++){
            if(this.videoFileList[i].file.uid === fileObj.file.uid){
              this.videoFileList.splice(i,1);
              break;
            }
          }
        } else {
          //如果视频是正在上传状态，就先停止
          this.stopUpload(fileObj);
        }
      },
      // 删除作品图片
      delWorkImg(id,index){
        this.$confirm('此操作将删除图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          request({
            url:api_list.api_delWorkImg,
            method:'delete',
            params:{
              pictureId:id,
            }
          }).then( res => {
            console.log(res);
            if(res.success){
              this.workObj.workPictureInfoList.splice(index,1);
              this.$toast('删除成功');
            }
          }).catch( err => {
            if(err){
              this.$toast('删除失败');
            }
          })
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
      },
      // 获取作品类型
      getWorkType(){
        request({
          url: api_list.api_getAllWorksSortName,
          method: 'get'
        }).then(res => {
          // console.log(res);
          if(res.success){
            if(res.data.item){
              this.workTypeList = res.data.item
            }
          }
        })
      }
    },
    beforeRouteLeave(to, from, next){
      const answer = window.confirm('你确定要离开吗，未保存的数据不会保留')
      if (answer) {
        this.resetForm();
        next()
      } else {
        next(false)
      }
    }
  }
</script>

<style scoped>
  .modifyWork{
    overflow-x: hidden;
    overflow-y: auto;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .modifyWrap{
    width: 7rem;
    margin: 0 auto;
    background: #fff;
    padding: 0 .5rem;
  }
  .base-info{
    border: 1px solid rgb(199, 199, 199);
    padding: .1rem 0.2rem;
    border-radius: .02rem;
    margin-bottom: .2rem;
  }
  .imgs-info-title, .base-info-title, .videos-info-title{
    margin: 0;
    font-size: .1rem;
    padding: .1rem 0;
  }
  .imgs-list{
    display: flex;
    height: 2rem;
    border: 1px solid rgb(199, 199, 199);
    padding: .02rem;
    border-radius: .02rem;
    overflow-y: auto;
    flex-wrap: wrap;
  }
  .img-item:nth-of-type(4n){
    margin-right: 0;
  }
  .img-item{
    float: left;
    width: 1.7rem;
    height: 1rem;
    position: relative;
    margin: 0 .01rem .01rem 0;
  }
  .check-mark{
    position: absolute;
    width: 100%;
    height: .2rem;
    background: rgb(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .1rem;
    box-sizing: border-box;
  }
  .item-content{
    display: block;
    float: left;
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .van-checkbox{
    display: block;
    position: absolute;
    bottom: 0;
  }
  .select-option{
    position: relative;
    margin-top: .05rem;
    display: flex;
    height: .2rem;
    text-align: center;
    line-height: .2rem;
  }
  .select-option button{
    display: inline-block;
    height: .15rem;
    font-size: .05rem;
    margin-right: .1rem;
  }
  .videos-info{
    margin-bottom: .5rem;
  }
  .video-list{
    height: 1rem;
    border: 1px solid rgb(199, 199, 199);
    padding: .02rem;
    border-radius: .02rem;
    overflow-y: auto;
  }
  .video-icon{
    text-align: center;
    line-height: 24px;
    margin-right: .1rem;
    font-size: .1rem;
  }
</style>