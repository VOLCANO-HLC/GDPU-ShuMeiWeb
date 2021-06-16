<template>
  <div class="relevantWork">
    <div class="header-title">
      相关作品
    </div>
    <div class="relevant-content">
      <div class="no-more" v-if="!hotWorksList.length">
        没有更多了~
      </div>
      <ul class="relevant-list"> 
        <li class="work-item" v-for="item in hotWorksList" :key="item.id" @click="gotoExhibition(item)">
          <div class="work-cover" :style="{backgroundImage:'url(' + item.cover + ')'}"></div>
          <div class="work-info"> 
            <h6 class="work-title">{{item.title}}</h6>
            <p class="work-author">{{item.customerName}}</p>
            <div class="meta">
              <van-icon name="fire" size=".02rem"/>{{item.hot}}
              <van-icon name="star" size=".02rem" style="margin-left: .05rem;"/>{{item.collectCount}}
            </div>
            <div class="spend-time">{{item.updateTime}}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
  export default{
    name:'relevantWork',
    data(){
      return{
        count:8,
        hotWorksList:[],
      }
    },
    props:{
      typeId:String,
      workId:String
    },
    created(){
      this.getRelevantWorks();
    },
    methods:{
      //路由跳转
      gotoExhibition(item){
        this.$emit('clickRelevant',item);
      },
      //信息过滤
      infoFilter(list){
        for(let i = 0; i<list.length; i++){
          //处理热度
          if(list[i].hot>999 && list[i].hot<10000){
            list[i].hot = (list[i].hot/1000).toFixed(1) + 'k';
          } else if(list[i].hot>=10000){
            list[i].hot = (list[i].hot/10000).toFixed(1) + 'w';
          }
          //处理收藏信息
          if(list[i].collectCount>999 && list[i].collectCount<10000){
            list[i].collectCount = (list[i].collectCount/1000).toFixed(1) + 'k';
          } else if(list[i].collectCount>=10000){
            list[i].collectCount = (list[i].collectCount/10000).toFixed(1) + 'w';
          }
          //只获取日期
          list[i].updateTime = list[i].updateTime.split(' ')[0]
          if(list[i].id === this.workId){
            list.splice(i--,1);
          }
        }
        this.hotWorksList = list;
      },
      //获取相关热门信息
      getRelevantWorks(){
        request({
          url:api_list.api_getRelevantHotWorks,
          method:'get',
          params:{
            count:this.count,
            typeId:this.typeId
          }
        }).then( res => {
          // console.log(res)
          if(res.success && res.data.items){
            this.hotWorksList = res.data.items;
            if(this.hotWorksList.length){
              this.infoFilter(this.hotWorksList);
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .relevantWork{
    position: absolute;
    top: 0;
    right: 0;
    width: 1.4rem;
    max-height: 2.5rem;
    background-color: rgb(36, 36, 36);
    overflow: hidden;
  }
  .header-title{
    width: 1.4rem;
    height: .25rem;
    font-size: .1rem;
    text-align: center;
    line-height: .25rem;
    box-shadow: 0 2px 3px rgb(0,0,0,0.3);
    background-color: rgb(51, 51, 51);
  }
  .relevant-list{
    box-sizing: border-box;
    width: 100%;
    min-height: .2rem;
    max-height: 2.75rem;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .relevant-list::after{
    content: '';
    display: block;
    clear: both;
  }
  .relevant-list::-webkit-scrollbar{
    width: .03rem;
    height: 100%;
    background-color: rgb(94, 94, 94);
  }
  .relevant-list::-webkit-scrollbar-thumb{
    border-radius: 5px;
    background-color: rgb(68, 68, 68);
  }
  .work-item{
    position: relative;
    display: flex;
    width: 100%;
    height: .5rem;
    /* border: 1px solid #fff; */
    align-items: center;
    padding: 0 .05rem;
    border-bottom: 1px solid rgb(70, 70, 70);
    cursor: pointer;
  }
  .work-cover{
    width: .4rem;
    height: .4rem;
    /* border: 1px solid #fff; */
    background-size: cover;
  }
  .work-info{
    width: .6rem;
    height: 100%;
    /* border: 1px solid #fff; */
    margin-left: .05rem;
  }
  .work-title{
    font-size: .1rem;
    margin: .05rem 0 0 0;
    color: #fff;
  }
  .work-author{
    font-size: .05rem;
    color: #fff;
  }
  .spend-time{
    position: absolute;
    font-size: .05rem;
    color: #fff;
    bottom: .02rem;
    right: .1rem;
  }
  .meta{
    position: absolute;
    display: flex;
    font-size: .05rem;
    color: #fff;
    bottom: .02rem;
  }
  .no-more{
    font-size: .1rem;
    text-align: center;
    color: rgb(0, 0, 0);
  }
</style>