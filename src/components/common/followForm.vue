<template>
  <div class="followForm">
    <div class="follow-title">添加关注</div>
    <div class="follow-group" ref="followGroup">
      <div class="option-item" v-if="isInput">
        <el-input
          placeholder="请输入组名"
          v-model="inputVal"
          maxlength="10"
          show-word-limit
          clearable>
        </el-input>
      </div>
      <van-radio-group v-model="checkeds">
        <div class="option-item" v-for="item in groups" :key="item.id">
          <van-radio :name="item.id" shape="square">{{item.groupName}}</van-radio>
        </div>
      </van-radio-group>
    </div>
    <div class="new-group">
      <van-button class="new-button" icon="plus" type="primary" size="mini" @click="isInput = true">新建分组</van-button>
      
    </div>
    <div class="follow-buttons">
      <el-button type="info" @click="confirmAdd">确认</el-button>
      <el-button @click="closeFollow">取消</el-button>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
  export default{
    name:'followForm',
    data(){
      return{
        checkeds:'',
        groups:[],
        isInput:false,
        inputVal:''
      }
    },
    created(){
      this.getGroups();
    },
    methods:{
      //确认新建分组
      confirCreate(){
        //如果组名不为空
        if(this.inputVal !== ''){
          request({
            url:api_list.api_createFollowGroup,
            method:'post',
            data:{
              groupName:this.inputVal,
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
      //确认添加关注
      confirmAdd(){
        //处理新建分组
        if(this.isInput){
          this.confirCreate();
        } else {
          //处理关注
          if(this.checkeds!==''){
            // console.log(this.checkeds)
            // console.log(this.$store.state.workDetail.customerId)
            request({
              url:api_list.api_followCustomer,
              method:'put',
              params:{
                customerId:this.$store.state.workDetail.customerId,
                followGroupId:this.checkeds
              }
            }).then(res => {
              if(res.success){
                //关注数加1
                this.$emit('followSuccess');
                this.closeFollow();
              }
            }).catch( err => {
              if(err){
                this.$toast({
                  meessage:'关注失败'
                });
              }
            })
          }
        }
      },
      //关闭关注面板
      closeFollow(){
        //如果处于新建分组状态，就关闭新建分组，否则就关闭关注面板
        if(this.isInput){
          this.isInput = false;
        } else {
          this.checkeds = '';
          this.$emit('close');
        }
      },
      //获取关注分组
      getGroups(){
        request({
          url:api_list.api_getFollowGroups,
          method:'get'
        }).then( res => {
          if(res.success){
            this.groups = res.data.items;
          }
        })
      }
    },
    watch:{
      //新建分组时，将滚轮滚到最顶
      isInput(nowVal,oldVal){
        if(nowVal){
          this.$refs.followGroup.scrollTop = 0
        }
      }
    }
  }
</script>

<style scoped>
  .followForm{
    width: 3rem;
    /* height: 2.1rem; */
    padding: .1rem 0;
    background-color: #fff;
    border-radius: .1rem;
    margin: 1.5rem auto;
  }
  .follow-title{
    font-size: .15rem;
    text-align: center;
    padding: 0 0 .1rem 0;
  }
  .follow-group{
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
  .follow-buttons{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .open-btn{
    font-size: .05rem;
    margin-top: .02rem;
  }
</style>