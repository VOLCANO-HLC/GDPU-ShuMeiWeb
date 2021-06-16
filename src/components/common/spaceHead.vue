<template>
  <div class="spaceHead">
    <div class="h-inner">
      <div class="h-user">
        
        <div class="h-avatar" :style="{backgroundImage: 'url(' + avatarUrl + ')'}">
        </div>
        <div class="h-base-info" >
          <div class="h-name">
            <p :style="{color:textColor}">{{username}}</p>
            <i class="el-icon-male" v-if="!sex"></i>
            <i class="el-icon-female" v-if="sex" style="color: #ff8499;"></i>
          </div>
          <div class="h-sign">
            <p :style="{color:textColor}">{{userSign}}</p>
            
          </div>
        </div>
        <div class="modify-info" @click="modifyBtn" v-if="">
          编辑信息
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    name:'spaceHead',
    data(){
      return{
        
      }
    },
    props:{
      username:String,
      userSign:String,
      avatarUrl:String,
      sex:Number
    },
    computed:{
      textColor(){
        return this.$store.state.textColor;
      }
    },
    methods:{
      modifyBtn(){
        this.$emit('modifyInfo');
      },
    }
  }
</script>

<style scoped>
.h-inner{
    position: relative;
    width: 100%;
    height: 1.2rem;
    /* background-image: require(url('./assets/imgs/login_backImg.jpg')); */
    background-repeat: no-repeat;
    margin-bottom: .1rem;
  }
  .h-user{
    position: absolute;
    display: flex;
    width: 100%;
    height: .7rem;
    bottom: 0;
    align-items: center;
  }
  .h-avatar{
    width: .5rem;
    height: .5rem;
    background: #fff;
    border-radius: 50%;
    margin-left: .1rem;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    /* background-repeat: no-repeat;
    background-position: center;
    background-size: 200%; */
  }
  .h-base-info{
    position: relative;
    width: 2rem;
    height: 60%;
    margin-left: .2rem;
  }
  .h-name{
    position: absolute;
    top: 0;
    display: flex;
    width: 100%;
    align-items: center;
  }
  .h-name p{
    float: left;
    font-size: .15rem;
    margin: 0;
    padding: 0;
    height: .2rem;
    line-height: .2rem;
    color: #fff;
  }
  .h-sign{
    position: absolute;
    display: flex;
    width: 100%;
    bottom: 0;
    align-items: center;
  }
  .h-name i{
    font-size: .1rem;
    color: #3ce2ff;
    cursor: pointer;
    margin-left: .2rem;
  }
  .h-sign p{
    width: 60%;
    font-size: .08rem;
    font-weight: 500;
    font-family: "宋体";
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
    /* white-space: nowrap; */
  }
  .modify-info{
    position: absolute;
    right: .5rem;
    width: .4rem;
    height: .15rem;
    border: 2px solid #fff;
    border-radius: .03rem;
    background: rgb(255,255,255,.3);
    font-size: .08rem;
    text-align: center;
    line-height: .15rem;
    color: #fff;
  }
  .modify-info:hover{
    background: rgb(240, 240, 240,.5);
    /* color:black; */
    cursor:pointer;
  }
</style>