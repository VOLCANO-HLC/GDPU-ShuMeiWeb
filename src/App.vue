<template>
  <div id="app">
    <keep-alive :include="cached">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        cached: this.$store.state.catchArr
      }
    },
    watch:{
      $route:{
        //监听路由变化
        handler:function(to,from){
          this.cached = this.$store.state.catchArr;
        }
      }
    }
  }
</script>

<style>
  #app{
    width: 100%;
  }
</style>
