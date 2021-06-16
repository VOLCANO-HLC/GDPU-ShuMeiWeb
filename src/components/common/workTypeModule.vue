<template>
  <div class="work-type-module" ref="typeModule" @mouseenter="">
    <div class="work-type-icon" ref="typeIcon" @click="clickIcon">
      <i :class="workTypeObj.icon"></i>
    </div>
    <div class="work-type-info" ref="workInfo">
      <div class="work-type-name">{{workTypeObj.name}}</div>
      <div class="work-type-sign">{{workTypeObj.describe}}</div>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'workTypeModule',
    data(){
      return {
        
      }
    },
    props:{
      workTypeObj:{
        type: Object,
        default: () => {}
      }
    },
    created(){
    },
    mounted(){
      this.initStyle();
    },
    methods: {
      clickIcon(){
        this.$emit('click');
      },
      initStyle(){
        let _width = this.$refs.typeModule.offsetWidth;
        let iconHeight = this.$refs.typeIcon.offsetHeight;
        this.$refs.typeIcon.style.width = iconHeight + 'px';
        this.$refs.workInfo.style.width = _width - this.$refs.typeIcon.offsetWidth + 'px';
      }
    }
  }
</script>

<style scoped>
.work-type-module{
  display: flex;
  width: 100%;
  height: 100%;
}
.work-type-icon{
  height: 100%;
  border: 1px solid #fff;
  margin-right: .1rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.work-type-icon i{
  font-size: .4rem;
  transition: all .5s;
}
.work-type-icon:hover i{
  transform: rotateZ(360deg);
}  
.work-type-name{
  font-size: .2rem;
  color: #fff;
  width: 100%;
  border-bottom: 1px dashed #fff;
  padding: .05rem 0;
}
.work-type-sign{
  font-size: .1rem;
  color: #fff;
  padding: .05rem 0;
}

@keyframes spreadAn {
  from{background-color: none;}
  to{background-color: rgb(255, 255, 255);}
}
</style>