<template>
  <div class="searchBox">
    <i class="el-icon-search"></i>
    <input class="input-bar" type="text" placeholder="请输入" v-model:value="inputVal"
    @keyup.enter="search">
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import qs from 'qs'
  export default{
    name:'searchBox',
    data(){
      return{
        inputVal:''
      }
    },
    methods:{
      search(){
        this.$emit('search',this.inputVal);
      }
    }
  }
</script>

<style scoped>
  .searchBox{
    display: flex;
    width: 1rem;
    height: .1rem;
    border: 1.5px solid rgb(0, 0, 0);
    border-radius: .2rem;
    padding: 0 .05rem;
    margin: 0 auto;
    align-items: center;
    background: none;
    overflow: hidden;
  }
  .searchBox i{
    font-size: .05rem;
    color: rgb(0, 0, 0);
    border-right: 1px solid rgb(0, 0, 0);
    padding-right: 10px;
  }
  .input-bar{
    width: 100%;
    height: 100%;
    color: #000;
    border: 0;
    margin-left: .05rem;
    font-size: .05rem;
  }
</style>