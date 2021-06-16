<template>
  <div class="workImgSwipe" ref="imgSwipe">
    <van-image-preview v-model="openPreview" :showIndex="false" closeable :images="previewPic">
      
    </van-image-preview>
    <ul class="imgs-list" ref="imgsList" :style="{width: listWidth + 'px'}" @mousedown="dragImgList">
      <li class="item" :style="{width: itemWidth + 'px', backgroundImage:'url(' + n.pictureUrl + ')'}"
       v-for="(n,index) in pictureList" :key='index' @click.prevent="selectImg(index)"
        @mouseenter="hoverIndex=index"  @mouseleave="hoverIndex=null">
       <div class="img-mark" v-show="hoverIndex===index">
         点击预览
       </div>
      </li>
    </ul>
    <div class="left-arrow">
      <van-icon name="arrow-left" size=".1rem" color="#fff" @click="leftClick"/>
    </div>
    <div class="right-arrow">
      <van-icon name="arrow" size=".1rem" color="#fff" @click="rightClick"/>
    </div>
  </div>
</template>
<script>
  export default {
    name:'workImgSwipe',
    data(){
      return{
        //鼠标移动哪种图片
        hoverIndex:null,
        //图片的个数
        imgsNum:0,
        //选择宽的颜色
        // selectColor:'#0862e7',
        //选择的图片序号
        selectIndex:0,
        //图片数组
        pictureList:[],
        //预览图片数组
        previewPic:[],
        //是否打开预览
        openPreview:false,
        //可视区域的宽
        swipeWidth: 0,
        //整条轮播图的总长
        listWidth: 0,
        //每个图片的宽
        itemWidth: 0,
        // 每次移动的距离
        transLength:0,
        //移动的次数
        moveNum:0,
        //最大移动次数
        maxMoveNum:0,
        //最后末尾移动的距离
        endMoveDis:0,
        //动画计时器
        anSetInterval:null
      }
    },
    props:{
      swipeIndex:Number
    },
    computed:{
    },
    created(){
      this.pictureList = this.$store.state.workDetail.workPictureInfoList;
    },
    mounted(){
      // 初始化长度值
      this.initValue();
      //初始化颜色
      // this.initColor();
      //开始滚动
      // this.autoSelect();
    },
    methods:{
      //鼠标拖动轮播图
      dragImgList($event){
      },
      //颜色框自动滚动
      autoSelect(){
        // setInterval(() => {
        //   if(this.selectIndex >= this.imgsNum-1){
        //     this.selectIndex = -1;
        //   }
        //   this.selectIndex++;
        //   this.$emit('swipeChange',this.selectIndex);
        // }, 5000);
        
      },
      // 点击图片
      selectImg(index){
        this.openPreview = true;
        this.selectIndex = index;
        this.previewPic = [this.pictureList[index].pictureUrl]
      },
      //点击展示图片左按钮
      leftClick(){
        if(this.moveNum>0){
          this.moveNum--;
          // 传入要移动的距离和当前左侧的位置
          this.moveAnimation(this.transLength,this.$refs.imgsList.offsetLeft,'left');
        }
      },
      //点击展示图片右按钮
      rightClick(){
        if(this.moveNum<this.maxMoveNum){
          this.moveNum++;
          // 传入要移动的距离和当前右侧的位置
          this.moveAnimation(this.transLength,this.$refs.imgsList.offsetLeft,'right');
        }
      },
      //图片移动,传入移动距离和现在位置
      moveAnimation(target,position,vector){
        //清除计时器，以避免用户多次按下按钮
        if(this.anSetInterval!==null){
          clearInterval(this.anSetInterval);
        }
        let list = this.$refs.imgsList;
        let tempDis = 0;
        this.anSetInterval = setInterval(() => {
          //每次移动一点
          tempDis += target/10;
          if(tempDis >= target){
            //当移动的距离等于目的距离就清除计时器不移动了
            clearInterval(this.anSetInterval);
            tempDis = target;
          }
          if(position === 0){
            list.style.left = -(position + tempDis) +'px';
          } else if(vector === 'right'){
            list.style.left = (position - tempDis) +'px';
          } else {
            list.style.left = (position + tempDis) +'px';
          }
          // console.log(this.$refs.imgsList.offsetLeft)
        }, 15);

      },
      initValue(){
        this.imgsNum = this.$refs.imgsList.children.length;
        //动态设置宽度，保证16/9的比例
        this.itemWidth = this.$refs.imgsList.offsetHeight * (16/9);
        //动态设置ul的宽度
        this.listWidth = this.$refs.imgsList.children.length * this.itemWidth;
        //计算每次点击箭头移动的距离
        this.swipeWidth = this.$refs.imgSwipe.offsetWidth;
        let distance = this.listWidth - this.swipeWidth;
        //如果差值不够移动整个list的长度的话
        if(distance>0 && distance<this.swipeWidth){
          this.transLength = distance;
          this.maxMoveNum++;
          // console.log(this.transLength)
        } else if(distance>0) {
          // console.log('总长：' +this.listWidth)
          // console.log('可视长：' +this.swipeWidth)
          // console.log('差值：' +distance)
          this.maxMoveNum = Math.floor(distance/this.swipeWidth);
          
          this.endMoveDis = distance - this.swipeWidth * this.maxMoveNum;
          // console.log(this.endMoveDis)
          this.transLength = distance/(this.maxMoveNum+=2);
          // console.log(this.maxMoveNum)
          // console.log(this.transLength)
        }
      },
      initColor(){
        // let imgsList = this.$refs.imgsList.children;
        // imgsList[0].style.borderColor = this.selectColor;
        // imgsList[1].style.borderLeft = '2px solid'+ this.selectColor;
      }
    },
    watch:{
      // //图片颜色变化
      // selectIndex(nowIndex, oldIndex){
      //   if(nowIndex>=0){
      //     let imgsList = this.$refs.imgsList.children;
      //     imgsList[oldIndex].style.borderColor = '#fff';
      //     //当最后一张切换其他张的时候，就不用清理左边了
      //     if(oldIndex < imgsList.length-1){
      //       imgsList[oldIndex+1].style.borderLeft = '2px solid #fff';
      //     }
      //     //当切换成最后一张的时候，就不用在变化左边的颜色了
      //     if(nowIndex < imgsList.length-1){
      //       imgsList[nowIndex+1].style.borderLeft = '2px solid' + this.selectColor;
      //     }
      //     imgsList[nowIndex].style.borderColor = this.selectColor;
      //   }
      // }
    }
  }
</script>

<style scoped>

  .workImgSwipe{
    width: 100%;
    height: 100%;
    position: relative;
    background-color: rgb(37, 37, 37);
    overflow: hidden;
  }
  .imgs-list{
    position: absolute;
    height: 100%;
  }
  .imgs-list .item:last-child{
    border-right: 1px solid #fff;
  }
  .item{
    position: relative;
    float: left;
    background-size: cover;
    box-sizing: border-box;
    height: 100%;
    background-color: rgb(184, 184, 184);
    border: 2px solid rgba(255, 255, 255);
    border-right: 0;
  }
  
  .left-arrow{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: .2rem;
    height: .2rem;
    background-color: rgba(0, 0, 0, 0.363);
    border-radius: .02rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .right-arrow{
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: .2rem;
    height: .2rem;
    background-color: rgba(0, 0, 0, 0.363);
    border-radius: .02rem;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .select-border{
    box-sizing: border-box;
    position: absolute;
    left: 0;
    height: 100%;
    /* border: 2px solid rgb(8, 98, 231); */
  }
  .img-mark{
    position: absolute;
    font-size: .1rem;
    color:#fff;
    width: 100%;
    height: 30%;
    background-color: rgb(0,0,0,.5);
    text-align: center;
    bottom: 0;
  }
</style>