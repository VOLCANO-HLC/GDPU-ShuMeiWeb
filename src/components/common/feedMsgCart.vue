<template>
  <div class="feedMsgCart">
    <!-- 图片预览 -->
    <previewImgs :imgsList="preImages" v-if="showPreview" :activeKey="imgIndex" @close="showPreview = false"></previewImgs>
    <!-- 图片预览 -->

    <div class="feed-title">
      <!-- 用户信息 -->
      <div class="title-content">
        <div class="user-avatar" :style="{backgroundImage: 'url(' + feedObj.avatar + ')'}" @click="gotoAuthorSpace(feedObj.customerId)"></div>
        <div class="title-info"> 
          <h4>{{feedObj.customerName}}</h4>
          <span>{{feedObj.gmtCreate}}</span>
        </div>
      </div>
      <!-- 用户信息 -->
      <!-- 删除操作 -->
      <div class="operation" v-if="showOptions">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <van-icon name="ellipsis" size=".2rem" color="#575757b3"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="showDelBtn" @click.native="delBtn">删除</el-dropdown-item>
            <el-dropdown-item @click.native="hideBtn">隐藏</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 删除操作 -->
    </div>

    <!-- 动态内容 -->
    <div class="feed-content">
      <div class="feed-message" v-show="feedObj.content">
        <pre>{{feedObj.content}}
        </pre>
      </div>
      <div class="feed-imgs" v-if="feedObj.pictureUrlList">
        <div class="image-item" v-for="(item, index) in feedObj.pictureUrlList" :key="index" :style="{backgroundImage: 'url(' + item + ')'}"
        @click="showImages(index)"></div>
      </div>
      <div class="feed-work">
        <worksCart v-if="workObj" :workObj="workObj" @delSelf="delWork"></worksCart>
      </div>
    </div>
    <!-- 动态内容 -->

    <div class="feed-meta">
      <!-- <van-icon name="good-job-o" @click=""/> -->
      <span style="cursor: pointer;" @click="openBComment">评论({{commentTotal}})</span>
    </div>

    <!-- 评论区 -->
    <div class="feed-comments" v-if="showBComment">
      <hr style="margin: .05rem;">
      <div class="comment">
        <commentBar :bandSend="isban" @reply="replyFeed"></commentBar>
      </div>
      <hr style="margin: .05rem;">
      <!-- 排序 -->
      <el-dropdown class=" sort-btn" trigger="click" style="z-index: 10;">
        <span class="el-dropdown-link">
          <i class="el-icon-menu"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="sortBtn(0)">按点赞数</el-dropdown-item>
          <el-dropdown-item @click.native="sortBtn(1)">按时间</el-dropdown-item> 
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 排序 -->
      <div v-for="(bigItem, index) in bigComments" :key="bigItem.id">
        <feedComment 
        :commentObj="bigItem"
        :showCommentBar="commentId === bigItem.id"
        :bandSend="isban"
        @giveLike="giveGood(bigItem)"
        @reply="openSComment(bigItem, index)"
        @comment="commentId = bigItem.id"
        @sendReply="commentReply($event,index)"
        @clickAvatar="gotoAuthorSpace(bigItem.customerId)"
        @delComment="delComment(bigItem, index)"
        ></feedComment>
        <!-- 评论下的回复 -->
        <div class="feed-comment-reply" v-if="showSComment[index]">
          <feedComment v-for="(smallItem, inx) in smallComments[index].comments" :key="smallItem.id"
          :commentObj="smallItem"
          :hideComment="true"
          :showCommentBar="commentId === smallItem.id"
          :bandSend="isban"
          @giveLike="giveGood(smallItem)"
          @comment="commentId = smallItem.id"
          @sendReply="commentReply($event,index)"
          @clickAvatar="gotoAuthorSpace(smallItem.customerId)"
          @clickOther="gotoAuthorSpace(smallItem.repliedCustomerId)"
          @delComment="delComment(smallItem, index)"
          ></feedComment>
          <div class="more-replys" @click="loadMoreReplys(index)" v-if="smallComments[index].count !== smallComments[index].comments.length">
            展开
          </div>
        </div>
        <!-- <commentBar @reply=""></commentBar> -->
        <!-- 评论下的回复 -->
        <hr style="margin: .05rem;">
      </div>
      <!-- 加载状态 -->
      <p class="load-text" v-if="loadState===1">加载中...</p>
      <p class="load-text" v-if="loadState===0">加载失败</p>
      <p class="load-text" v-if="loadState===2">没有更多了</p>
      <!-- 加载状态 -->
    </div>
    <!-- 评论区 -->
    <div class="comment-load" v-if="showBComment && loadState===null" @click="loadMore" style="cursor: pointer;">更多 <i class="el-icon-caret-bottom"></i></div>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import previewImgs from './previewImgs'
import worksCart from './worksCart'
import feedComment from './feedComment'
import commentBar from './commentBar'
  export default {
    name:'feedMsgCart',
    data(){
      return{
        // 预览图片数组
        preImages: [],
        // 预览图片
        showPreview: false,
        // 点击的图片索引
        imgIndex: 0,
        // 作品信息
        workObj: null,
        // 评论总数
        commentCount: 0,
        // 大评论的总数
        bigCommentCount: 0,
        // 小评论总数
        smallCommentCount: 0,
        // 显示大评论
        showBComment: false,
        // 显示小评论
        showSComment: [],
        // 大评论页数
        pageCount: 1,
        // 每次获取评论的个数
        limitCount: 5,
        // 排序类型
        sortType: 0,
        // 大评论数组
        bigComments: [],
        // 小评论数组
        smallComments: [],
        // 评论加载状态
        loadState: null,
        // 要评论的评论id
        commentId: '',
        // 禁用发送按钮
        isban: false
      }
    },
    props:{
      feedObj: {
        type: Object,
        default: {}
      },
      showDelBtn:{
        type: Boolean,
        default: true
      },
      openComment:{
        type: Boolean,
        default: false
      },
      showOptions:{
        type: Boolean,
        default: true
      }
    },
    components:{
      previewImgs,
      worksCart,
      feedComment,
      commentBar
    },
    computed:{
      commentTotal(){
        if(this.commentCount >= 100){
          return '99+'
        }
        return this.commentCount;
      }
    },
    created(){
      this.preImages = this.feedObj.pictureUrlList;
      if(this.openComment){
        this.openBComment();
      }
      this.getFeedCommentTotalCount();
      this.getWorkInfo();
    },
    methods:{
      // 删除评论
      delComment(_comment, index){
        // console.log(index)
        this.$confirm('是否删除该评论?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: api_list.api_delComment,
            method: 'delete',
            params: {
              commentId: _comment.id
            }
          }).then(res => {
            // console.log(res);
            if(res.success){
              // 移除评论，判断是大评论还是小评论
              if(_comment.parentCommentId){
                this.refreshSComment(index);
              } else {
                this.refreshBComment(index);
              }
              this.getFeedCommentTotalCount();
            }
          })
        })
      },
      // 评论回复
      commentReply($event, _index){
        // console.log({feedId,id,customerId,parentCommentId})
        // console.log($event,_index)
        let {feedId,id,customerId,parentCommentId} = $event.commentObj;
        let _content = $event._content;
        let reg = new RegExp(/[^\s]/g)
        if(!reg.test(_content)){
          return;
        }
        this.isban = true;
        request({
          url: api_list.api_sendCommentReply,
          method: 'post',
          data:{
            feedId,
            content: _content,
            repliedCommentId: id,
            repliedCustomerId: customerId,
            parentCommentId: parentCommentId === null? id : parentCommentId,
          }
        }).then(res => {
          // console.log(res)
          this.isban = false;
          this.$toast({
            message: '发送成功'
          })
          this.refreshSComment(_index);
          // 强制刷新大评论的回复数量
          this.$set(this.bigComments[_index], 'replyCount', this.bigComments[_index].replyCount + 1);
        }).catch(err => {
          this.isban = false;
        })
      },
      // 评论动态
      replyFeed(_content){
        // 正则匹配，检验是否有内容，没有就不用发送
        let reg = new RegExp(/[^\s]/g)
        if(!reg.test(_content)){
          return;
        }
        this.isban = true;
        request({
          url: api_list.api_sendFeedComment,
          method: 'post',
          data:{
            feedId: this.feedObj.id,
            repliedCustomerId: this.feedObj.customerId,
            content: _content
          }
        }).then(res => {
          // console.log(res)
          this.isban = false;
          if(res.success){
            this.$toast({
              message: '发表成功'
            });
            // 刷新评论
            this.refreshBComment();
            this.getFeedCommentTotalCount();
          }
        }).catch(err => {
          this.isban = false;
        })
      },
      // 对评论排序
      sortBtn(_tag){
        // 如果排序方法不变，就返回
        if(this.sortType === _tag){
          return;
        }
        this.refreshBComment(_tag);
      },
      // 点赞动态
      giveGood(_comment){
        // console.log(_comment)
        request({
          url: api_list.api_giveCommentLike,
          method: 'put',
          params:{
            commentId: _comment.id,
            like: _comment.liked? -1 : 1,
          }
        }).then(res => {
          // console.log(res);
          // console.log(_comment)
        });
        _comment.likeCount += _comment.liked? -1 : 1;
        _comment.liked = _comment.liked? false : true;
      },
      // 加载更多大评论
      loadMore(){
        this.getFeedComments().then(res => {
          if(res.success && res.data.rows){
            this.bigComments = this.bigComments.concat(res.data.rows);
            this.bigCommentCount = res.data.total;
            // 判断有没有更多的大评论了
            this.loadState = this.bigComments.length >= this.bigCommentCount? 2 : null;
          }
        })
      },
      // 加载更多小评论
      loadMoreReplys(_index){
        // console.log(this.bigComments[_index])
        this.getCommentReply(this.bigComments[_index], ++this.smallComments[_index].pageCount).then(res => {
          // console.log(res);
          if(res.success){
            this.smallComments[_index] = {
              pageCount: this.smallComments[_index].pageCount,
              count: res.data.total,
              comments: this.smallComments[_index].comments.concat(res.data.rows)
            }
            // console.log(this.smallComments)
            this.$forceUpdate();
          }
        });
      },
      // 打开大评论区
      openBComment(){
        this.showBComment || this.bigCommentCount || this.getFeedComments().then(res => {
          if(res.success && res.data.rows){
            this.bigComments = res.data.rows;
            // 记录大评论的总数
            this.bigCommentCount = res.data.total;
          }
          // 判断有没有更多的大评论了
          this.loadState = this.bigComments.length >= this.bigCommentCount? 2 : null;
        });

        this.showBComment = this.showBComment? false : true;
      },
      // 打开小评论区
      openSComment(_comment, index){
        // console.log(index)
        // 如果没有回复就返回
        if(!_comment.replyCount){
          return;
        };

        // 第一次展开回复，要去获取数据
        if(!this.smallComments[index]){
          this.getCommentReply(_comment, 1).then(res => {
            console.log(res)
            if(res.success){
              this.smallComments[index] = {
                // showComment: true,
                pageCount: 1,
                count: res.data.total,
                comments: res.data.rows
              }
            }
            this.$set(this.showSComment, index, true)
            // console.log(this.smallComments)
          });
        } else {
          // console.log(this.showSComment)
          // 如果不是第一次展开，就要区分是打开回复还是收起回复
          let bool = this.showSComment[index]? false  : true;
          this.$set(this.showSComment, index, bool)
        }

      },
      // 刷新大评论
      refreshBComment(_tag){
        // console.log(_tag)
        if(_tag !== null && _tag !== undefined){
          // 排序参数
          this.sortType = _tag;
        }
        // 页数重置为1
        this.pageCount = 1;
        // 重置小评论数组
        this.smallComments = [];
        this.showSComment = [];

        this.getFeedComments().then(res => {
          // console.log(res)
          if(res.success && res.data.rows){
            this.bigComments = res.data.rows;
            // 记录大评论的总数
            this.bigCommentCount = res.data.total;
          }
          // 判断有没有更多的大评论了
          this.loadState = this.bigComments.length >= this.bigCommentCount? 2 : null;
        });
      },
      // 刷新小评论
      refreshSComment(_index){
        // console.log(_comment, _index)
        this.getCommentReply(this.bigComments[_index], 1).then(res => {
          // console.log(res)
          if(res.success){
            // 强制刷新小评论
            this.$set(this.smallComments, _index, {
              pageCount: 1,
              count: res.data.total,
              comments: res.data.rows
            });
          }
        })
      },
      // 获取动态的大评论
      getFeedComments(){
        this.loadState = 1;
        return request({
          url: api_list.api_getFeedComments,
          method: 'get',
          params:{
            feedId: this.feedObj.id,
            sortType: this.sortType,
            page: this.pageCount++,
            limit: this.limitCount
          }
        })
      },
      // 获取每条评论下的小评论
      getCommentReply(_comment, pageIndex){
        // console.log(_comment,pageIndex)
        return request({
          url: api_list.api_getCommentReply,
          method: 'get',
          params:{
            commentId: _comment.id,
            sortType: this.sortType,
            page: pageIndex,
            limit: this.limitCount
          }
        })
      },
      // 获取动态评论的总数
      getFeedCommentTotalCount(){
        request({
          url: api_list.api_getFeedCommentCount,
          method: 'get',
          params:{
            feedId: this.feedObj.id
          }
        }).then(res => {
          // console.log(res)
          if(res.success){
            this.commentCount = res.data.count
          }
        })
      },
      // 删除作品
      delWork(){
        this.$confirm('是否删除该作品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(this.feedObj.workId)
          request({
            url: api_list.api_delPersonalWork,
            method: 'delete',
            params:{
              workId: this.feedObj.workId
            }
          }).then(res => {
            // console.log(res)
            if(res.success){
              this.$toast({
                message: '删除成功'
              })
              this.hideBtn();
            }
          })
        })
      },
      // 获取作品信息
      getWorkInfo(){
        if(!this.feedObj.workId){
          return;
        }
        request({
          url: api_list.api_getWorkInfo,
          method: 'get',
          params:{
            workId: this.feedObj.workId
          }
        }).then(res => {
          if(res.success){
            this.workObj = res.data.item
          }
        })
      },
      // 删除
      delBtn(){
        this.$emit('delBtn');
      },  
      // 隐藏
      hideBtn(){
        // console.log("hide");
        this.$emit('hideBtn');
      },
      // 预览图片
      showImages(_index){
        this.showPreview = true;
        this.imgIndex = _index;
      },
      // 跳转到用户空间
      gotoAuthorSpace(userId){
        // console.log(userId)
        // 如果是用户本人，就不用跳转了
        if(userId === this.$store.state.userInfo.id){
          return;
        }
        this.$router.push({path: '/AuthorSpace', query:{id: userId}})
      }
    },

  }
</script>

<style scoped>
  .feedMsgCart{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    margin: 0 auto;
    background: rgb(255,255,255,.7);
    border-radius: .05rem;
    border: 2px solid #fff;
    overflow: hidden;
    margin-bottom: .03rem;
    padding: 0 .2rem;
    color: black;
    
  }
  .feed-title{
    display: flex;
    align-items: center;
    width: 100%;
    height: .45rem;
  }
  .title-content{
    display: flex;
    align-items: center;
    width: 100%;
    height: .4rem;
  }
  .user-avatar{
    width: .3rem;
    height: .3rem;
    background: #fff;
    border-radius: 50%;
    border: 2px solid #fff;
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
  .title-info{
    /* width: .6rem; */
    height: .3rem;
    margin-left: .1rem;
  }
  .title-info span,h4{
    margin: 0;
    font-size: .1rem;
  }
  .title-info span{
    display: block;
    color: rgb(110, 110, 110);
    font-size: .05rem;
    margin-top: .1rem;
  }
  .operation{
    height: 100%;
    display: flex;
    align-items: center;
  }
  .operation i{
    display: block;
  }
  .feed-content{
    width: 100%;
    padding: 0.05rem;
    border-top: 1px solid rgb(218, 218, 218);
  }
  .feed-message pre{
    width: 100%;
    margin: 0;
    font-size: .1rem;
    font-weight: 500;
    font-family: "宋体";
    white-space: pre-wrap;
  }
  .el-dropdown-link {
    cursor: pointer;
  }
  .feed-imgs{
    display: flex;
    width: 80%;
    flex-wrap: wrap;
  }
  .image-item{
    width: 1rem;
    height: 0.54rem;
    margin-bottom: .02rem;
    margin-right: .02rem;
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
  .feed-meta{
    font-size: .08rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    bottom: 0;
    padding: .1rem 0;
  }
  .feed-meta i{
    font-size: .1rem;
    margin-right: .1rem;
    cursor: pointer;
  }
  .load-text{
    font-size: .05rem;
    text-align: center;
    font-weight: 500;
  }
  .comment-load{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    font-size: .1rem;
    color: #3395d6;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.692));
  }
  .comment{
    display: flex;
    width: 100%;
    height: .5rem;
  }
  .feed-comment-reply{
    position: relative;
    margin: 0 .3rem;
    border-top: 1px dashed #fff;
    border-bottom: 1px dashed #fff;
    background-color: rgba(255, 255, 255, 0.219);
  }
  .more-replys{
    position: absolute;
    bottom: 0;
    font-size: .05rem;
    width: 100%;
    text-align: center;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.164));
    color:rgb(73, 43, 204);
    cursor: pointer;
  }
  .sort-btn{
    font-size: .1rem;
    position: absolute;
    right: .2rem;
  }
</style>