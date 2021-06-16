<template>
  <div
    class="workShowCart"
    :class="{ 'workShowCart-hover': scale }"
    @click="gotoExhibiton"
  >
    <slot></slot>
    <div
      class="cover-img"
      :style="{ backgroundImage: 'url(' + workObj.cover + ')' }"
    ></div>
    <div class="work-info">
      <div class="work-title" :title="workObj.title">{{ workObj.title }}</div>
      <div class="type">
        <span class="work-type">{{ workObj.typeName }}</span>
      </div>
      <div class="meta-info">
        <van-icon name="fire" size=".1rem" />{{ hot }}
        <van-icon name="star" size=".1rem" style="margin-left: 0.1rem" />{{
          collectCount
        }}
      </div>
      <div class="author-name">
        <van-icon name="manager" size=".1rem" />{{ workObj.customerName }}
      </div>
      <div class="time-info">
        <van-icon name="underway" size=".05rem" />
        {{ updateTime }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "workShowCart",
  data() {
    return {
      workObj: {},
    };
  },
  computed: {
    updateTime() {
      return this.workObj.updateTime.split(" ")[0];
    },
    hot() {
      if (this.workObj.hot > 999 && this.workObj.hot < 10000) {
        return (this.workObj.hot / 1000).toFixed(1) + "k";
      } else if (this.workObj.hot >= 10000) {
        return (this.workObj.hot / 10000).toFixed(1) + "w";
      } else {
        return this.workObj.hot;
      }
    },
    collectCount() {
      if (
        this.workObj.collectCount > 999 &&
        this.workObj.collectCount < 10000
      ) {
        return (this.workObj.collectCount / 1000).toFixed(1) + "k";
      } else if (this.workObj.collectCount >= 10000) {
        return (this.workObj.collectCount / 10000).toFixed(1) + "w";
      } else {
        return this.workObj.collectCount;
      }
    },
  },
  props: {
    work: Object,
    //是否样式缩放
    scale: {
      type: Boolean,
      default: true,
    },
    //是否禁用跳转路由
    stopLink: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.workObj = this.work;
  },
  methods: {
    //跳转作品详情
    gotoExhibiton() {
      if (this.stopLink) {
        let routeUrl = this.$router.resolve({
          path: "/WorkExhibition",
          query: this.work,
        });
        window.open(routeUrl.href, "_blank");
      }
    },
  },
};
</script>

<style scoped>
.workShowCart {
  float: left;
  width: 1.082rem;
  height: 1.5rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.322);
  background-color: rgba(255, 255, 255, 0.692);
  color: #000;
  margin: 0 0 0.1rem 0;
  position: relative;
}
.workShowCart-hover:hover {
  transform: scale(1.1, 1.1);
}
.work-info {
  padding: 5px;
  position: relative;
}
.cover-img {
  display: block;
  width: 100%;
  height: 50%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
  user-select: none;
}
.work-title {
  width: 100%;
  font-size: 0.1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 600;
  white-space: nowrap;
  margin-bottom: 0.05rem;
  user-select: none;
}
.type {
  display: flex;
}
.work-type {
  display: inline-block;
  font-size: 0.05rem;
  padding: 0.02rem;
  border: 1px solid black;
  text-align: center;
  line-height: 0.05rem;
  user-select: none;
}
.meta-info {
  display: flex;
  font-size: 0.05rem;
  align-items: center;
  margin-top: 0.1rem;
}
.time-info {
  position: absolute;
  display: flex;
  font-size: 0.05rem;
  align-items: center;
  bottom: 5px;
  right: 5px;
  user-select: none;
}
.author-name {
  font-size: 0.08rem;
  margin-top: 0.1rem;
  user-select: none;
}
</style>