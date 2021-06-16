<template>
  <div class="fansCart" :style="{backgroundColor:backgroundColor}">
    <div class="cart-content">
      <div class="avatar" :style="{backgroundImage:'url(' + avatar + ')'}" @click="onClick"></div>
      <div class="fansInfo">
        <h4>{{name}}</h4>
        <h6>{{sign}}</h6>
      </div>
      <div class="operaBtn">
        <el-button type="info" disabled="true">发消息</el-button>
        <el-button type="info" plain @click="deletBtn" v-if="showDel">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:'fansCart',
    data(){
      return{

      }
    },
    computed:{
      backgroundColor(){
        return this.$store.state.spaceColor
      }
    },
    methods:{
      onClick(){
        this.$emit('clickAvatar');
      },
      deletBtn(){
        this.$emit('delSelf');
      }
    },
    props:{
      name:String,
      sign:String,
      avatar:String,
      showDel:Boolean
    }
  }
</script>

<style scoped>
  h4,h6{
    margin: 0;
    padding: 0;
  }
  .fansCart{
    position: relative;
    width: 98%;
    height: 1rem;
    background: rgb(255,255,255,.7);
    border-radius: .1rem;
    border: 2px solid #fff;
    overflow: hidden;
    margin-bottom: .03rem;
  }
  .cart-content{
    height: 100%;
    display: flex;
    align-items: center;
  }
  .avatar{
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    /* border: 1px solid black; */
    margin-left: .2rem;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .fansInfo{
    width: 60%;
    margin-left: .2rem;
  }
  .fansInfo h4{
    font-size: .15rem;
    margin-bottom: .15rem;
    /* height: .3rem; */
    /* line-height: .3rem; */
  }
  .fansInfo h6{
    font-size: .1rem;
    font-weight: 500;
    font-family: "宋体";
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
  .operaBtn{
    position: absolute;
    right: .2rem;
    bottom: .05rem;
    margin-left: .1rem;
    margin-bottom: .1rem;
    height: 100%;
  }
</style>