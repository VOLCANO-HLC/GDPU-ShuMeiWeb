<template>
  <div
    class="authorSpace"
    :style="{ backgroundImage: 'url(' + authorObj.background + ')' }"
  >
    <commonHeader :isFixed="true" v-if="isLoad"></commonHeader>
    <!-- 作者头部 -->
    <div class="author-head" :style="{ backgroundColor: backgroundColor }">
      <div class="author-info">
        <div
          class="author-avatar"
          :style="{ backgroundImage: 'url(' + authorObj.avatar + ')' }"
        ></div>
        <div class="author-base">
          <div class="author-name" :style="{ color: textColor }">
            {{ authorObj.name }}
            <i
              class="el-icon-male"
              v-if="!authorObj.sex"
              style="color: #3ce2ff"
            ></i>
            <i
              class="el-icon-female"
              v-if="authorObj.sex"
              style="color: #ff8499"
            ></i>
          </div>
          <div
            class="author-sign"
            :title="authorObj.sign"
            :style="{ color: textColor }"
          >
            {{ authorObj.sign }}
          </div>
        </div>
      </div>

      <div class="author-meta" :style="{ color: textColor }">
        <div class="author-count">
          <span class="meta-title">粉丝</span>
          <span class="meta-count">{{ fansCount }}</span>
        </div>
        <div class="author-count">
          <span class="meta-title">关注</span>
          <span class="meta-count">{{ followsCount }}</span>
        </div>
        <div
          class="author-count"
          @click="titleClick(1)"
          :class="{ titleActive: titleName == 1 }"
        >
          <span class="meta-title">作品</span>
          <span class="meta-count">{{ worksCount }}</span>
        </div>
        <div
          class="author-count"
          style="border-right: 0"
          @click="titleClick(2)"
          :class="{ titleActive: titleName == 2 }"
        >
          <span class="meta-title">收藏</span>
          <span class="meta-count">{{collectCount}}</span>
        </div>
      </div>
    </div>
    <!-- 作者头部 -->
    <div
      class="spaceWrap"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="20"
      infinite-scroll-immediate-check="true"
    >
      <!-- 主体内容 -->
      <!-- 作品内容 -->
      <div
        class="worksList"
        v-show="isShow"
        :style="{ backgroundColor: backgroundColor }"
      >
        <authorspaceshowlist
          :aSList="list"
          :loadState="loadState"
        ></authorspaceshowlist>
      </div>
      <!-- 作品内容 -->

      <!-- 收藏内容 -->
      <div class="collectLists" v-show="!isShow">
        <div class="collectList">
          <div
            v-for="(iitem, index) in collactLists"
            :key="index"
            class="collect-list"
            :style="{ backgroundColor: backgroundColor }"
          >
            <authorspaceshowlist :aSList="iitem.rows" :loadState="loadState">
              <div class="collect-title" slot="ItemName">
                <h3><span>———————————————— </span>{{ collectIdObject[index].name }}<span> ——————————————</span></h3>
                <button
                  class="collectList-btn"
                  @click="collectListBtnClick(index)"
                  ref="collectBtn"
                  :disabled="dis[index]"
                  :style="{ backgroundColor: backgroundColor, color: textColor }"
                ><i class="iconfont icon-shuaxin"></i></button>
              </div>
              <div slot="scroll" class="collect-bottom">
                <p v-if="dis[index]">没有更多了</p>
              </div>
            </authorspaceshowlist>
          </div>
        </div>
      </div>
      <!-- 收藏内容 -->

      <!-- 主体内容 -->
    </div>
  </div>
</template>

<script>
import commonHeader from "./common/CommonHeader";
import workShowCart from "./common/workShowCart";
import authorspaceshowlist from "./common/authorSpaceShowList";

import { request } from "@/network/request";
import api_list from "@/network/api_list";

export default {
  name: "authorSpace",
  data() {
    return {
      // 收藏列表按钮对象的disabled属性数组
      dis: [],
      // 收藏组的id
      collectId: null,
      // 作品的列表
      list: [],
      // 加载情况的文字的显示依据
      loadState: null,
      // 作品 / 收藏 显示
      isShow: true,
      // 作品页数
      worksPages: 1,
      // 各个收藏分组的页数
      collectPages: [],
      // 作品加载的次数
      scrollNum: 1,
      //各个收藏分组的集合
      collactLists: [],
      // title点击栏的判断数
      titleName: 1,

      collectName: null,
      collectIdObject: null,
      busy: false,
      totals: 0,

      isLoad: true,
      authorObj: {},
      //作者作品列表
      authorWorksList: [],
      //作者收藏列表
      authorCollectsList: [],
    };
  },
  props: {
    authorId: String,
  },
  mounted() {
    this.getAuthorCollectId();
  },
  created() {
    this.getAuthorInfo();
    this.getUserInfo();
    this.getAuthorWorksList()
      .then((res) => {
        this.list = res.data.rows;
      })
      .catch((err) => {
        this.loadState = 0;
      });
  },
  computed: {
    backgroundColor() {
      return this.$store.state.authorInfo.color;
    },
    textColor() {
      return this.$store.state.authorInfo.textColor;
    },
    fansCount() {
      if (this.authorObj.fansCount > 999 && this.authorObj.fansCount < 10000) {
        return this.authorObj.fansCount / 1000 + "k";
      } else if (this.authorObj.fansCount > 9999) {
        return this.authorObj.fansCount / 10000 + "w";
      } else {
        return this.authorObj.fansCount;
      }
    },
    followsCount() {
      if (
        this.authorObj.followsCount > 999 &&
        this.authorObj.followsCount < 10000
      ) {
        return this.authorObj.followsCount / 1000 + "k";
      } else if (this.authorObj.followsCount > 9999) {
        return this.authorObj.followsCount / 10000 + "w";
      } else {
        return this.authorObj.followsCount;
      }
    },
    worksCount() {
      if (
        this.authorObj.worksCount > 999 &&
        this.authorObj.worksCount < 10000
      ) {
        return this.authorObj.worksCount / 1000 + "k";
      } else if (this.authorObj.worksCount > 9999) {
        return this.authorObj.worksCount / 10000 + "w";
      } else {
        return this.authorObj.worksCount;
      }
    },
    collectCount(){
      if (
        this.authorObj.collectCount > 999 &&
        this.authorObj.collectCount < 10000
      ) {
        return this.authorObj.collectCount / 1000 + "k";
      } else if (this.authorObj.collectCount > 9999) {
        return this.authorObj.collectCount / 10000 + "w";
      } else {
        return this.authorObj.collectCount;
      }
    }
  },
  methods: {
    // 收藏列表按钮，加载更多数据
    collectListBtnClick(index) {
      const pg = this.collectPages[index];
      const id = this.collectIdObject[index].id;
      request({
        url: api_list.api_getCollectGroupList,
        method: "get",
        params: {
          customerId: this.$route.query.id,
          collectGroupId: id,
          page: pg,
          limit: 5,
        },
      }).then((res) => {
        this.collactLists[index].rows.push.apply(
          this.collactLists[index].rows,
          res.data.rows
        );
        if (res.data.rows == null) {
          this.dis[index] = true;
          // this.$refs.collectBtn[index].value = "wu啦~";
          // console.log(this.$refs);
          return null;
        }
        // console.log(this.collactLists[index].rows);
        this.collectPages[index] += 1;
        // console.log(res);
      });
    },
    // title栏的点击效果
    titleClick(i) {
      this.titleName = i;
      // this.isShow = !this.isShow;
      if (i == 1) this.isShow = true;
      else this.isShow = false;
    },
    // 获取作者收藏
    getCollect(_id) {
      request({
        url: api_list.api_getOpenGroups,
        method: "get",
        params: {
          customerId: _id,
        },
      }).then((res) => {
        // console.log(res);
        this.authorCollectsList = res.data.items;
        // console.log(this.authorCollectsList);
      });
    },
    //获取作者信息
    getAuthorInfo() {
      request({
        url: api_list.api_getCustomerInfo,
        method: "get",
        params: {
          customerId: this.$route.query.id,
        },
      }).then((res) => {
        console.log(res);
        if (res.success) {
          this.authorObj = res.data.item;
          this.$store.commit("updateAuthorInfo", this.authorObj);
          this.getCollect(this.authorObj.id);
        }
      });
    },
    //获取作者作品列表
    getAuthorWorksList() {
      const pg = this.worksPages;
      this.worksPages += 1;
      return request({
        url: api_list.api_getAuthorWorks,
        method: "get",
        params: {
          customerId: this.$route.query.id,
          page: pg,
          limit: 50,
        },
      });
    },
    // 获取公开收藏列表分组和每个分组的一部分数据
    getAuthorCollectId() {
      request({
        url: api_list.api_getOpenGroups,
        method: "get",
        params: {
          customerId: this.$route.query.id,
        },
      }).then((res) => {
        this.collectIdObject = res.data.items;
        console.log(res);
        for (let i in res.data.items) {
          this.collectPages[i] = 1;
          const pg = this.collectPages[i];
          const collectId = res.data.items[i].id;
          request({
            url: api_list.api_getCollectGroupList,
            method: "get",
            params: {
              customerId: this.$route.query.id,
              collectGroupId: collectId,
              page: pg,
              limit: 50,
            },
          }).then((res) => {
            this.collactLists.push(res.data);
            this.collectPages[i] += 1;
            if (res.data.rows == null) {
              this.dis[i] = true;
              return null;
            }
          });
        }
      });
    },

    // 获取用户信息
    getUserInfo() {
      request({
        url: api_list.api_getUserInfo,
        method: "get",
      }).then((res) => {
        this.$store.commit("updateUserInfo", res.data.item);
      });
    },
    //作品滚轮加载更多
    loadMore() {
      if (!this.isShow) return true;
      this.busy = true;

      if (this.totals < this.scrollNum * 50) {
        this.loadState = 2;
        return false;
      }
      setTimeout(() => {
        this.getAuthorWorksList()
          .then((res) => {
            this.list.push(res.data.rows);;
          })
          .catch((err) => {
            this.loadState = 0;
          });
        this.busy = false;
        this.scrollNum += 1;
      }, 1000);
    },
  },
  components: { commonHeader, workShowCart, authorspaceshowlist },
};
</script>

<style scoped>
.authorSpace {
  position: relative;
  height: 100vh;
  /* background-image: url("../assets/imgs/user_spaceImg.jpg"); */
  background-repeat: no-repeat;
  background-size: cover;
  overflow-x: hidden;
}
.spaceWrap {
  width: 7rem;
  height: 3rem;
  margin: 0 auto;
}
.author-head {
  box-sizing: border-box;
  width: 100%;
  height: 2rem;
  background-color: #fff;
  padding-top: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.author-info {
  width: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.author-avatar {
  width: 0.5rem;
  height: 0.5rem;
  border: 2px solid #fff;
  border-radius: 50%;
  background-size: cover;
}
.author-name {
  font-size: 0.1rem;
  color: rgb(0, 0, 0);
  margin-top: 0.1rem;
  text-align: center;
}
.author-sign {
  display: block;
  width: 1rem;
  height: 0.1rem;
  font-size: 0.08rem;
  color: rgb(0, 0, 0);
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  line-height: 0.1rem;
  margin-top: 0.05rem;
}
.author-meta {
  width: 3rem;
  height: 0.2rem;
  margin-top: 0.1rem;
}
.author-count {
  width: 25%;
  height: 100%;
  display: flex;
  float: left;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-right: 1px solid rgb(138, 138, 138);
  box-sizing: border-box;
  cursor: pointer;
}
.meta-title {
  font-size: 0.1rem;
}
.meta-count {
  font-size: 0.08rem;
}
.titleActive .meta-title {
  font-size: 0.1rem;
  font-weight: bolder;
  font-style: italic;
}
.collect-title {
  display: flex;
}
.collect-list {
  position: relative;
  margin: 30px;
}
.collectList h3 {
  font-size: 0.13rem;
  flex: 1;
  text-align: center;
}
.collectList h3 span{
  font-size: 5px;
}
.collectList-btn {
  position: absolute;
  right: 0.1rem;
  top: 0.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  width: 0.2rem;
  height: 0.1rem;
  text-align: center;
  border: 1px solid;
  cursor: pointer;
}
.rotateAnimation{
  animation: rotateAn 1s forwards;
}
.disabled {
  background-color: #ccc;
  color: #eee;
  font-style: italic;
}

.worksList {
  margin-top: 80px;
  padding-top: 2px;
}
.collect-bottom p {
  padding-bottom: 10px;
  font-size: 0.1rem;
  font-style: italic;
  text-align: center;
}

@keyframes rotateAn {
  from{transform: rotate(0deg);}
  to{transform: rotate(360deg);}
}
</style>