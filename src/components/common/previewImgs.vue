<template>
  <div class="preview-imgs" :style="{zIndex: zIndex}" ref="previeImgs" @click.stop="closePreview">
    <div class="left-arrow arrow" @click.stop="leftBtn"><</div>
    <div class="right-arrow arrow" @click.stop="rightBtn">></div>
    <ul class="imgs-list" ref="imgsList" :style="{left: leftDistance}">
      <li class="img-item" v-for="(imgUrl, index) in imgsList" :key="index" :style="{backgroundImage: 'url(' + imgUrl + ')'}"></li>
    </ul>
  </div>
</template>

<script>
export default{
  name: 'previewImgs',
  data(){
    return {
      // 轮播图距离左边的距离
      leftDistance: 0,
      // 浏览器宽度
      domWidth: 0,
      // 移动的次数
      moveNum: 0,
    }
  },
  props:{
    imgsList: {
      type: Array,
      default: []
    },
    zIndex: {
      type: Number,
      default: 500
    },
    activeKey:{ // 一开始点击的第几张图片下标
      type: Number,
      default: 0
    }
  },
  mounted(){
    this.initStyle();
  },
  methods:{
    // 点击左箭头
    leftBtn(){
      if(this.moveNum>0){
        // console.log(this.imgsList.length)
        this.moveNum--; 
      } else if(this.moveNum === 0){
        this.moveNum = this.imgsList.length-1;
      }
      this.moveImg();
    },
    // 点击右箭头
    rightBtn(){
      if(this.moveNum<this.imgsList.length-1){
        // console.log(this.imgsList.length)
        this.moveNum++; 
      } else {
        this.moveNum = 0;
      }
      this.moveImg();
    },
    // 移动图片
    moveImg(){
      // console.log(this.moveNum)
      this.$refs.imgsList.style.left = -this.domWidth * this.moveNum + 'px';
    },
    // 关闭预览
    closePreview(){
      // console.log("close")
      this.$emit('close');
    },
    // 初始化样式
    initStyle(){
      // console.log(this.$refs.previeImgs.offsetWidth)
      let prevWidth = this.$refs.previeImgs.offsetWidth;
      this.domWidth = prevWidth;
      this.$refs.imgsList.style.width = prevWidth * this.imgsList.length + 'px';
      this.moveNum = this.activeKey;
      // console.log(this.activeKey)
      this.$refs.imgsList.style.left = -this.domWidth * this.moveNum + 'px';
      // console.log(this.$refs.imgsList.style.width)
    }
  }
}
</script>

<style scoped>
  .preview-imgs{
    position: fixed;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    /* display: flex; */
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .imgs-list{
    position: absolute;
    display: flex;
    /* width: 100%; */
    height: 100%;
  }
  .img-item{
    float: left;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .arrow{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: .2rem;
    width: .3rem;
    height: .3rem;
    background-color: rgba(0, 0, 0, 0.295);
    border-radius: 50%;
    text-align: center;
    line-height: .3rem;
    cursor: pointer;
    z-index: 10;
    color: #fff;
  }
  .left-arrow{
    left: .1rem;
  }
  .right-arrow{
    right: .1rem;
  }
</style>