<template>
  <div>
    <slot name="ItemName"></slot>
    <div class="aSList">
      <div class="aSListItem" v-for="(item, index) in aSList" :key="index">
        <workShowCart :work="item"></workShowCart>
      </div>
    </div>
    <slot name="scroll">
      <div :style="textColor">
        <p class="load-text" v-if="loadState === 1">加载中...</p>
        <p class="load-text" v-if="loadState === 0">加载失败</p>
        <p class="load-text" v-if="loadState === 2">
          没有更多了
        </p>
      </div>
    </slot>
  </div>
</template>
  
<script>
import workShowCart from "./workShowCart";
export default {
  name: "authorspaceshowlist",
  components: {
    workShowCart,
  },
  props: {
    aSList: Array,
    loadState: Number,
  },
  computed:{
    textColor(){
      return this.$store.state.authorInfo.textColor;
    }
  }
};
</script>

<style scoped>
.aSList {
  display: flex;
  box-sizing: border-box;
  padding: .2rem .3rem;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;

}
.aSListItem {
}
.load-text {
  font-size: 0.1rem;
  font-weight: 500;
  text-align: center;
}
</style>