<template>
  <div class="collectForm">
    <div class="collect-title">添加收藏</div>
    <div class="collect-group" ref="collectGroup">
      <div class="option-item" v-if="isInput">
        <el-input
          placeholder="请输入组名"
          v-model="inputVal"
          maxlength="10"
          show-word-limit
          @keyup.enter.native="confirmAdd"
          clearable>
        </el-input>
        <van-checkbox class="open-btn" v-model="isPublic" shape="square" size=".1rem" v-if="isInput">公开</van-checkbox>
      </div>
      <van-checkbox-group v-model="checkeds" :max="limit">
        <div class="option-item" v-for="item in groups" :key="item.id">
          <van-checkbox :name="item.id" shape="square">{{item.name}}</van-checkbox>
        </div>
      </van-checkbox-group>
    </div>
    <!-- 新建按钮 -->
    <div class="new-group" v-show="!isMove">
      <van-button class="new-button" icon="plus" type="primary" size="mini" @click="isInput = true">新建分组</van-button>
    </div>
    <!-- 新建按钮 -->
    <div class="collect-buttons">
      <el-button type="info" @click="confirmAdd">确认</el-button>
      <el-button @click="closeCollect">取消</el-button>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
  export default{
    name:'collectForm',
    data(){
      return{
        checkeds:[],
        groups:[],
        isInput:false,
        isPublic:false,
        inputVal:'',
        limit:0,
        //区分移动或添加分组
        isMove:false
      }
    },
    props:{
      workIdList:Array
    },
    created(){
      this.getGroups();
      this.init();
    },
    methods:{
      //确认新建分组
      confirCreate(){
        let publicStatus = 0;
        if(this.isPublic){
          publicStatus = 1;
        }
        if(this.inputVal !== ''){
          request({
            url:api_list.api_createCollectGroup,
            method:'post',
            data:{
              name:this.inputVal,
              publicStatus:publicStatus
            }
          }).then(res => {
            console.log(res)
            if(res.success){
              this.getGroups();
            }
            this.isInput = false;
          });
        } else {
          this.isInput = false;
        }
      },
      //确认添加到分组
      confirmAdd(){
        //处理新建分组
        if(this.isInput){
          this.confirCreate();
        } else if(this.isMove){  //移动分组
          if(this.workIdList.length === 0){
            this.$toast({
              message:'请选择作品'
            })
            return;
          }
          const loading = this.$loading({
            lock: true,
            text: 'move...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          if(this.checkeds.length){

            request({
              url:api_list.api_moveCollect,
              method:'put',
              data:{
                workIdList: this.workIdList,
                collectGroupId: this.checkeds[0]
              }
            }).then( res => {
              loading.close();
              this.$emit('collectSuccess');
              this.closeCollect();
            }).catch(err => {
              loading.close();
              this.closeCollect();
              this.$toast({
                meessage:'操作失败'
              });
            })
          } else {
            loading.close();
            this.$toast({
              message:'请选择分组'
            })
          }
        } else {
          //处理收藏
          this.closeCollect();
          if(this.checkeds.length){
            let collectGroupIdList = this.checkeds.splice(0,this.checkeds.length);
            request({
              url:api_list.api_addCollect,
              method:'post',
              data:{
                workId:this.$store.state.workDetail.id,
                collectGroupIdList:collectGroupIdList
              }
            }).then(res => {
              // console.log(res)
              loading.close();
              if(res.success){
                this.closeCollect();
                //收藏数加1
                this.$emit('collectSuccess');
              }
            }).catch( err => {
              loading.close();
              if(err){
                this.closeCollect();
                this.$toast({
                  meessage:'添加失败'
                });
              }
            })
          }
        }
      },
      //关闭收藏面板
      closeCollect(){
        //如果处于新建分组状态，就关闭新建分组，否则就关闭收藏面板
        if(this.isInput){
          this.isInput = false;
        } else {
          this.$emit('close');
        }
      },
      // 初始化参数
      init(){
        if(this.workIdList){
          this.isMove = true;
          this.limit = 1;
        }
      },
      //获取用户分组
      getGroups(){
        request({
          url:api_list.api_getCollectGroups,
          method:'get'
        }).then( res => {
          if(res.success){
            this.groups = res.data.items;
          }
        })
      }
    },
    watch:{
      // 新建分组时，滚轮滚到顶
      isInput(nowVal,oldVal){
        if(nowVal){
          this.$refs.collectGroup.scrollTop = 0
        }
      }
    }
  }
</script>

<style scoped>
  .collectForm{
    width: 3rem;
    /* height: 2.1rem; */
    padding: .1rem 0;
    background-color: #fff;
    border-radius: .1rem;
    margin: 1.5rem auto;
  }
  .collect-title{
    font-size: .15rem;
    text-align: center;
    padding: 0 0 .1rem 0;
  }
  .collect-group{
    width: 100%;
    height: 1.3rem;
    overflow-x: hidden;
    overflow-y: auto;
    /* border: 1px solid black; */
  }
  .option-item{
    font-size: .1rem;
    padding: .1rem;
    border-top: 1px solid #eee;
    cursor: pointer;
  }
  .option-item:last-of-type{
    border-bottom: 1px solid #eee;
  }
  .new-group{
    font-size: .05rem;
    padding: 0 .1rem;
    margin-bottom: .1rem; 
  }
  .new-button{
    background-color: #fff;
    border: 1px solid #ddd;
    color: black;
  }
  .collect-buttons{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .open-btn{
    font-size: .05rem;
    margin-top: .02rem;
  }
</style>