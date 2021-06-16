<template>
  <div class="progressBar">
    <div class="progress-file">
      <i class="el-icon-video-camera-solid" style="margin-right: .1rem;"></i>
      <span>{{file.name}}</span>
      <span class="requst-option">
        <i class="el-icon-video-pause" style="margin-right: .1rem;" v-show="uploading" @click="stopUpload"></i>
        <i class="el-icon-close" @click="delFile"></i>
      </span>
    </div>
    <el-progress class="progress-state" :percentage="file.percentage" :stroke-width="3" :status="status"></el-progress>
  </div>
</template>

<script>
  export default{
    name:'progressBar',
    data(){
      return{
        uploading: true,
      }
    },
    props:{
      file:Object
    },
    computed:{
      
      //上传状态
      status(){
        switch(this.file.status){
          case 'success':
            this.uploading = false;
            return "success";
            break;
          case 'fail':
            this.uploading = false;
            return "exception";
            break;
          case 'stop':
            this.uploading = false;
            return "warning";
        };
      }
    },
    methods:{
      //停止上传
      stopUpload(){
        this.uploading = false;
        this.$emit('stopUpload',this.file);
      },
      //删除
      delFile(){
        this.$emit('delete');
      }
    }
  }
</script>

<style scoped>
  .progressBar{
    width: 100%;
    height: .2rem;
    border-bottom: 1px solid #eee;
  }
  .progress-file{
    position: relative;
    width: 100%;
    height: .1rem;
    display: flex;
    align-items: center;
    font-size: .1rem;
  }
  .requst-option{
    position: absolute;
    right: 0rem;
    cursor: pointer;
  }
  .progress-state{
    display: flex;
    align-items: center;
    width: 100%;
    height: .1rem;
    font-size: .05rem;
  }
</style>