<template>
  <div class="worksCart" :style="{backgroundColor:backgroundColor,color:textColor}">
    <div class="works-content">
      <div class="works-img" :style="{backgroundImage:'url(' + cover + ')'}"></div>
      <div class="works-info">
        <div class="works-title"><pre>{{title}}</pre></div>
        <div class="works-tag">
          <el-tag type="success">{{workObj.typeName}}</el-tag>
        </div>
        <div class="works-time">
          <div class="create-time">{{gmtCreate}}</div>
          <div class="modify-time">{{updateTime}}</div>
        </div>
        <div class="works-meta">
          <!-- <div class="good"><van-icon name="good-job-o" /><span>1</span></div> -->
          <div class="hot"><van-icon name="eye-o" /><span>{{hot}}</span></div>
          <div class="collection"><van-icon name="star-o" /><span>{{collectCount}}</span></div>
        </div>
      </div>
      <div class="works-operation">
        <van-button icon="edit" plain type="primary" size="small" v-if="isAuthor" :style="{backgroundColor:backgroundColor,color:textColor,borderColor:textColor}" @click="modify">编辑</van-button>
        <van-button icon="coupon-o" plain type="primary" size="small" :style="{backgroundColor:backgroundColor,color:textColor,borderColor:textColor}" @click="gotoWorkExhibition">详情</van-button>
        <van-icon name="delete-o" style="margin-left: .1rem;" v-if="isAuthor && showDelBtn" @click="delSelf"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    name:'worksCart',
    data(){
      return{
      }
    },
    props:{
      workObj:Object,
      showDelBtn:{
        type: Boolean,
        default: true
      }
    },
    created(){
      // console.log(this.workObj)
    },
    computed:{
      isAuthor(){
        return (this.$cookies.get('user_id') === this.workObj.customerId);
      },
      cover(){
        return this.workObj.cover;
      },
      title(){
        return this.workObj.title;
      },
      gmtCreate(){
        return this.workObj.gmtCreate;
      },
      updateTime(){
        return this.workObj.updateTime;
      },
      hot(){
        return this.workObj.hot;
      },
      collectCount(){
        return this.workObj.collectCount;
      },
      backgroundColor(){
        return this.$store.state.spaceColor;
      },
      textColor(){
        return this.$store.state.textColor;
      }
    },
    methods:{
      //跳转作品展示页面
      gotoWorkExhibition(){
        let routeUrl = this.$router.resolve({
          path:'/WorkExhibition',
          query:this.workObj
        });
        window.open(routeUrl.href,'_blank');
      },
      //修改作品信息
      modify(){
        let routeUrl = this.$router.resolve({
          path:'/ModifyWork',
          query:this.workObj
        });
        window.open(routeUrl.href,'_self');
      },
      delSelf(){
        this.$emit('delSelf');
      }
    }
  }
</script>

<style scoped>
  .worksCart{
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 1rem;
    background-color: #fff;
    border-radius: .03rem;
    margin-bottom: .05rem;
  }
  .works-content{
    display: flex;
    width: 100%;
    height: 80%;
    padding: 0 .1rem;
  }
  .works-img{
    width: .8rem;
    height: 100%;
    background: chartreuse;
    border-radius: .02rem;
    margin-right: .1rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .works-info{
    /* width: 2.5rem; */
    height: 100%;

    margin-right: .1rem;
  }
  .works-title pre{
    font-size: .12rem;
    font-family: normal;
    margin-top: 0;
    margin-bottom: .1rem;
  }
  .works-time{
    font-size: .05rem;
    margin-bottom: .05rem;
  }
  .works-tag{
    
    height: .13rem;
    margin-bottom: .1rem;
  }
  .works-tag span{
    display: block;
    float: left;
    height: .13rem;
    font-size: .05rem;
    line-height: .13rem;
    text-align: center;
    padding: 0 .05rem;
  }
  .works-meta div{
    display: block;
    float: left;
    margin-right: .1rem;
    font-size: .1rem;
  }
  .works-meta span{
    /* display: block; */
    /* float: left; */
    font-size: .05rem;
  }
  .works-operation{
    position: absolute;
    right: 0.2rem;
    top: 50%;
    transform: translateY(-50%);
    height: 100%;
    display: flex;
    align-items: center;
  }
  .works-operation button{
    margin-left: .05rem;
  }
  .works-operation i{
    font-size: .1rem;
    cursor: pointer;
  }
</style>