<template>
  <div class="hotSwipe" ref="hotswipe">
    <van-image-preview v-model="show" :images="imagesPreview" :showIndex="false" :closeable="true"></van-image-preview>
    <!-- 左侧图片 -->
    <div class="swip-list">
      <li class="swip-item" v-for="(item,index) in hotList" :key="item.id" :style="{backgroundImage:'url(' + item.cover + ')'}" v-if="selectIndex===index"
      @click="showPreview(item.cover)"></li>
    </div>
    <!-- 左侧图片 -->
    <!-- 右侧菜单 -->
    <div class="hot-work-menu" ref="menuList">
      <div class="menu-item" v-for="(menu,index) in hotList.length" :key="index" @mouseenter="changeSwipe(index)" @mouseleave="initInterval">
        <span class="menu-title">{{hotList[index].title}}</span>
        <span class="menu-sign"><van-icon name="manager-o" size=".1rem" color="#fff"/>{{hotList[index].customerName}}</span>
      </div>
    </div>
    <!-- 右侧菜单 -->
  </div>
</template>

<script>
  export default{
    name:'hotSwipe',
    data(){
      return{
        //轮播图高度
        carouselHeight:'',
        selectIndex:0,
        //计时器
        swipeInterval:null,
        //是否预览大图
        show:false,
        //预览大图
        imagesPreview:[]
      }
    },
    props:{
      hotList:Array
    },
    created(){
    
    },
    mounted(){
      if(this.hotList){
        this.initStyle();
        this.initInterval();
      }
    },
    methods:{
      //预览大图
      showPreview(_url){
        this.show = true;
        this.imagesPreview = [_url];
      },
      //初始化计时器
      initInterval(){
        this.swipeInterval = setInterval(() => {
          if(this.selectIndex < this.hotList.length-1){
            this.selectIndex++;
          } else {
            this.selectIndex = 0;
          }
        }, 5000);
      },
      //切换轮播图
      changeSwipe(index){
        //鼠标放上去的时候清除计时器
        clearInterval(this.swipeInterval);
        this.selectIndex = index;
      },
      //初始化样式
      initStyle(){
        let hotSwipeHeight = this.$refs.hotswipe.offsetHeight;
        this.carouselHeight = hotSwipeHeight + 'px';

        let children = this.$refs.menuList.children;
        children[0].classList.add('menu-item-active');
      }
    },
    watch:{
      //监听轮播图的图片序号变化，改变字体背景样式
      selectIndex(nowIndex, oldIndex){
        let children = this.$refs.menuList.children;
        children[nowIndex].classList.add('menu-item-active');
        if(oldIndex!==null){
          children[oldIndex].classList.remove('menu-item-active');
        }
      }
    }
  }
</script>

<style scoped>
  .hotSwipe{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .hot-work-menu{
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 2rem;
    height: 100%;
    background-color: rgba(95, 158, 160, 0.479);
    z-index: 10;
    padding: .35rem 0 0 0;
  }
  .menu-item{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 20%;
    padding: 0 .15rem;
    
    /* border: 1px solid black; */
  }
  .menu-title{
    display: block;
    font-size: .15rem;
    color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .menu-sign{
    display: flex;
    align-items: center;
    margin-top: .05rem;
    font-size: .1rem;
    color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .menu-item-active{
    background-color: rgba(19, 122, 170, 0.733);
    font-size: .15rem;
  }
  .swip-list{
    width: 100%;
    height: 100%;
  }
  .swip-item{
    width: 100%;
    height: 100%;
    /* background: url('../../assets/imgs/user_spaceImg.jpg'); */
    background-size: cover;
    background-repeat: no-repeat;
    list-style: none;
    cursor: pointer;
    animation: fadeIn .8s forwards;
  }
  @keyframes fadeIn {
    from{opacity: 50%};
    to{opacity: 100%};
  }
</style>