<template>
  <div class="authorIntroduce">
    <div class="author-info">
      <router-link :to="{path:'/AuthorSpace',query:{id:authorId}}" class="author-avatar" :style="{backgroundImage: 'url(' + authorInfo.avatar + ')'}"></router-link>
      <div class="base-info">
        <div class="author-name">
          <span>{{name}}</span>
          <span class="author-sex">
            <i class="el-icon-male" style="color: lightskyblue;" v-if="authorInfo.sex===0"></i>
            <i class="el-icon-female" style="color: rgb(250, 135, 250);" v-if="authorInfo.sex === 1"></i>
          </span>
        </div>
        <div class="describe" :title="sign">{{sign}}</div>
      </div>
    </div>
    <div class="follow-btn">
      <van-button v-if="followed" color="gray" size="mini" block type="primary" @click="cancelFollow">已关注<span class="follows-count">{{fansCount}}</span></van-button>
      <van-button v-if="!isAuthor && !followed" icon="plus" color="#1b9ae4" size="mini" block type="primary"
      @click="followBtn">关注<span class="follows-count">{{fansCount}}</span></van-button>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
  export default {
    name:'authorIntroduce',
    data(){
      return{
        authorInfo:{},
      }
    },
    created(){
      this.getAuthorInfo();
    },
    props:{
      authorId:String
    },
    computed:{
      //判断是否为作者本人，是就不显示关注按钮
      isAuthor(){
        return this.$store.state.authorInfo.id === this.$cookies.get('user_id');
      },
      name(){
        return this.$store.state.authorInfo.name;
      },
      sign(){
        return this.$store.state.authorInfo.sign;
      },
      fansCount(){
        return this.$store.state.authorInfo.fansCount;
      },
      followed(){
        return this.$store.state.authorInfo.followed;
      }
    },
    methods:{
      //取关
      cancelFollow(){
        request({
          url:api_list.api_unFollow,
          method:'put',
          params:{
            customerId:this.authorId
          }
        }).then( res => {
          // console.log(res)
          if(res.success){
            this.$store.commit('updateAuthorFans',0);
          }
        })
      },
      //关注
      followBtn(){
        if(this.$cookies.isKey('user_token')){
          
          this.$emit("follow");
        } else {
          this.$toast({
            message:'请先登录'
          })
        }
      },
      //获取作者信息
      getAuthorInfo(){
        request({
          url:api_list.api_getCustomerInfo,
          method:'get',
          params:{
            customerId:this.authorId
          }
        }).then( res => {
          // console.log(res)
          if(res.success){
            this.authorInfo = res.data.item;
            this.$store.commit('updateAuthorInfo',this.authorInfo);
          }
        })
      }
    }
  }
</script>

<style scoped>
  .authorIntroduce{
    /* position: absolute; */
    bottom: 0;
    right: 0;
    align-items: center;
  }
  .author-info{
    display: block;
    height: .4rem;
  }
  .author-avatar{
    width: .3rem;
    height: .3rem;
    border: 1px solid #ffffff;
    border-radius: 50%;
    float: left;
    background-size: cover;
    background-position: center;
  }
  .base-info{
    width: .7rem;
    display: flex;
    flex-direction: column;
    float: left;
    height: 100%;
    margin: 0 0 0 .1rem;
  }
  .author-name{
    display: flex;
    height: .2rem;
    float: left;
    font-size: .15rem;
    color: #fff;
  }
  .describe{
    width: .6rem;
    /* height: .1rem; */
    font-size: .08rem;
    font-family: "宋体";
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: rgb(199, 199, 199);
  }
  .author-sex{
    font-size: .1rem;
    margin: .05rem 0 0 .1rem;
  }
  .follow-btn{
    display: flex;
    justify-content: center;
  }
  .follows-count{
    margin-left: .05rem;
  }
</style>