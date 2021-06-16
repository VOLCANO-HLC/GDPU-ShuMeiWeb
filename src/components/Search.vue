<template>
  <div class="search">
    <router-link class="go-back" to="/">
      <van-icon name="share-o" size=".2rem" color="#fff" style="transform: rotateY(180deg);"/>返回
    </router-link>
    <div class="search-header">
      <div class="search-header-content">
        <div class="searchBox">
          <i class="el-icon-search" @click="startSearch"></i>
          <el-input
            placeholder="请输入内容"
            v-model="inputVal"
            size="small"
            color="none"
            clearable
            @keydown.enter.native="startSearch"
          >
          </el-input>
        </div>
        <div class="search-filter">
        <span class="filter-item" :class="{selectStyle:selectIndex===0}" @click="searchFilter(0)">全部</span>
          <span class="filter-item" :class="{selectStyle:selectIndex===1}" @click="searchFilter(1)">最新</span>
          <span class="filter-item" :class="{selectStyle:selectIndex===2}" @click="searchFilter(2,0)">热度
            <i class="el-icon-bottom" v-if="!searchObj.hot"></i>
            <i class="el-icon-top" v-if="searchObj.hot"></i>
          </span>
          <span class="filter-item" :class="{selectStyle:selectIndex===3}" @click="searchFilter(3)">收藏</span>
        </div> 
        <div class="type-filter">
          <span class="type-item" :class="{selectStyle:selectType===typeItem.id}" v-for="(typeItem,index) in typeList" :key="typeItem.id" @click="typeSearch(typeItem.id)">{{typeItem.name}}</span>
        </div>
      </div>  
    </div>
    <div class="search-result">
      <h3 class="content-title">作品</h3>
      <hr>
      <div class="work-list">
        <workShowCart :work="item" v-for="item in worksList" :key="item.id"></workShowCart>
      </div>
      <div class="noMore" v-if="worksList.length===0">{{loadState}}</div>
      <div class="page-list" v-if="worksList.length!==0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="18"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import workShowCart from './common/workShowCart'
import '../assets/resetCss/reSearch.css'
import qs from 'qs'
  export default{
    name:'Search',
    data(){
      return{
        //返回的搜索结果
        worksList:[],
        //加载状态
        loadState:'没更多了，请搜索~',
        //搜索字符串
        inputVal:'',
        //当前分页
        currentPage:1,
        //搜索相关的总作品数
        total:0,
        //查询的对象
        searchObj:{},
        // 作品分类列表
        typeList: [],
        typeName:['动画','游戏','影视后期','绘画'],
        //选中的标签
        selectIndex: 0,
        //选择的分类
        selectType:null,
      }
    },
    created(){
      if(this.$route.query.searchString){
        this.inputVal = this.$route.query.searchString;
      }
      this.getWorkType();
      this.startSearch();
    },
    components:{workShowCart},
    computed:{
    },
    methods:{
      //切换分页
      handleCurrentChange(index){
        this.currentPage = index;
        this.startSearch();
      },
      //查询过滤条件
      searchFilter(index,value){
        this.selectIndex = index;
        this.currentPage = 1;
        switch(index){
          case 0:
            this.searchObj.hot = null; 
            this.searchObj.collectMost = null; 
            this.searchObj.latest = null;
            this.startSearch();
            break;
          case 1:
            this.searchObj.hot = null; 
            this.searchObj.collectMost = null; 
            this.searchObj.latest = index;
            this.startSearch();
            break;
          case 2:
            this.searchObj.collectMost = null; 
            this.searchObj.latest = null;
            if(this.searchObj.hot === 0){
              this.searchObj.hot = 1;  
            } else {
              this.searchObj.hot = value;
            }
            this.startSearch();
            break;
          case 3:
            this.searchObj.hot = null;
            this.searchObj.latest = null; 
            this.searchObj.collectMost = index;  
            this.startSearch();
            break;
        }
      },
      //按分类搜索
      typeSearch(_id){
        //判断是否已经点了分类按钮，点击相同按钮就取消条件，点击不同分类按钮就切换
        if(String(_id) === this.searchObj.typeId){
          this.searchObj.typeId = ''
          this.selectType = null;
        } else {
          this.searchObj.typeId = String(_id);
          this.selectType = _id;
        }
        //重置分页
        this.currentPage = 1;
        this.startSearch();
      },
      //开始搜索
      startSearch(){
        this.loadState = '加载中~';
        this.searchObj.queryString = this.inputVal;
        console.log(this.searchObj)
        request({
          url:api_list.api_getRelatAllWork,
          method:'get',
          params:{
            page:this.currentPage,
            limit:18,
            search:'?' + qs.stringify(this.searchObj)
          },
        }).then( res => {
          console.log(res)
          if(res.success){
            if(res.data.rows){
              this.worksList = res.data.rows;
            } else {
              this.worksList = [];
            }
            // console.log(this.worksList)
            this.total = res.data.total;
            this.loadState = '没更多了，请搜索~';
          } else {
            this.loadState = '加载失败';
          }
        }).catch(err => {
          this.loadState = '加载失败';
        })
      },
      //获取作品分类
      getWorkType(){
        request({
          url:api_list.api_getAllWorksSortName,
          method: 'get'
        }).then(res => {
          // console.log(res)
          if(res.success){
            this.typeList = res.data.item;
          }
        })
      }
    },
    //设置路由守卫，动态添加组件缓存
    beforeRouteLeave(to, from, next){
      if(to.name !== 'WorkExhibition'){
        this.$store.commit('noKeepAlive','Search');
        // console.log(this.$store.state.catchArr)
      } else {
        this.$store.commit('isKeepAlive','Search');
        // console.log(this.$store.state.catchArr)
      }
      next();
    }
  }
</script>

<style scoped>
  .search{
    width: 100%;
    overflow: hidden;
  }
  .search-header{
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 2rem;
    background: black;
    flex-wrap: wrap;
  }
  .go-back{
    display: flex;
    position: absolute;
    top: .05rem;
    left: .05rem;
    z-index: 10;
    font-size: .1rem;
    color: #fff;
    align-items: center;
  }
  .search-header-content{
    width: 100%;
  }
  .searchBox{
    display: flex;
    width: 2rem;
    height: .25rem;
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
  .search-filter,.type-filter{
    display: flex;
    width: 2rem;
    margin-top: .05rem;
    justify-content: space-around;
    margin: .05rem auto;
  }
  .type-filter{
    position: absolute;
    box-sizing: border-box;
    bottom: .3rem;
    width: 100%;
    padding: 0 1.5rem;
    display: flex;
    justify-content: space-between;
  }
  .filter-item,.type-item{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .02rem;
    font-size: .05rem;
    color: #fff;
    
    cursor: pointer;
  }
  .filter-item i{
    font-size: .05rem;
    color: #fff;
  }
  .type-item{
    border: 1.5px solid #fff;
    border-radius: 5px;
    background-color: black;
    font-size: .05rem;
  }
  .search-result{
    width: 7rem;
    max-height: 8rem;
    margin: .1rem auto;
    /* border: 1px solid black; */
  }
  .content-title{
    font-size: .3rem;
    text-align: center;
    margin: .2rem 0;
  }
  hr{
    margin: .3rem 0;
    width: 100%;
  }
  .work-list{
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  .workShowCart{
    margin-right: .1rem;
  }
  .workShowCart:nth-of-type(6n){
    margin-right: 0;
  }
  .noMore{
    text-align: center;
    font-size: .15rem;
    font-weight: 300;
  }
  .page-list{
    width: 100%;
    height: .2rem;
    display: flex;
    justify-content: center;
  }
  .selectStyle{
    color: red;
    background-color: black;
  }
</style>