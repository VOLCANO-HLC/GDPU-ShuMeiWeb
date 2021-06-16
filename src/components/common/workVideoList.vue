<template>
  <div class="workVideoList">
    <div class="title">视频列表</div>
    <div class="list-content">
      <ul class="video-list" ref="videoList">
        <li class="video-item" v-for="(item,index) in workVideos" :key="index" @click="videoClick(index)">
          <van-icon name="play-circle" size=".1rem" v-if="selectIndex!==index"/>
          <van-icon name="pause-circle" size=".1rem" v-if="selectIndex===index"/>
          <span>{{item.title}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default{
    name:'workVideoList',
    data(){
      return{
        //选择的视频index
        selectIndex:0,
      }
    },
    props:{
      workVideos:Array
    },
    created(){
    },
    mounted(){
      setTimeout(()=>{
        this.$refs.videoList.children[0].style.color = '#268bdd';
      },1500)
    },
    methods:{
      videoClick(index){
        this.selectIndex = index;
        this.$emit('videoClick',this.selectIndex);
      }
    },
    watch:{
      //颜色变化
      selectIndex(nowIndex, oldIndex){
        let children = this.$refs.videoList.children;
        children[oldIndex].style.color = '#fff';
        children[nowIndex].style.color = '#268bdd';
      }
    }
  }
</script>

<style scoped>
  .workVideoList{
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: 1px solid rgb(136, 136, 136);
    overflow-x: hidden;
    overflow-y: auto;
    /* background-color: rgba(255, 255, 255, 0.041); */
    border-radius: 5px;
  }
  .title{
    width: 100%;
    height: .2rem;
    background-color: #fff;
    font-size: .1rem;
    text-align: center;
    line-height: .2rem;
  }
  .video-list .video-item{
    box-sizing: border-box;
    width: 100%;
    height: .15rem;
    color: #fff;
    /* background-color: rgb(134, 134, 134); */
    border-bottom: 1px solid rgb(207, 207, 207);
    display: flex;
    align-items: center;
    padding: 0 .05rem;
    font-size: .1rem;
    cursor: pointer;
  }
  .video-list .video-item:hover{
    background-color: #fff;
    color: black;
  }
  .video-list .video-item span{
    margin-left: .05rem;
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .video-list li:last-child{
    border-bottom: 0;
  }
  .selected{
    color: #268bdd;
  }
</style>