<template>
  <div class="tabsLeft">
    <div class="itemList" ref="itemCollection" :style="{backgroundColor:backgroundColor}">
      <router-link :to="n.router" class="item" :class="[{'item-active':seleInx===index}]" v-for="(n,index) in tabsItemList" :key="index" @click.native="seleInx=index">
        <span :style="{color:textColor}">{{n.name}}</span>
      </router-link>
    </div>
  </div>
</template>

<script>

  export default{
    name:'tabsLeft',
    data(){
      return{
        seleInx:null,
      }
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
      this.resetStyle();
    },
    props:{
      tabsItemList:Array
    },
    //点击
    methods:{
      //页面刷新时，监听当前路由，并重置样式
      resetStyle(){
        switch(this.$route.path){
          case this.tabsItemList[0].router:
            this.seleInx = 0;
            break;
          case this.tabsItemList[1].router:
            this.seleInx = 1;
            break;
          case this.tabsItemList[2].router:
            this.seleInx = 2;
            break;
          case this.tabsItemList[3].router:
            this.seleInx = 3;
            break;
          case this.tabsItemList[4].router:
            this.seleInx = 4;
            break;
          case this.tabsItemList[5].router:
            this.seleInx = 5;
            break;
        }
      }
    },
    watch:{
    }
  }
</script>

<style scoped>
  li{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .tabsLeft{
    width: 100%;
    border-radius: .05rem;
    box-shadow: 0 0 .03rem rgb(0,0,0,.1);
    overflow:hidden;

  }
  .item{
    display: block;
    width: 100%;
    height: .3rem;
    cursor: pointer;
    color: #000;
  }
  .item span{
    display: block;
    font-size: .1rem;
    text-align: center;
    line-height: .3rem;
    -webkit-user-select:none;
  }
  .item:hover{
    background: rgba(238, 238, 238, 0.301);
    color: rgb(0, 0, 0);
  }

  .item-active{
    background: rgb(62, 171, 221);
    color: #fff;
  }
</style>