<!-- 简单的对话框 -->
<template>
  <div class="dialogSimple">
    <div class="msgMark">
      <div class="msgBar">
        <div class="msgTitle"><i class="el-icon-close" @click="close"></i></div>
        <div class="msgContent">
          {{message}}
        </div>
        <div class="msgButton">
          <button @click="close">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:'dialogSimple',
    data(){
      return{
      }
    },
    props:{
      message:{
        type: String,
        required: true
      }
    },
    methods:{
      //关闭对话框
      close(){
        this.$emit("closeDialog");
      }
    }
  }
</script>

<style scoped>
 .msgMark{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(0,0,0,.5);
  z-index: 10;
  box-sizing: border-box;
}
.msgBar{
  width: 3rem;
  height: 2rem;
  background-color: rgb(255,255,255,.8);
  margin: 1rem auto;
  border-radius: .2rem;
}
.msgTitle{
  height: 10%;
}
.msgTitle i{
  display: block;
  font-size: .15rem;
  float: right;
  margin: .05rem .05rem 0 0;
  cursor: pointer;
}
.msgContent{
  width: 100%;
  height: 70%;
  line-height: 1.2rem;
  text-align: center;
  font-size: .25rem;
}
.msgButton{
  height: 10%;
}
.msgButton button{
  display: block;
  width: 60%;
  height: 100%;
  margin: 0 auto;
  background-color: #31363b;
  color: #fff;
  font-size: .1rem;
  border-radius: .1rem;
  outline: none;
  cursor: pointer;
}
</style>