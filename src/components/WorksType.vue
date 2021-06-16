<template>
  <div class="worksType">
    <commonHeader :isFixed="true"></commonHeader>
    <!-- 轮播图 -->
    <div class="hot-swipe">
      <hotSwipe :hotList="hotWorksList" v-if="isLoad"></hotSwipe>
    </div>
    <!-- 轮播图 -->
    <!-- 作品类型跳转 -->
    <div class="works-type">
      <div class="type-item" v-for="(item,index) in allType" :key="item.id"
      :style="{backgroundImage:'url(' + item.cover + ')'}"  @click="changeType(item.id)">
        <div class="type-mark">{{item.name}}</div>
      </div>
    </div>
    <!-- 作品类型跳转 -->
    <!-- 该类型的全部作品 -->
    <div class="works-list">
      <div class="title">
        <div class="title-name">{{typeName}}</div>
        <div class="works-search">
          <i class="el-icon-search"></i>
          <input class="input-bar" type="text" placeholder="请输入" v-model:value="inputVal"
          @keyup.enter="getWorksList">
        </div>
        <div class="title-option">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-menu"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="searchFilter(4)">全部</el-dropdown-item>
              <el-dropdown-item @click.native="searchFilter(2)">最新</el-dropdown-item>
              <el-dropdown-item @click.native="searchFilter(1)">热度↑</el-dropdown-item>
              <el-dropdown-item @click.native="searchFilter(0)">热度↓</el-dropdown-item>
              <el-dropdown-item @click.native="searchFilter(3)">收藏</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="works-list-content">
        <workShowCart v-for="(item,index) in worksList" :key="item.id" :work="item"></workShowCart>
      </div>
      <div class="load-state">
        <p class="load-text" v-if="loadState===1">加载中...</p>
        <p class="load-text" v-if="loadState===0">加载失败</p>
        <p class="load-text" v-if="loadState===2">没有更多了</p>
      </div>
      <div class="work-type">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="24"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 该类型的全部作品 -->
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import qs from 'qs'
import commonHeader from './common/CommonHeader'
import hotSwipe from './common/hotSwipe'
import workShowCart from './common/workShowCart'
  export default{
    name:'worksType',
    data(){
      return{
        searchObj:{
          queryString:'',
          typeId:'',
        },
        //每次获取的数据量
        limit:35,
        //获取的数据总数
        total:0,
        //当前页数
        currentPage:1,
        //是否加载数据完成
        isLoad:false,
        inputVal:'',
        //所有作品列表
        worksList:[],
        //热门作品列表
        hotWorksList:[],
        //所有作品分类简略信息
        allType:[],
        loadState: null,
      }
    },
    props:{},
    components:{commonHeader,hotSwipe,workShowCart},
    computed:{
      //返回该页面的作品类型名
      typeName(){
        for(let i in this.allType){
          if(this.allType[i].id === this.searchObj.typeId){
            return this.allType[i].name;
            break;
          }
        }
      }
    },
    created(){
      if(this.$cookies.isKey('user_token')){
        this.getUserInfo();
      }
      this.searchObj.typeId = this.$route.query.typeId;
      this.getHotWorks();
      this.getWorksList();
      this.getAllType();
    },
    methods:{
      //跳转分类页面
      changeType(_id){
        this.searchObj.typeId = _id;
        this.getHotWorks();
        this.getWorksList();
      },
      //分页改变
      handleCurrentChange(){
        this.getWorksList();
      },
      //搜索条件过滤
      searchFilter(filterNum){
        switch(filterNum){
          case 0:
            this.searchObj.latest = null;
            this.searchObj.collectMost = null;
            this.searchObj.hot = 0;
            this.getWorksList();
            break;
          case 1:
            this.searchObj.latest = null;
            this.searchObj.collectMost = null;
            this.searchObj.hot = 1;
            this.getWorksList();
            break;
          case 2:
            this.searchObj.hot = null;
            this.searchObj.collectMost = null;
            this.searchObj.latest = 2;
            this.getWorksList();
            break;
          case 3:
            this.searchObj.hot = null;
            this.searchObj.latest = null;
            this.searchObj.collectMost = 3;
            this.getWorksList();
            break;
          case 4:
            this.searchObj.hot = null;
            this.searchObj.latest = null;
            this.searchObj.collectMost = null;
            this.inputVal = null;
            this.getWorksList();
            break;
        }
      },
      //获取所有作品分类的简略信息，用于跳转不同分类页面
      getAllType(){
        request({
          url:api_list.api_getAllWorksSortName,
          method:'GET'
        }).then(res => {
          if(res.success){
            this.allType = res.data.item;
          }
        })
      },
      //获取该分类的热门作品
      getHotWorks(){
        request({
          url:api_list.api_getRelevantHotWorks,
          method:'get',
          params:{
            count:5,
            typeId:this.searchObj.typeId,
          }
        }).then(res => {
          // console.log(res)
          if(res.success){
            this.hotWorksList = res.data.items;
            this.isLoad = true;
          }
        })
      },
      //获取相关类型的全部作品
      getWorksList(){
        this.worksList = [];
        this.loadState = 1;
        this.searchObj.queryString = this.inputVal;
        request({
          url:api_list.api_getRelatAllWork,
          method:'get',
          params:{
            page:this.currentPage,
            limit:this.limit,
            search:'?' + qs.stringify(this.searchObj),
          }
        }).then( res => {
          console.log(res)
          if(res.data.total === 0){
            this.loadState = 2;
          }
          if(res.success){
            if(res.data.rows){
              this.worksList = res.data.rows;
              this.loadState = null;
            }
            this.total = res.data.total;
          } else {
            this.loadState = 0;
          }
        }).catch(err => {
          this.loadState = 0;
        })
      },
      //获取用户信息
      getUserInfo(){
        request({
          url:api_list.api_getUserInfo,
          method:'get'
        }).then(res => {
          // console.log(res);
          this.userObj = res.data.item;
          this.$store.commit('updateUserInfo',this.userObj)
          if(!this.$cookies.isKey('user_id')){
            this.$cookies.set('user_id',this.userObj.id,3*24*60*60);
          }
        })
      }
    },
    watch:{
    }
  }
</script>

<style scoped>
  .hot-swipe{
    width: 100%;
    height: 3.5rem;
  }
  .works-type{
    display: flex;
    padding: 0 .1rem;
    flex-wrap: wrap;
    /* width: 6rem; */
    justify-content: space-between;
    margin: .5rem auto;
  }
  .type-item{
    position: relative;
    width: 1rem;
    height: .4rem;
    /* border: 1px solid black; */
    background-color: rgb(255, 130, 130);
    border-radius: 5px;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .type-mark{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    font-size: .1rem;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.555);
  }
  .works-list{
    width: 6rem;
    height: 3rem;
    /* border: 1px solid black; */
    margin: 0 auto;
  }
  .title{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: .2rem;
    border-bottom: 1px solid #eee;
    padding: 0 .1rem;
    box-sizing: border-box;
  }
  .title-name,.title-option{
    font-size: .1rem;
  }
  .works-search{
    display: flex;
    width: 1rem;
    height: .1rem;
    border: 1.5px solid rgb(0, 0, 0);
    border-radius: .2rem;
    padding: 0 .05rem;
    margin: 0 auto;
    align-items: center;
    background: none;
    overflow: hidden;
  }
  .works-search i{
    font-size: .05rem;
    color: rgb(0, 0, 0);
    border-right: 1px solid rgb(0, 0, 0);
    padding-right: 10px;
  }
  .input-bar{
    width: 100%;
    height: 100%;
    color: #000;
    border: 0;
    margin-left: .05rem;
    font-size: .05rem;
  }
  .works-list-content{
    margin-top: .1rem;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-around;
  }
  .work-type{
    width: 100%;
    height: .3rem;
    margin-top: .1rem;
    display: flex;
    justify-content: center;
  }
  .load-text{
    font-size: .1rem;
    text-align: center;
    font-weight: 500;
  }
</style>