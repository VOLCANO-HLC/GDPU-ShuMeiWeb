<template>
  <div class="userSpace" :style="{backgroundImage:'url(' + userObj.background + ')'}">
    <!-- 编辑信息 -->
    <modifyInfo @close="closeModify" v-if="isModify" :userInfo="userObj"></modifyInfo>
    <!-- 编辑信息 -->
    <commonHeader :isFixed="false"></commonHeader>
    <div class="spaceWrap">
      <!-- 用户头部 -->
      <spaceHead :username="userObj.name" :userSign="userObj.sign" :avatarUrl="userObj.avatar" :sex="userObj.sex" @modifyInfo="modifyInfoFn"></spaceHead>
      <!-- 用户头部 -->
      <!-- 主体内容 -->
      <div class="page-content">
        <!-- 左边 -->
        <div class="page-content-left">
          <userStatic :fansCount="userObj.fansCount" :followsCount="userObj.followsCount" :worksCount="userObj.worksCount"></userStatic>
          <tabsLeft :tabsItemList="tabsItems"></tabsLeft>
          <div class="up-works">
            <van-button icon="back-top" round type="info" @click="upWorkBtn">投稿</van-button>
          </div>
        </div>
        <!-- 左边 -->
        <!-- 右边 -->
        <div class="page-content-right" :style="{backgroundColor:backgroundColor}">
          <div class="page-content-center">
            <router-view></router-view>
          </div>
        </div>
        <!-- 右边 -->
      </div>
      <!-- 主体内容 -->
    </div>
    <extendFunctions v-if="isLoad"></extendFunctions>
  </div>
</template>

<script>
import commonHeader from './common/CommonHeader'
import spaceHead from './common/spaceHead'
import userStatic from './common/userStatic'
import tabsLeft from './common/tabsLeft'
import followList from './common/followList'
import fansList from './common/fansList'
import feedList from './common/feedList'
import messageList from './common/messageList'
import modifyInfo from './common/modifyInfo'
import worksList from './common/worksList'
import extendFunctions from './common/extendFunctions'
import '../assets/resetCss/reComment.css'
import {request} from '@/network/request'
import api_list from '@/network/api_list'
  export default{
    name:'userSpace',
    data(){
      return{
        isLoad:false,
        isModify:false,
        // userObj:{},
        tabsTag:0,
        //左侧导航栏
        tabsItems:[
          {
            router:'/UserSpace/feedList',
            name:'动态'
          },
          {
            router:'/UserSpace/fansList',
            name:'粉丝'
          },
          {
            router:'/UserSpace/followList',
            name:'关注'
          },
          {
            router:'/UserSpace/worksList',
            name:'作品'
          },
          {
            router:'/UserSpace/collectList',
            name:'收藏'
          },
          {
            router:'/UserSpace/messageList',
            name:'消息'
          },
        ],
      }
    },
    created(){
      this.checkLogin();
    },
    computed:{
      backgroundColor(){
        return this.$store.state.spaceColor;
      },
      userObj(){ 
        this.isLoad = true;
        return this.$store.state.userInfo;
      }
    },
    methods:{
      //投稿
      upWorkBtn(){
        this.$router.push('/UpWork');
      },
      //关闭修改
      closeModify(){
        this.isModify = false;
      },
      // 检测有没有登录，没有就跳转登录页面
      checkLogin(){
        if(!this.$cookies.get('user_token')){
          this.$router.push('/Login');
        }
      },
      //修改信息
      modifyInfoFn(){
        this.isModify = true;
      }
    },
    components:{commonHeader, spaceHead, userStatic, tabsLeft, followList,
       fansList, feedList, modifyInfo, worksList, extendFunctions, messageList}
  }
</script>

<style scoped>
  .userSpace{
    position: relative;
    height: 100vh;
    background-image: url('../assets/imgs/user_spaceImg.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    overflow-x: hidden;
  }
  .spaceWrap{
    width: 7rem;
    height: 3rem;
    margin: 0 auto;
  }
  .page-content{
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 6rem;
    /* background: rgb(255,255,255,.3); */
    border-radius: .05rem;
    padding: .03rem .02rem;
  }
  .page-content-left{
    position: absolute;
    width: 1rem;
  }
  .up-works{
    text-align: center;
    line-height: .2rem;
  }
  .page-content-right{
    position: absolute;
    right: .03rem;
    width: 5.9rem;
    height: 96%;
    border-radius: .03rem;
    background: rgb(255,255,255,.8);
    padding-top: .1rem;
  }
  .page-content-center{
    float: left;
    width: 100%;
    height: 99%;
    overflow: hidden;
  }
  .extendFunctions{
    position: fixed;
    right: .7rem;
    bottom: .5rem;
  }
</style>