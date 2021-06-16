<template>
  <div class="leftSider">
    <ul class="sider-list">
      <li class="sider-item" ref="siderItem" v-for="(name,index) in siderNames" :key="index"
      @mouseenter="hoverKey = index" @mouseleave="hoverKey = null" @click="activeIndex=index" @dblclick="onDBClick(index)">
        <span class="bage" v-show="bages[index]">{{bages[index]}}</span>
        <p class="sider-title">{{name}}</p>
        <i class="el-icon-close" v-show="hoverKey === index && closeBtn" @click.stop="removeGroup(index)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name:'leftSider',
    data(){
      return{
        activeIndex:0,
        hoverKey:null,
      }
    },
    props:{
      siderNames:{
        type: Array,
        default: () => []
      },
      activeKey:Number,
      closeBtn:{
        type: Boolean,
        default: true
      },
      bages: {
        type: Array,
        default: () => []
      }
    },
    mounted(){
      //初始化样式
      this.initStyle();
    },
    methods:{
      //双击事件
      onDBClick(index){
        this.$emit('dbclick',index);
      },
      //删除分组
      removeGroup(index){
        this.$emit('removeGroup',index)
      },
      initStyle(){
        this.$refs.siderItem[this.activeIndex].classList.add('sider-item-active');
      }
    },
    watch:{
      //监听选项的下标变化
      activeIndex(nowIndex, oldIndex){
        this.$emit('change',nowIndex);
        this.$refs.siderItem[nowIndex].classList.add('sider-item-active');
        this.$refs.siderItem[oldIndex].classList.remove('sider-item-active');
      },
      //响应父组件的变化
      activeKey(){
        this.activeIndex = this.activeKey;
      }
    }
  }
</script>

<style>
  .leftSider{
    width: 100%;
    user-select: none;
  }
  .sider-item{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: .1rem .06rem;
    cursor: pointer;
  }
  .sider-title{
    font-size: .1rem;
    margin: 0;
    text-align: center;
    line-height: .1rem;
  }
  .sider-item-active::before{
    content: '';
    position: absolute;
    width: .02rem;
    height: .2rem;
    background-color: rgb(67, 134, 235);
    left: .01rem;
    top: 50%;
    transform: translateY(-50%);
  }
  .sider-item i{
    height: 100%;
    font-size: .1rem;
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    background-image: linear-gradient(to right, rgb(255,255,255,0),rgba(255, 255, 255, 0.452));
    top: 50%;
    transform: translateY(-50%);
  }
  .bage{
    display: block;
    position: absolute;
    font-size: 10px;
    width: 15px;
    height: 15px;
    background-color: red;
    text-align: center;
    line-height: 15px;
    border-radius: 50%;
    right: .05rem;
    top: 0.05rem;
  }
</style>