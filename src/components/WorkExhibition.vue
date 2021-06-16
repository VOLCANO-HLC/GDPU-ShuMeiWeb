<template>
  <div class="workExhibition">
    <commonHeader :isFixed="false"></commonHeader>
    <div class="exhibitionWrap">
      <div class="exhibition-content">
        <!-- 头部 -->
        <div class="content-head">
          <div class="work-title">{{workObj.title}}
            <span class="work-type">{{workObj.typeName}}</span>
          </div>
          <div class="send-time">{{updateTime}}</div>
          <div class="author-info">
            <authorIntroduce :authorId="authorId" @follow="openFollow = true"></authorIntroduce>
          </div>
        </div>
        <!-- 头部 -->
        <!-- 内容 -->
        <div class="main-content">
          <div class="left-content" ref="leftContent">
            <div class="work-player" ref="videoPlayer" v-show="haveVideos">
              <workPlayer :videoIndex="videoIndex" v-if="isLoad"></workPlayer>
            </div>
            <div class="imgs-show" ref="imgsShow" v-if="!haveVideos">
              <el-carousel trigger="click" :height="swipeHeight + 'px'" ref="carousel" :interval="5000">
                <el-carousel-item v-for="imgUrl in imgsUrlArr" :key="imgUrl">
                  <div class="img-item" :style="{backgroundImage:'url(' + imgUrl + ')'}"></div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <!-- 底部图片轮播图 -->
            <div class="imgs-swipe" v-if="haveImgs">
              <workImgSwipe v-if="isLoad"></workImgSwipe>
            </div>
            <!-- 底部图片轮播图 -->
          </div>
          <!-- 视频列表 -->
          <div class="right-content" ref="rightContent" v-if="haveVideos">
            <workVideoList :workVideos="workObj.workVideoInfoList" @videoClick="clickVideo"></workVideoList>
          </div>
          <!-- 视频列表 -->
        </div>
        <!-- 内容 -->
        <!-- 下部分 -->
        <div class="content-below">
          <!-- 简介 -->
          <div class="brief-introduction">
            <div class="meta-info">
              <van-icon name="fire-o" size=".1rem"/>{{hot}}
              <van-icon ref="collectBtn" :class="{isCollected:isCollected}" name="star-o" size=".1rem" style="cursor:pointer" @click="collectBtn"/>
              {{collectCount}}
              <div class="netdisk" v-if="this.$cookies.get('user_token')&&netdiskUrl">
                <span class="netdisk-url">网盘链接: <a :href="netdiskUrl" target="_blank" :title="netdiskUrl">{{netdiskUrl}}</a>    </span>
                <span class="netdisk-code">验证码:{{netdiskCode}}</span>
              </div>
            </div>
            <div class="description">
              简介：
              <pre class="description-content">
                {{description}}
              </pre>
            </div>
          </div>
          <!-- 简介 -->
          <!-- 收藏 -->
          <van-overlay class="mark-wrap" :show="openCollect" z-index="20">
            <collectForm @close="openCollect = false" @collectSuccess="addWorkCollect"></collectForm>
          </van-overlay>
          <!-- 收藏 -->
          <!-- 关注 -->
          <van-overlay class="mark-wrap" :show="openFollow" z-index="20">
            <followForm @close="openFollow = false" @followSuccess="addFollowNum"></followForm>
          </van-overlay>
          <!-- 关注 -->
          <!-- 评论 -->
          <commentArea class="clearFix"></commentArea>
          <!-- 评论 -->
          <!-- 相关作品 -->
          <relevantWork :typeId="typeId" :workId="workId" @clickRelevant="clickRelevant"></relevantWork>
          <!-- 相关作品 -->
        </div>
        <!-- 下部分 -->
      </div>
    </div>
  </div>
</template>

<script>
import commonHeader from './common/CommonHeader'
import authorIntroduce from './common/authorIntroduce'
import workPlayer from './common/workPlayer'
import workVideoList from './common/workVideoList'
import commentArea from './common/commentArea'
import workImgSwipe from './common/workImgSwipe'
import relevantWork from './common/relevantWork'
import collectForm from './common/collectForm'
import followForm from './common/followForm'
import {request} from '@/network/request'
import api_list from '@/network/api_list'
  export default {
    name:'WorkExhibition',
    data(){
      return{
        //作者id
        authorId:'',
        //作品分类id
        typeId:'',
        //作品id
        workId:'',
        //作品全部信息
        workObj:{},
        //选择第几个视频播放
        videoIndex:0,
        //加载数据完成
        isLoad:false,
        //轮播图可视化区域的高，用于初始化一些样式
        swipeHeight:'',
        //打开收藏面板
        openCollect:false,
        //打开关注面板
        openFollow:false,
        //是否已经收藏
        isCollected:false
      }
    },
    components:{commonHeader,authorIntroduce,workPlayer,workVideoList,commentArea,workImgSwipe,relevantWork,collectForm,followForm},
    created(){
      this.transmitData();
      this.getWorkDetails();
    },
    computed:{
      hot(){
        if(this.workObj.hot>999 && this.workObj.hot<10000){
          return (this.workObj.hot/1000).toFixed(1) + 'k';
        } else if(this.workObj.hot>=10000){
          return (this.workObj.hot/10000).toFixed(1) + 'w';
        } else {
          return this.workObj.hot;
        }
      },
      collectCount(){
        if(this.workObj.collectCount>999 && this.workObj.collectCount<10000){
          return (this.workObj.collectCount/1000).toFixed(1) + 'k';
        } else if(this.workObj.collectCount>=10000){
          return (this.workObj.collectCount/10000).toFixed(1) + 'w';
        } else {
          return this.workObj.collectCount;
        }
      },
      description(){
        return this.workObj.description;
      },
      workType(){
        switch(this.workObj.typeId){
          case '1':
            return '动画';
            break;
          case '2':
            return '游戏';
            break; 
          case '3':
            return '影视后期';
            break;
          case '4':
            return '插画';
            break;
          default: break;
        }
      },
      imgsUrlArr(){
        return this.$store.getters.getImgsUrl;
      },
      netdiskUrl(){
        return this.workObj.netdiskUrl;
      },
      netdiskCode(){
        return this.workObj.netdiskCode;
      },
      updateTime(){
        return this.workObj.updateTime;
      },
      //判断有没有视频，有就显示播放器，没有就显示轮播图
      haveVideos(){
        if(this.workObj.workVideoInfoList){
          return this.workObj.workVideoInfoList.length;
        } else {
          return this.workObj.workVideoInfoList;
        }
      },
      //判断有没有图片，没有的话，底部轮播图就不显示
      haveImgs(){
        if(this.workObj.workPictureInfoList){
          return this.workObj.workPictureInfoList.length;
        } else {
          return this.workObj.workPictureInfoList;
        }
      }
    },
    mounted(){
    },
    methods:{
      //增加关注数
      addFollowNum(){
        //更新作者粉丝数
        this.$store.commit('updateAuthorFans',1);
        this.$toast({
          message:'关注成功'
        });
      },
      //取消收藏
      cancelCollect(){
        // this.openCollect = true;
        // request({
        //   url:api_list.api_removeCollection,
        //   method:'delete',
        //   data:{
        //     workId:this.workObj.id,

        //   }
        // })
      },
      //收藏按钮
      collectBtn(){
        //判断有没有登录
        if(this.$cookies.isKey('user_token')){
          //如果已经收藏，就执行取消收藏操作
          if(this.isCollected){
            this.cancelCollect();
          } else {
            //打开收藏面板
            this.openCollect = true;
          }
        } else {
          this.$toast({
            message:'请先登录'
          })
        }
      },
      //收藏加1
      addWorkCollect(){
        this.workObj.collectCount ++;
        this.isCollected = true;
        this.$toast({
          message:'收藏成功'
        })
      },
      //增加作品热度
      addWorkHot(){
        request({
          url:api_list.api_addWorkHot,
          method:'put',
          params:{
            workId:this.$route.query.id
          }
        })
      },
      //点击相关作品
      clickRelevant(item){
        this.$router.push({path:'/WorkExhibition', query:item});
      },
      //选择点击播放视频
      clickVideo(index){
        this.videoIndex = index;
      },
      //初始化数值
      initWrap(){
        if(!this.workObj.workVideoInfoList){
          this.$refs.leftContent.style.width = "100%";
          this.swipeHeight = this.$refs.imgsShow.offsetHeight-1;
        };
        if(!this.workObj.workPictureInfoList){
          this.$refs.videoPlayer.style.height = '100%';
        }
      },
      //向子组件传递相关数据
      transmitData(){
        //先将作者id传去子组件
        this.authorId = this.$route.query.customerId;
        this.typeId = this.$route.query.typeId;
        this.workId = this.$route.query.id;
      },
      //获取作品详细信息
      getWorkDetails(){
        if(this.$route.query){
          request({
            url:api_list.api_getWorkInfo,
            method:'get',
            params:{
              workId:this.$route.query.id
            }
          }).then( res => {
            if(res.success){
              this.workObj = res.data.item;
              this.isCollected = res.data.collected;
              this.workObj.hot++;
              //store存储作品详情信息
              this.$store.commit('updateWorkInfo', this.workObj);
              this.initWrap();
              this.addWorkHot();
              this.isLoad = true;
            }
          })
        }
      },
    },
    watch:{
      //监听路由跳转，如果还是改路由就刷新
      $route(to, from){
        if(to.name === from.name){
          this.$router.go(0);
        }
      }
    }
  }
</script>

<style scoped>
  .workExhibition{
    width: 100%;
    /* background-size: cover; */
    background-color: rgb(20, 20, 20);
    /* background-repeat: no-repeat; */
  }
  .exhibitionWrap{
    width: 6rem;
    margin: 0 auto;
    background-color: rgb(20, 20, 20);
  }
  .content-head{
    position: relative;
    width: 100%;
    height: .6rem;
    /* background-color: rgb(73, 73, 73); */
    margin-bottom: .1rem;
  }
  .author-info{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 1.5rem;
    display: flex;
    justify-content: center;
  }
  .work-title{
    position: absolute;
    bottom: 0;
    font-size: .18rem;
    color: #fff;
    /* display: flex;
    align-items: center; */
  }
  .work-type{
    font-size: .02rem;
    border: 1px solid #fff;
    padding: .01rem;
    background-color: rgba(255, 255, 255, 0.39);
    margin-left: .1rem;
  }
  .send-time{
    font-size: .05rem;
    color: rgb(151, 151, 151);
    position: absolute;
    bottom: -.1rem;
  }
  .main-content{
    position: relative;
    width: 100%;
    height: 3rem;
    /* background-color: rgb(73, 73, 73); */
  }
  .left-content{
    position: absolute;
    left: 0;
    width: 4.5rem;
    height: 100%;
  }
  .work-player{
    height: 85%;
  }
  .imgs-show{
    width: 100%;
    height: 85%;
  }
  .img-item{
    width: 100%;
    height: 100%;
    /* background-position: center; */
    background-size: cover;
  }
  .imgs-swipe{
    width: 100%;
    height: 15%;
  }
  .right-content{
    position: absolute;
    right: 0;
    width: 1.45rem;
    height: 100%;
  }
  .brief-introduction{
    margin-top: .2rem;
    width: 4.5rem;
    /* height: 2rem; */
    background-color: rgb(48, 48, 48);
  }
  .content-below{
    position: relative;
  }
  .meta-info{
    width: 100%;
    height: .2rem;
    background-color: rgb(48, 48, 48);
    font-size: .05rem;
    line-height: .25rem;
    border-bottom: 1px solid rgb(71, 71, 71);
    color: #fff;
  }
  .meta-info i{
    margin-left: .1rem;
    /* color: rgb(255, 255, 255); */
  }
  .description{
    padding: .1rem;
    font-size: .1rem;
    line-height: .15rem;
  }
  .description-content{
    margin: 0 auto;
    width: 3rem;
    height: .5rem;
    font-size: .1rem;
    margin: 0;
    padding: 0;
    text-indent: .2rem;
    border: 1.5px solid black;
    border-radius: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    background-color: rgb(71, 71, 71);
    font-family: Arial, Helvetica, sans-serif;
  }
  .isCollected{
    cursor: default;
    color: red;
  }
  .netdisk{
    font-size: .09rem;
    color: blanchedalmond;
    display: flex;
    float: right;
    height: 100%;
    align-items: center;
  }
  .netdisk span{
    margin-right: .05rem;
    line-height: .09rem;
  }
  .netdisk-url a{
    display: inline-block;
    max-width: 1rem;
    color: rgb(171, 26, 207);
    text-decoration: underline;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .mark-wrap{
    height: 100vh;
    overflow: hidden;
  }
</style>