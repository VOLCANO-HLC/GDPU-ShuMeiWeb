<template>
  <div class="fansList" :style="{color:textColor}">
    <div class="left-sider">
      <leftSider :siderNames="leftItems" :closeBtn="false" @change="onChange"></leftSider>
    </div>
    <!-- 列表内容 -->
    <div class="right-sider">
      <div class="follow-content">
        <fansCart v-for="(item,index) in fansContentData" :key="index"
         :name="item.name" :sign="item.sign" :avatar="item.avatar" @delSelf="delCart(index)" @clickAvatar="gotoSpace(item)"></fansCart>
         <p class="load-text" v-if="LoadState===0">加载失败</p>
         <p class="load-text" v-if="LoadState===1">没有更多了~</p>
      </div>
      <!-- 分页 -->
      <div class="page-bar">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="pageIndex"
          :page-size="count"
          layout="total,prev, pager, next"
          :total="fansCount">
        </el-pagination>
      </div>
      <!-- 分页 -->
    </div>
    <!-- 列表内容 -->
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import fansCart from './fansCart'
import leftSider from './leftSider'
import '@/assets/resetCss/reSpace.css'
import '@/assets/resetCss/reVantCss.css'
  export default {
    name:'fansList',
    data(){
      return{
        //选择的左侧边索引
        activeKey:0,
        //列表名字数组
        leftItems:['全部粉丝'],
        //当前获取的关注列表内容
        fansContentData:[],
        //加载的数量
        count: 5,
        pageIndex:1,
        LoadState: false,
      }
    },
    created(){
      //获取全部粉丝列表分组名
      this.getFansListData();
    },
    computed:{
      textColor(){
        return this.$store.state.textColor;
      },
      fansCount(){
        return this.$store.state.userInfo.fansCount;
      }
    },
    components:{fansCart,leftSider},
    methods:{
    //去往用户空间
    gotoSpace(item){
      this.$router.push({path:'/AuthorSpace', query:{id:item.customerId}});
    },

    // 切换分组
    onChange(_index){
      this.activeKey = _index;
      // console.log(_index)
    },

    //获取全部粉丝列表分组名
    getFansListData(){
      request({
        url: api_list.api_getFansList,
        method: 'get',
        params:{
          page:this.pageIndex,
          limit:this.count
        }
      }).then( res => {
        // console.log(res)
        if(res.success && res.data.rows){
          this.fansContentData = res.data.rows;
        } else {
          this.LoadState = 1;
        }
      }).catch( err => {
        this.LoadState = 0;
      })
    },
    //切换页面
    handleCurrentChange(){
        console.log(this.pageIndex)
        request({
        url: api_list.api_getFansList,
        method: 'get',
        params:{
          page:this.pageIndex,
          limit:5
        }
      }).then( res => {
        // console.log(res.data)
        if(res.success){
          this.fansContentData = res.data.rows;
        } else {
          this.LoadState = 1;
        }
      }).catch( err => {
        this.LoadState = 0;
      })
    },
  }
}
</script>

<style scoped>
  .fansList{
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .list-content{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    /* overflow-y: scroll; */
  }
  .left-sider{
    position: absolute;
    width: 12%;
    height: 100%;
    border-right: 1px solid rgba(192, 192, 192, 0.5);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .right-sider{
    position: absolute;
    right: 0;
    width: 88%;
    height: 100%;
    padding: 0 .1rem;
    box-sizing: border-box;
    overflow-y: hidden;
  }
  .page-bar{
    position: absolute;
    display: flex;
    justify-content: center;
    height: .2rem;
    margin-top: .1rem;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .msgText{
    margin-top: .1rem;
    font-size: .1rem;
    text-align: center;
  }
  .load-text{
    font-size: .1rem;
    text-align: center;
    font-weight: 500;
  }
</style>