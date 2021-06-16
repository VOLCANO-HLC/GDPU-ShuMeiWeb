<template>
  <div class="feed-form">
    <div class="close-btn">
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div class="feed-comment common">
      <el-input class="comment-bar"
        type="textarea"
        placeholder="请输入内容"
        v-model="textarea"
        maxlength="300"
        show-word-limit
        rows="10"
        resize="none"
        @blur="isSave = (oldComment === textarea)"
      >
      </el-input>
    </div>
    <div class="feed-imgs common">
      <van-uploader :after-read="afterRead" v-model="previewImg" :max-count="9" @delete="removeImg"/>
    </div>
    <div class="common" style="font-size: .1rem; color: rgb(129, 129, 129);">{{previewImg.length}}/9</div>
    <div class="feed-btn">
      <el-button type="primary" @click="sendFeed" :disabled="banSend">发布</el-button>
      <el-button @click="saveFeedData">暂存</el-button>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
export default{
  name: 'feedForm',
  data(){
    return {
      // 文字内容
      textarea:'',
      // 图片预览列表，包括了url
      previewImg: [],
      // 改变前的内容
      oldComment:'',
      // 是否保存草稿
      isSave: false,
      // 是否已有保存的草稿
      saveExist: false,
      // 禁用发布按钮
      banSend: false
    }
  },
  created(){
    this.getSaveFeedData();
  },
  methods:{
    // 关闭面板
    close(){
      // console.log(this.isSave)
      if(this.textarea === '' && this.previewImg.length === 0){  
        if(this.saveExist){
          this.$confirm('是否退出编辑?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delSaveFeed();
            this.$emit('close');
          })
        } else {
          this.$emit('close');
        }
        return;
      }
      // 如果没有保存，询问用户是否保存
      if(!this.isSave){
        this.$confirm('未保存动态，是否保存该动态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveFeedData();
          this.$emit('close');
        }).catch(() =>{
          this.$emit('close');
          this.removeMoreImgs();
          this.delSaveFeed();
        })
      } else {
        this.$emit('close');
      } 
    },
    // 发布动态
    sendFeed(){
      // 如果内容为空，就不发送
      if(this.textarea === '' && this.previewImg.length === 0){
        this.$toast({
          message: '请填写内容'
        })
        return false;
      }

      const loading = this.$loading({
        lock: true,
        text: 'send...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // 获取每个图片文件的url
      let imgsUrl = this.previewImg.map(item => {
        return {pictureUrl: item.url}
      });
      // console.log(this.textarea)
      // console.log(imgsUrl)
      request({
        url: api_list.api_sendFeed,
        method: 'post',
        data: {
          comment: this.textarea,
          pictureInfoList: imgsUrl
        }
      }).then(res => {
        console.log(res)
        loading.close();
        if(res.success){
          this.$toast({
            message: '发布成功'
          })
          // 从本地存储中移除
          // localStorage.removeItem('feedFormData');
          this.textarea = '';
          this.previewImg = [];
          this.isSave = false;
          this.close();
        }
      }).catch(err => {
        loading.close();
        this.$toast({
          message: '发布失败'
        })
      })
    },
    // 本地存储未发布的动态
    saveFeedData(){
      this.isSave = true;
      let urlList = this.previewImg.map(item => {
        return {pictureUrl: item.url}
      });
      if(urlList.length === 0 && this.textarea === ''){
        // 如果已经有保存，而且当前的内容为空，就不用再保存了，直接清空缓存
        // console.log(this.saveExist)
        if(this.saveExist){
          this.delSaveFeed();
        }
        this.$toast({
          message: '请填写内容'
        })
        return;
      }

      request({
        url: api_list.api_saveFeedData,
        method: 'post',
        data:{
          comment: this.textarea,
          pictureInfoList: urlList
        }
      }).then(res => {
        if(res.success){
          this.$toast({
            message: '保存成功'
          });
          this.oldComment = this.textarea;
          this.saveExist = true;
        }
      });

    },
    // 批量删除图片
    removeMoreImgs(){
      let urlList = this.previewImg.map(item => {
        return item.url;
      });
      if(urlList.length === 0){
        return;
      }
      console.log(urlList)
      request({
        url: api_list.api_delMoreUpLoadImages,
        method: 'delete',
        data:{
          urlList: urlList
        }
      }).then(res => {
        console.log(res)
      })
    },
    // 删除图片
    removeImg(fileObj){
      if(!fileObj.url){
        return;
      }
      request({
        url: api_list.api_deleteLoadImage,
        method: 'delete',
        data:{
          url: fileObj.url
        }
      }).then(res => {
        console.log(res);
        this.isSave = false;
        // console.log(this.previewImg)
      })
    },
    // 上传图片
    afterRead(fileObj){
      // console.log(fileObj)
      // 先验证图片格式
      if(this.checkImg(fileObj)){
        this.upLoadImg(fileObj)
      } else {
        this.$toast({
          message: '请选择图片文件'
        });
        this.previewImg.pop();
        return false
      }
      // console.log(this.previewImg)
    },
    // 校验图片格式
    checkImg(fileObj){
      let format = fileObj.file.type.split('/')[0];
      if(!format.includes('image')){
        return false;
      } else {
        return true;
      }
    },
    // 开始上传
    upLoadImg(fileObj){
      fileObj.status = 'uploading';
      fileObj.message = '上传中...';
      const formData = new FormData();
      formData.append('file', fileObj.file);
      formData.append('type', fileObj.file.type);
      request({
        url: api_list.api_uploadImage + '/' + '?module=feed',
        method: 'post',
        data:formData
      }).then(res => {
        // console.log(res)
        fileObj.status = 'success';
        fileObj.message = '上传成功';
        fileObj.url = res.data.url;
        this.isSave = false;
        // 是否已经选保存草稿，是就更新保存信息
        // this.isSave? this.saveFeedData(): '';
      }).catch(err => {
        fileObj.status = 'failed';
        fileObj.message = '上传失败';
      })
    },
    // 删除后台的动态草稿缓存
    delSaveFeed(){
      request({
        url: api_list.api_delSaveFeed,
        method: 'delete',
      }).then(res => {
        // console.log(res)
        if(res.success){
          // console.log("缓存删除成功")
          this.saveExist = false;
        }
      })
    },
    // 判断是否有草稿,有就初始化动态内容
    getSaveFeedData(){
      request({
        url: api_list.api_getSaveFeedData,
        method: 'get'
      }).then(res => {
        // console.log("save:",res)
        if(res.success && res.data.item){
          this.textarea = res.data.item.comment;
          this.oldComment = this.textarea;
          this.saveExist = true;
          this.previewImg = res.data.item.pictureInfoList.map(item => {
            return {url: item.pictureUrl, status: 'success', message: '上传成功'}
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.common{
  margin: 0 auto;
  width: 90%;
  padding-top: .2rem;
}
.close-btn{
  font-size: .1rem;
  position: absolute;
  right: .05rem;
  top: .05rem;
  color: rgb(126, 126, 126);
  cursor: pointer;
}
.feed-form{
  position: relative;
  width: 5rem;
  height: 3rem;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
}
.feed-imgs{
  display: flex;
}
.feed-btn{
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  position: absolute;
  bottom: .2rem;
  padding: 0 .5rem;
}
</style>