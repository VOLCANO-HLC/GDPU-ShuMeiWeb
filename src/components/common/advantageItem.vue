<template>
  <div class="advantage-item" ref="advItem" @mouseenter="isShow = true" @mouseleave="isShow = false">
    <div class="mark" v-if="isShow"></div>
    <div class="advantages-content">
      <div class="icon">
        <i :class="advantObj.icon"></i>
      </div>
      <p class="advantages-name">{{advantObj.name}}</p>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'advantageItem',
    data(){
      return {
        // 划入动画
        isShow: false,
      }
    },
    props:{
      advantObj:{
        type: Object,
        default: () => {}
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  .advantage-item{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;

  }
  .advantage-item:hover{
    /* color: #fff; */
    animation: enter .1s forwards;
  }
  .mark{
    position: absolute;
    top: 0;
    background-color: black;
    width: 100%;
    height: 100%;
    animation: enterAn .5s forwards;
  }
  .advantages-content{
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    z-index: 10;
    padding: 0 .1rem;
  }
  .icon{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60%;
  }
  .icon i{
    font-size: .3rem;
  }
  .advantages-name{
    font-size: .1rem;
    text-align: center;
    font-weight: 600;
  }

  @keyframes enterAn {
    from{width: 0;}
    to{width: 100%;}
  }
  @keyframes enter {
    from{color: black;}
    to{color: #fff;}
  }
</style>