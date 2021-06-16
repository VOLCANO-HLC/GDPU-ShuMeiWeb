<template>
  <div class="commentArea">
    <div class="comment-title">评论区</div>
    <div class="user-comment">
      <div class="login-state" v-if="!this.$cookies.isKey('user_token')">
        <router-link to="/Login" class="login-btn">登录</router-link>或
        <router-link to="/Register" class="register-btn">注册</router-link>
      </div>
      <div
        class="user-avatar"
        v-if="this.$cookies.isKey('user_token')"
        :style="{ backgroundImage: 'url(' + avatar + ')' }"
      ></div>
      <!-- 富文本编辑器 -->
      <div class="comment-editor" ref="commentEditor">
        <div id="text-container" class="text"></div>
        <div id="toolbar-container" class="toolbar"></div>
      </div>
      <!-- 富文本编辑器 -->
      <el-button type="primary" size="small" @click="reply">回复</el-button>
    </div>
    <!-- 评论区 -->
    <div class="comment-content" v-if="comSArray" ref="comment">
      <div class="b-com-item" v-for="(item, index) in comBArray" :key="item.id">
        <com-item
          :commentObject="item"
          @reply="showSecEdit($event, index)"
          @isLiked="isLiked"
          @dele="dele"
        ></com-item>
        <div
          class="s-com-item"
          v-for="(iitem, iindex) in comSArray[index]"
          :key="iindex"
        >
          <com-item
            :commentObject="iitem"
            @reply="showSecEdit($event, index)"
            @isLiked="isLiked"
            @dele="dele"
          ></com-item>
        </div>
        <p v-show="isSmallMore[index]">~ 没 ~ 有 ~ 啦 ~</p>
        <button
          class="s-c-btn"
          @click="smallComMore(index)"
          v-show="!isSmallMore[index]"
        >
          展示更多
        </button>
      </div>
      <div v-show="!isBigMore">
        <div
          @click="bigComMore()"
          class="b-c-btn"
          >更多<i class="el-icon-caret-bottom"></i></div>
      </div>
      <p v-show="isBigMore" class="end">
        到底了~
      </p>

      <!-- 第二个富文本编辑器 -->
      <div class="comEdit" v-show="isShow">
        <div id="secEdit" ref="secEditor"></div>
        <div class="reply">
          <el-button type="primary" size="small" @click="replySecEdit"
            >回复</el-button
          >
        </div>
      </div>
      <!-- 第二个富文本编辑器 -->

      <!-- 评论区 -->
    </div>
  </div>
</template>

<script>
import { request } from "@/network/request";
import api_list from "@/network/api_list";
import E from "wangeditor";
import comItem from "./commentItem";
import "../../assets/resetCss/reComment.css";
import Vue from "vue";
export default {
  name: "commentArea",
  data() {
    return {
      //富文本编辑器的模块
      editor: null,
      //编辑器的高度
      editorHeight: undefined,
      // 大评论的页数
      comBPages: 1,
      // 小评论的页数组
      comSPages: [],
      // 大评论对象组
      comBArray: [],
      // 大评论-没有了-判断依据
      isBigMore: false,
      // 小评论-没有了-判断依据
      isSmallMore: [],
      // 大评论数量
      bigTotal: 0,
      // 大评论加载次数
      bigNum: 0,
      // 各个大评论下的小评论的集合
      comSArray: [],
      // 评论模块的渲染判断
      isLoad: false,
      // 第二个富文本
      secondEditor: null,
      // 第二个富文本的显示判断
      isShow: false,
      // 回复他人评论所需参数
      repliedCommentId: null, //该评论所回复的评论id
      repliedCustomerId: null, //该评论所回复的用户id
      parentCommentId: null, //该评论所在的作品评论id
      // 用户的回复对象
      replyComment: {},
      // 用户回复的大评论index
      index: 0,
      hh: [],
    };
  },
  created() {
    // 第一次加载大评论
    this.getFirstComments();
  },
  mounted() {
    this.initEditor();
    this.initSecondEditor();
    this.isShowSecEditor();
  },
  computed: {
    avatar() {
      if (this.$store.state.userInfo) {
        return this.$store.state.userInfo.avatar;
      }
    },
  },
  methods: {
    // 第一次请求大小评论
    getFirstComments() {
      this.getBigComments().then((res) => {
        // console.log(res);
        // console.log(res.data.rows[1].avatar);
        this.comBArray = res.data.rows;
        this.bigTotal = res.data.total;
        this.bigNum += 1;

        for (let i in this.comBArray) {
          // this.isSmallMore[i] = false;
          Vue.set(this.isSmallMore, i, false);

          this.comSPages[i] = 1;
          if (!this.comBArray[i].replyCount) {
            Vue.set(this.isSmallMore, i, true);
            Vue.set(this.comSArray, i, []);

            continue;
          }
          this.getSmallComment(i).then((res) => {
            // console.log(res);
            if (res.success) {
              // this.isSmallMore[i] = false;
              Vue.set(this.isSmallMore, i, false);

              // this.comSArray[i] = res.data.rows;
              Vue.set(this.comSArray, i, res.data.rows);

              // console.log(this.comSArray);
              // console.log(res.data.rows);
              // console.log(i);
            } else {
              // this.comSArray[i] = null;
              Vue.set(this.comSArray, i, []);

              // this.isSmallMore[i] = true;
              Vue.set(this.isSmallMore, i, true);
            }
          });
        }
        this.isLoad = true;
        // this.assay = this.comSArray;
        // this.$forceUpdate();
      });
    },
    // 请求大评论数据
    getBigComments() {
      const pg = this.comBPages;
      this.comBPages += 1;
      return request({
        url: api_list.api_getCommentListh,
        method: "get",

        params: {
          workId: this.$route.query.id,
          sortType: 0,
          page: pg,
          limit: 50,
        },
      });
    },
    // 请求小评论数据
    getSmallComment(i) {
      const pg = this.comSPages[i];
      this.comSPages[i] += 1;
      const id = this.comBArray[i].id;
      // console.log(pg);
      return request({
        url: api_list.api_getReplyList,
        method: "get",

        params: {
          commentId: id,
          sortType: 0,
          page: pg,
          limit: 50,
        },
      });
    },
    // 大评论加载更多
    bigComMore() {
      if (this.bigNum * 50 > this.bigTotal) {
        this.isBigMore = true;
        // console.log("hhh");
        return false;
      }
      this.getBigComments().then((res) => {
        if (res.code != 20000) {
          this.isBigMore = true;
          return;
        }
        this.comBArray.push.apply(res.data.rows);
        // console.log("sss:" + res);
      });
      // console.log("hhh");
    },
    // 小评论加载更多
    smallComMore(i) {
      if (!this.comSArray[i]) {
        // this.isSmallMore[i] = true;
        Vue.set(this.isSmallMore, i, true);

        // console.log("if");
        console.log(this.isSmallMore[i]);
        return false;
      }
      this.getSmallComment(i).then((res) => {
        if (!res.data.rows.length) {
          // console.log("true");

          // this.isSmallMore[i] = true;
          Vue.set(this.isSmallMore, i, true);

          return false;
        }
        // console.log(res.data);
        this.comSArray[i].push.apply(res.data.rows);
        // console.log("false");
      });
    },
    //对作品发表评论，并发送
    reply() {
      const content = this.editor.txt.text();
      // console.log(content);
      this.replyComment.avatar = this.$store.state.userInfo.avatar;
      this.replyComment.customerName = this.$store.state.userInfo.name;
      this.replyComment.content = content;
      this.replyComment.gmtCreate = this.getTime();
      this.replyComment.likeCount = 0;
      this.replyComment.replyCount = 0;
      this.editor.txt.clear();
      // Vue.set(this.comBArray, this.comBArray.length, this.replyComment);

      // console.log(this.getTime());
      // console.log(this.$store.state.userInfo);

      request({
        url: api_list.api_postReplyToWork,
        method: "post",
        data: {
          workId: this.$route.query.id,
          repliedCustomerId: this.$route.query.customerId,
          content: content,
        },
      }).then((res) => {
        this.comBPages = 1;
        this.getFirstComments();
      });

      this.editor.txt.clear();
    },
    //初始化第一个富文本编辑器
    initEditor() {
      this.editor = new E("#toolbar-container", "#text-container");
      this.editor.config.height = this.$refs.commentEditor.offsetHeight;
      this.editor.config.placeholder = "";
      this.editor.config.zIndex = 10;
      this.editor.config.menus = [
        "bold",
        // "head",
        "link",
        "italic",
        "code",
        "underline",
        "emoticon",
        "image",
        "justify",
      ];
      this.editor.config.colors = ["#000000", "#eeece0", "#1c487f", "#4d80bf"];
      this.editor.create();
    },
    // 初始化第二个富文本编辑器
    initSecondEditor() {
      this.secondEditor = new E("#secEdit");
      this.secondEditor.config.height = 150;
      this.secondEditor.config.menus = [
        "bold",
        "italic",
        "foreColor",
        "emoticon",
        "splitLine",
        "undo",
        "redo",
      ];
      this.secondEditor.create();
    },
    // 点击回复图标，显示第二个富文本
    showSecEdit(obj, index) {
      this.isShow = true;
      console.log(obj);
      console.log(index);
      this.index = index;
      if (obj.parentCommentId) {
        this.parentCommentId = obj.parentCommentId;
        this.repliedCommentId = obj.id;
        this.repliedCustomerId = obj.customerId;
        // console.log(
        //   this.parentCommentId + this.repliedCommentId + this.repliedCustomerId
        // );
        // console.log("y");
      } else {
        this.parentCommentId = obj.id;
        this.repliedCommentId = obj.id;
        this.repliedCustomerId = obj.customerId;
        // console.log(
        //   this.parentCommentId + this.repliedCommentId + this.repliedCustomerId
        // );

        // console.log("n");
      }
      this.replyComment.avatar = this.$store.state.userInfo.avatar;
      this.replyComment.customerName = this.$store.state.userInfo.name;
      this.replyComment.repliedCustomerName = obj.customerName;
      // this.replyComment.content;
      this.replyComment.gmtCreate = this.getTime();
      this.replyComment.likeCount = 0;
      this.replyComment.replyCount = null;
    },
    // 发送对他人的评论
    replySecEdit() {
      // console.log(this.$store.state.userInfo.id);

      const content = this.secondEditor.txt.text();
      this.replyComment.content = content;
      // console.log(content);
      this.isShow = false;
      this.secondEditor.txt.clear();
      request({
        url: api_list.api_postReplyToPerson,
        method: "post",
        data: {
          workId: this.$route.query.id,
          content: content,
          repliedCommentId: this.repliedCommentId,
          repliedCustomerId: this.repliedCustomerId,
          parentCommentId: this.parentCommentId,
        },
      }).then((res) => {
        this.comBPages = 1;
        this.getFirstComments();
      });
    },
    // 获取时间
    getTime() {
      const timer = new Date();
      // console.log(timer);
      const y = timer.getFullYear();
      // console.log(y);
      const M = timer.getMonth() + 1;
      // console.log(M);
      const d = timer.getDate();
      // console.log(d);
      const h = timer.getHours();
      const m = timer.getMinutes();
      const s = timer.getSeconds();
      // console.log(m);
      return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
    },
    // 判断是否展示第二个富文本
    isShowSecEditor() {
      document.addEventListener("click", (e) => {
        const editor = this.$refs.secEditor;
        // console.log(editor);

        const comment = this.$refs.comment;
        if (!editor.contains(e.target) && !comment.contains(e.target)) {
          this.isShow = false;
        } else {
          // this.isShow = true;
        }
      });
    },
    // 判断点赞还是取消，并发送数据
    isLiked(commentObject) {
      let like = 1;
      if (commentObject.liked) {
        like = -1;
        commentObject.liked = false;
        commentObject.likeCount -= 1;
      } else {
        commentObject.liked = true;
        commentObject.likeCount += 1;
      }

      request({
        url: api_list.api_putCommentLiked,
        method: "put",
        params: {
          commentId: commentObject.id,
          like: like,
        },
      });
    },
    dele(commentObject) {
      // console.log("555");
      request({
        url: api_list.api_deleteComment,
        method: "delete",
        params: {
          commentId: commentObject.id,
        },
      }).then((res) => {
        this.comBPages = 1;
        this.getFirstComments();
      });
    },
  },
  components: {
    comItem,
  },
};
</script>
<style scoped>
.commentArea {
  width: 4.5rem;
  margin-top: 0.1rem;
  background-color: rgb(46, 46, 46);
  /* color: #fff; */
}
.comment-title {
  font-size: 0.15rem;
  padding: 0.05rem;
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.233);
  color: black;
}
.user-comment {
  display: flex;
  width: 100%;
  height: 0.8rem;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.1rem;
  box-sizing: border-box;
}
.login-state {
  display: flex;
  font-size: 0.1rem;
}
.login-btn,
.register-btn {
  font-size: 0.1rem;
  text-align: center;
  color: rgb(113, 84, 218);
}
.user-avatar {
  width: 0.35rem;
  height: 0.35rem;
  border: 1px solid #fff;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}
.comment-editor {
  box-sizing: border-box;
  width: 70%;
  height: 100%;
  padding-top: 0.1rem;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

#text-container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-size: 0.05rem;
}
#toolbar-container {
  width: 100%;
  height: 0.15rem;
  background-color: #fff;
  margin-top: 2px;
}
.comment-cart {
  width: 100%;
  height: 0.6rem;
  border-bottom: 1px solid black;
}
.ql-toolbar .ql-snow {
  display: flex;
}
.comment-content {
  margin-top: 0.4rem;
  color: #fff;
}
.b-com-item {
  border-bottom: black 1px dashed;
  margin-bottom: 0.5rem;
  padding-bottom: 0.2rem;
}
.s-com-item {
  margin-left: 0.5rem;
}
.b-c-btn {
  display: block;
  font-size: .1rem;
  text-align: center;
  background-color: rgb(58, 58, 58);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.308);
  cursor: pointer;
}
.s-c-btn {
  color: rgb(235, 228, 217);
  background-color: grey;
  border-radius: 0.1rem;
  height: 0.2rem;
  font-size: 0.05rem;
  display: block;
  margin: 0 auto;
  margin-top: 0.4rem;
}
.comment-content p {
  margin-top: 0.5rem;
  font-size: 0.05rem;
  text-align: center;
  color: rgb(223, 206, 186);
  font-style: italic;
}
.comment-content .end {
  font-size: 0.08rem;
  color: rgb(255, 255, 255);
}
.comEdit {
  width: 600px;
  position: fixed;
  z-index: 100;
  left: 80%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  line-height: 40px;
  height: 50px;
}
.comEdit .reply {
  position: relative;
  left: 540px;
}
</style>