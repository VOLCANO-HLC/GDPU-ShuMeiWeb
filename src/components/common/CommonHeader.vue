<template>
  <div :class="{'commonHeader':true, 'isfixed':isFixed}" ref="header">
    <div class="content">
      <div class="logo" @click="gotoHome">DMT</div>
      <!-- 搜索 -->
      <div class="search-bar">
        <div class="search-box">
          <i class="el-icon-search" @click="startSearch"></i>
          <el-input
            placeholder="请输入内容"
            v-model="inputVal"
            size="small"
            clearable
            @keydown.enter.native="startSearch"
          >
          </el-input>
        </div>
      </div>
      <!-- 搜索 -->
      <!-- 用户栏 -->
      <div class="user-base">
        <div class="user-content">
          <router-link class="user-avatar"  target="_blank" :style="{backgroundImage:'url(' + avatar + ')'}" to="/UserSpace" v-if="isLogin"
           @mouseenter.native="outLogin=true" @mouseleave.native="outLogin=false">
          </router-link>
          <div class="out-login" v-show="outLogin" @mouseenter="outLogin=true" @mouseleave="outLogin=false">
            <div class="out-arrow"></div>
            <div class="out-login-btn" @click.stop="unregister">
              <van-icon name="home-o" size=".1rem" color="#fff"/>退出登录
            </div>
          </div>
          <ul class="user-options">
            <router-link class="option-item" to="/Login" v-if="!isLogin">登录/注册</router-link>
            <router-link :to="item.router" target="_blank" class="option-item" v-for="(item,index) in userOptions" :key="index">
              {{item.name}}
              <span class="badge" v-if="noReadMsg[index] && noReadMsg[index].count">{{noReadMsg[index].count}}</span>
            </router-link>
          </ul>
        </div>
      </div>
      <!-- 用户栏 -->
    </div>
  </div>
</template>
<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import '../../assets/resetCss/reSearch.css'
  export default{
    name:'commonHeader',
    data(){
      return{
        // 新消息数量
        newMsgCount: [],
        isLogin:false,
        outLogin:false,
        inputVal:'',
        userOptions:[
          {
            router:'/UserSpace/feedList',
            name:'动态'
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
            router:'/UserSpace/messageList',
            name:'消息'
          } 
        ]
      }
    },
    created(){
      if(this.$cookies.isKey('user_token')){
        this.isLogin = true;
        this.getNoReadFeedCount();
        this.getNoReadCommentCount();
        this.getNoReadLikedCount();
      }
    },
    mounted(){
      this.setListenEvent();
    },
    computed:{
      avatar(){
        if(this.$store.state.userInfo){
          return this.$store.state.userInfo.avatar;
        }
      },
      //未读消息数量
      noReadMsg(){
        return this.$store.state.noReadMessage;
      },
      userObj(){
        return this.$store.state.userInfo;
      }
    },
    methods:{
      //退出登录
      unregister(){
        this.$cookies.remove('user_token');
        this.$cookies.remove('user_id');
        this.$router.go(0)
      },
      //页面滚动
      scrollRoll(){
        if(this.isFixed){
          let topDis = window.pageYOffset;
          if(topDis>0){
            this.$refs.header.style.background = 'rgba(0, 0, 0, 0.8)'
          } else {
            this.$refs.header.style.background = 'rgba(0, 0, 0, 0.4)'
          }
        }
      },
      //设置监听事件
      setListenEvent(){
        document.addEventListener('scroll', this.scrollRoll)
      },

      // 获取未读动态数量
      getNoReadFeedCount(){
        request({
          url: api_list.api_getNoReadFeedCount,
          method: 'get',
        }).then(res => {
          // console.log(res);
          this.$store.commit('updateNoReadMessageCount',{index: 0, count: res.data.count})
        })
      },
      // 获取未读评论数量
      getNoReadCommentCount(){
        request({
          url: api_list.api_getNoReadCommentCount,
          method: 'get',
        }).then(res => {
          // console.log(res);
          let tempArr = this.$store.state.noReadMessage;
          // 如果未读消息不存在，就直接给与新的未读消息对象
          if(!tempArr[3]){
            this.$store.commit('updateNoReadMessageCount',{index: 3, commentCount: res.data.count, count: res.data.count});
          } else {
            // 累加未读消息数量
            tempArr[3].count += res.data.count;
            this.$store.commit('updateNoReadMessageCount',{index: 3, likedCount: tempArr[3].likedCount, commentCount: res.data.count, count: tempArr[3].count});
          }
          // console.log(this.$store.state.noReadMessage)
        })

      },
      // 获取未读点赞数量
      getNoReadLikedCount(){
        request({
          url: api_list.api_getNoReadLikedCount,
          method: 'get',
        }).then(res => {
          // console.log(res);
          let tempArr = this.$store.state.noReadMessage;
          // 如果未读消息不存在，就直接给与新的未读消息对象
          if(!tempArr[3]){
            this.$store.commit('updateNoReadMessageCount',{index: 3, likedCount: res.data.count, count: res.data.count});
          } else {
            // 累加未读消息数量
            tempArr[3].count += res.data.count;
            this.$store.commit('updateNoReadMessageCount',{index: 3, likedCount: res.data.count, commentCount: tempArr[3].commentCount, count: tempArr[3].count});
          }
          // console.log(this.$store.state.noReadMessage)
        })
      },
      // 搜索功能
      startSearch(){
        this.$router.push({path:"/Search",query:{searchString:this.inputVal}})
      },
      //返回主页
      gotoHome(){
        this.$router.push('/')
      }
    },
    props:{
      //接受参数来决定是否吸顶
      isFixed:Boolean
    },
    destroyed(){
      //清除事件监听
      document.removeEventListener('scroll',this.scrollRoll)
    }
  }
</script>

<style scoped>
  .commonHeader{
    /* position: fixed; */
    width: 100%;
    height: .35rem;
    background: rgba(0, 0, 0, 0.4);
    z-index: 20;
    display: flex;
    align-items: center;
  }
  .content{
    display: flex;
    width: 100%;
    height: 80%;
    justify-content: space-between;
  }
  .logo{
    width: .6rem;
    font-size: .2rem;
    color: #fff;
    margin-left: .2rem;
    cursor: pointer;
  }
  .isfixed{
    position: fixed;
  }
  .search-bar{
    display: flex;
    align-items: center;
  }
  .search-box{
    display: flex;
    width: 2rem;
    height: .18rem;
    border: 2px solid rgb(255, 255, 255);
    border-radius: .2rem;
    padding: 0 .05rem;
    margin: 0 auto;
    align-items: center;
    background: none;
  }
  .searchBox i{
    font-size: .12rem;
    color: #fff;
    border-right: 1px solid #fff;
    padding-right: 10px;
  }
  .el-icon-search{
    font-size: .12rem;
    color: #fff;
    border-right: 1px solid #fff;
    padding-right: .05rem;
  }
  .user-base{
    margin-right: .2rem;
  }
  .user-base,.user-content{
    display: flex;
    align-items: center;
    position: relative;
  }
  .user-avatar{
    position: relative;
    float: left;
    width: .2rem;
    height: .2rem;
    border: 1px solid #fff;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    margin-right: .1rem;
  }
  .user-options{
    float: left;
  }
  .user-options::after{
    content: '';
    display: block;
    clear: both;
  }
  .option-item{
    position: relative;
    float: left;
    font-size: .1rem;
    color: #fff;
    margin-right: .1rem;
    cursor: pointer;
  }
  .option-item:hover{
    color:rgb(103, 198, 253);
  }


  .badge{
    position: absolute;
    display: inline-block;
    width: 18px;
    height: 18px;
    right: -10px;
    font-size: 8px;
    text-align: center;
    line-height: 20px;
    top: -10px;
    background-color: crimson;
    border-radius: 50%;
  }


  .out-login{
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: .5rem;
    top: 100%;
    padding-top: .05rem;
    z-index: 20;
  }
  .out-arrow{
    float: left;
    width: .05rem;
    height: .05rem;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
    transform: rotateZ(45deg);
    margin-left: .08rem;
  }
  .out-login-btn{
    box-sizing: border-box;
    width: 100%;
    height: .2rem;
    border: 1px solid #fff;
    align-items: center;
    display: flex;
    font-size: .05rem;
    color:#fff;
    justify-content: center;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.521);
  }
  .out-login-btn:hover{
    box-shadow: 0 0 10px rgb(255,255,255,.3);
  }
</style>