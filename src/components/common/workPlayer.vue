<template>
  <div class="workPlayer">
    <div class="main-content">
      <div  class="prism-player" id="J_prismPlayer"></div>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import workImgSwipe from './workImgSwipe'
  export default {
    name:'workPlayer',
    data(){
      return{
        //云视频列表
        videolist:[],
        //云视频id
        videoSourceId:'',
        //云视频凭证
        playauth:'',
        //视频暂停封面
        videoCover:'',
        player:null
      }
    },
    components:{workImgSwipe},
    mounted(){
      //初始化播放器

    },
    props:{
      //传递选择的视频index
      videoIndex:Number,
    },
    created(){
      //视频列表
      this.videolist = this.$store.state.workDetail.workVideoInfoList;
      if(this.videolist){
        //获取凭证和初始化播放器
        this.getPlayAuth();
        //初始化视频封面
        this.videoCover = this.$store.state.workDetail.cover
      }
    },
    methods:{
      //初始化播放器
      initPlayer(){
        if(this.player !== null){
          this.player.dispose();
        }
        this.player = new Aliplayer({
          id:"J_prismPlayer",
          vid : this.videoSourceId,
          playauth : this.playauth,
          cover: this.videoCover,
          encryptType:1,
          autoplay: false,
          preload: false,
          isLive: false,
          width: "100%",
          height: "100%",
        }); 
        
      },
      //获取播放凭证
      getPlayAuth(){
        request({
          url:api_list.api_getPlayAuth,
          method:'get',
          params:{
            videoSourceId:this.videolist[this.videoIndex].videoSourceId
          }
        }).then( res => {
          console.log(res)
          if(res.success){
            this.videoSourceId = this.videolist[this.videoIndex].videoSourceId;
            this.playauth = res.data.playAuth;
            this.initPlayer();
          }
        })
      }
    },
    watch:{
      //监听视频的变化，重新获取凭证
      videoIndex(){
        this.getPlayAuth();
      }
    }
  }
</script>

<style scoped>
  .workPlayer{
    width: 100%;
    height: 100%;
  }
  .main-content{
    width: 100%;
    height: 100%;
    /* background-color: lightcoral; */
  }

</style>