<template>
  <div class="learn-module">
    <div class="learn-icon" @mouseenter="">
      <i :class="learnObj.icon" ref="learnIcon"></i>
    </div>
    <div class="module-info">
      <div class="module-name">{{learnObj.name}}</div>
      <!-- <div class="module-sign">{{learnObj.describe}}</div> -->
    </div>
  </div>
</template>

<script>
  export default{
    name: 'learnModule',
    data(){
      return {

      }
    },
    props: {
      learnObj:{
        type: Object,
        default: () => {}
      }
    },
    methods: {
      transIcon(){
        this.$refs.learnIcon.style.transform = 'translateZ(90deg)';
      }
    }
  }
</script>

<style scoped>
.learn-module{
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.learn-icon{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 100%;
}
.learn-icon i{
  font-size: .5rem;
  transition: all .5s;
}
.learn-module:hover i{
  transform: rotateY(180deg);
}
.module-info{
  max-width: 60%;
  /* height: 100%; */
}
.module-name{
  font-size: .1rem;
  font-weight: 600;
}
.module-sign{
  font-size: .1rem;
}
</style>