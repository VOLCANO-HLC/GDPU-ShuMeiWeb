<template>
  <div class="userStatic">
    <div class="u-statistics clreafix" :style="{backgroundColor:backgroundColor,color:textColor}">
      <a herf="javascript:;">
        <p :style="{borderColor:textColor}">粉丝</p>
        <span>{{fansCount}}</span>
      </a>
      <a herf="javascript:;">
        <p :style="{borderColor:textColor}">关注</p>
        <span>{{followsCount}}</span>
      </a>
      <a herf="javascript:;">
        <p style="border-right: 0">作品</p>
        <span>{{worksCount}}</span>
      </a>
    </div>
  </div>
</template>

<script>
  export default{
    name:'userStatic',
    data(){
      return{
      }
    },
    props:{
      fansCount:Number,
      followsCount:Number,
      worksCount:Number
    },
    computed:{
      backgroundColor(){
        return this.$store.state.spaceColor;
      },
      textColor(){
        return this.$store.state.textColor;
      }
    },
    mounted(){
      
    },
    methods:{

    },
  }
</script>

<style scoped>
.u-statistics{
    box-sizing: border-box;
    width: 100%;
    border-radius: .03rem;
    box-shadow: 0 0 .03rem rgb(0,0,0,.1);
    padding: .05rem;
    margin-bottom: .1rem;
    overflow: hidden;
    /* background: rgb(255,255,255,.8); */
  }
  .u-statistics a{
    display: block;
    float: left;
    width: 33%;
  }
  .u-statistics p{
    text-align: center;
    font-size: .1rem;
    margin-top: 0;
    margin-bottom: .05rem;
    border-right: 1px solid #666;
    -webkit-user-select:none;
  }
  .u-statistics span{
    display: block;
    font-size: .1rem;
    text-align: center;
    -webkit-user-select:none;
  }
  .clreafix::after{
    content: '';
    display: block;
    clear: both;
  }
</style>