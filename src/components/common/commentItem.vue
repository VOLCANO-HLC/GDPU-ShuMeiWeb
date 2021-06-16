<template>
  <div class="commentItem">
    <!-- 用户头像 -->
    <div>
      <slot name="customerAvatar">
        <div class="customer-vatar" @click="turnToMy">
          <img :src="commentObject.avatar" alt="" />
        </div>
      </slot>
    </div>
    <!-- 用户头像 -->

    <!-- 用户名字 -->
    <div class="comment-item-content">
      <div class="customerName">
        <h4>{{ commentObject.customerName }}</h4>
        <span v-show="isShow">回复 @</span
        ><span v-show="isShow" @click="turnToRep" class="replied">{{
          commentObject.repliedCustomerName
        }}</span>
      </div>
      <!-- 用户名字 -->

      <!-- 评论内容 -->
      <div class="com-content">
        <p>{{ commentObject.content }}</p>
      </div>
      <!-- 评论内容 -->
      <!-- 评论时间，点赞，回复 -->
      <div class="content-bottom">
        <span class="gmtCreate">{{ commentObject.gmtCreate }}</span>
        <span
          class="likeCount"
          :class="{ iLiked: commentObject.liked }"
          @click="isLiked"
          ><van-icon name="good-job" />{{ commentObject.likeCount }}</span
        >
        <span class="likeCount" @click="reply"
          ><van-icon name="comment" />{{ commentObject.replyCount }}</span
        >
        <span class="likeCount" v-show="showDele" @click="dele"
          ><van-icon name="delete"
        /></span>
        <!-- <button>5</button> -->
      </div>
      <!-- 评论时间，点赞，回复 -->
    </div>
  </div>
</template>

<script>
export default {
  name: "comItem",
  data() {
    return {
      isShow: false,
    };
  },
  props: {
    commentObject: {},
  },
  computed: {
    avatar() {
      return this.commentObject.avatar;
    },
    showDele() {
      if (this.commentObject.customerId == this.$store.state.userInfo.id) {
        // console.log(this.commentObject.customerId);
        // console.log(this.$store.state.userInfo.id);
        return true;
      }
      return false;
    },
  },
  created() {
    // console.log("44" + this.commentObject);
  },
  mounted() {
    this.show();
  },
  methods: {
    show() {
      if (this.commentObject.repliedCustomerName != null) {
        this.isShow = true;
      }
    },
    reply() {
      this.$emit("reply", this.commentObject);
    },
    isLiked() {
      this.$emit("isLiked", this.commentObject);
    },
    dele() {
      this.$emit("dele", this.commentObject);
    },
    turnToMy() {
      this.$router.push({
        path: "/AuthorSpace",
        query: { id: this.commentObject.customerId },
      });
    },
    turnToRep() {
      this.$router.push({
        path: "/AuthorSpace",
        query: { id: this.commentObject.repliedCustomerId },
      });
    },
  },
};
</script>

<style>
.commentItem {
  width: 90%;
  margin: 0.1rem;
  font-size: 0.1rem;
  position: relative;
  display: flex;
}
.commentItem h4,
.commentItem p {
  margin: 0;
  padding: 0;
}
.comment-item-content {
  flex: 1;
}
.customer-vatar img {
  cursor: pointer;
  border-radius: 50%;
  /* float: left; */
  margin-right: 0.1rem;
  width: 0.2rem;
  height: 0.2rem;
}
.com-content {
  margin-bottom: 0.1rem;
}
.content-bottom {
  font-size: 0.08rem;
}
.likeCount {
  margin-left: 0.5rem;
  margin-bottom: 0.1rem;
  cursor: pointer;
}
.iLiked {
  color: aqua;
}
.replied:hover {
  color: aqua;
  cursor: pointer;
}
</style>