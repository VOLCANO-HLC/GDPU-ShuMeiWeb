<template>
  <div class="extendFunctions">
    <div class="functions-btn common-css" @click="showFunctions">
      <van-icon class="extend-icon" name="apps-o" size=".2rem"/>
    </div>
    <div class="selectColor-btn common-css" title="背景颜色" ref="colorEle" v-show="isOpen">
      <el-color-picker class="color-icon"
        size="mini"
        v-model="backColor"
        show-alpha
        :predefine="backgroudColor"
        @active-change="backColorChange"
        @change="modifyColor">
      </el-color-picker>
    </div>
    <div class="textColor-btn common-css" title="字体颜色" ref="colorWord" v-show="isOpen">
      <el-color-picker class="color-icon"
        size="mini"
        v-model="wordColor"
        show-alpha
        :predefine="textColors"
        @active-change="textColorChange"
        @change="modifyColor">
      </el-color-picker>
    </div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
  export default{
    name:'extendFunctions',
    data(){
      return{
        //是否展开
        isOpen:false,
        backgroudColor: [
          'rgba(255, 255, 255, 0.7)',
        ],
        textColors: [
          'rgba(0, 0, 0, 1)',
        ]
      }
    },
    created(){
    },
    mounted(){
      setTimeout(() =>{
        this.saveColor();
      },1000)
    },
    computed:{
      backColor(){
        return this.$store.state.spaceColor;
      },
      wordColor(){
        return this.$store.state.textColor;
      }
    },
    methods:{
      //保存用户已经设置的颜色
      saveColor(){
        // console.log(this.$store.state.spaceColor)
        // console.log(this.$store.state.textColor)
        this.backgroudColor.push(this.$store.state.spaceColor);
        this.textColors.push(this.$store.state.textColor);
      },
      //提交修改颜色信息
      modifyColor(){
        request({
          url:api_list.api_modifyThemeColor,
          method:'put',
          params:{
            color:this.$store.state.spaceColor,
            textColor:this.$store.state.textColor
          }
        }).then( res => {
          // console.log(res)
        })
      },
      //背景颜色改变
      backColorChange(value){
        this.$store.commit('updateSpaceColor', value);
        this.backgroudColor[this.backgroudColor.length] = value;
      },
      //字体颜色改变
      textColorChange(value){
        this.$store.commit('updateSpaceTextColor', value);
        this.textColors[this.textColors.length] = value;
      },
      //显示动画
      showFunctions(){    
        if(this.isOpen === true){
          this.modifyColor();
          this.$refs.colorEle.classList.remove('bgAnOpen');
          this.$refs.colorEle.classList.add('bgAnClose');
          this.$refs.colorEle.addEventListener('webkitAnimationEnd',()=>{
            this.isOpen = false;
          });

          this.$refs.colorWord.classList.remove('textAnOpen');
          this.$refs.colorWord.classList.add('textAnClose');
          this.$refs.colorWord.addEventListener('webkitAnimationEnd',()=>{
            this.isOpen = false;
          });
        } else {
          this.isOpen = true;
          this.$refs.colorEle.classList.remove('bgAnClose');
          this.$refs.colorEle.classList.add('bgAnOpen');
          this.$refs.colorEle.addEventListener('webkitAnimationEnd',()=>{
            this.isOpen = true;
          });

          this.$refs.colorWord.classList.remove('textAnClose');
          this.$refs.colorWord.classList.add('textAnOpen');
          this.$refs.colorWord.addEventListener('webkitAnimationEnd',()=>{
            this.isOpen = true;
          });
        }
      }
    },
  }
</script>
<style scoped>
  .common-css{
    position: absolute;
    display: flex;
    width: .3rem;
    height: .3rem;
    background-color: #fff;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
  }
  .functions-btn{
    transform-origin: center;
    z-index: 10;
  }
  .functions-btn:hover{
    transform: scale(1.1,1.1);
  }
  .selectColor-btn,.textColor-btn{
    align-items: center;
    justify-content: center;
    z-index: 3;
  }
  .bgAnOpen{
    animation: bgColorMove .3s forwards;
  }
  .bgAnClose{
    animation: bgColorMoveBack .3s forwards;
  }
  .textAnOpen{
    animation: textColorMove .3s forwards;
  }
  .textAnClose{
    animation: textColorMoveBack .3s forwards;
  }
  @keyframes bgColorMove {
    from{top: 0;}
    to{top: -.5rem;}
  }
  @keyframes bgColorMoveBack {
    from{top: -.5rem;}
    to{top: 0;}
  }
  @keyframes textColorMove {
    from{left: 0;}
    to{left: -.5rem;}
  }
  @keyframes textColorMoveBack {
    from{left: -.5rem;}
    to{left: 0;}
  }
</style>