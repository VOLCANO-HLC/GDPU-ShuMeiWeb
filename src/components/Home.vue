<template>
  <div class="home clearFix">
    <commonHeader :isFixed="true"></commonHeader>
    <div class="swipe-imgs">
      <el-carousel  height="4rem">
        <el-carousel-item v-for="item in recommendWorks" :key="item.id">
          <div class="hot-work" :style="{backgroundImage:'url(' + item.cover + ')'}"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 优势 -->
    <div class="advantages">
      <h3 class="advantages-title title"><span>功能</span></h3>
      <p class="advantages-sign sign">避免踩坑</p>
      <div class="advantages-list">
        <li v-for="(advantItem, index) in advantList" :key="index">
          <advantageItem :advantObj="advantItem"></advantageItem>
        </li>
      </div>
    </div>
    <!-- 优势 -->
    <!-- 目标 -->
    <div class="target-nav">
      <h3 class="target-title"><span>————————————————————————</span> 目标 <span>————————————————————————</span></h3>
      <p class="target-sign">致力于构建一个能让广药数媒专业学子进行创意交流展示的平台</p>
    </div>
    <!-- 目标 -->
    <!-- 学习方向 -->
    <div class="learn-nav">
      <h3 class="title"><span>方向</span></h3>
      <p class="sign">找准自己的方向, 努力向前冲</p>
      <div class="learn-list">
        <li v-for="(learnItem, index) in learnNavList" :key="index">
          <learnModule :learnObj="learnItem"></learnModule>
        </li>
      </div>
    </div>
    <!-- 学习方向 --> 
    <!-- 作品分类 -->
    <div class="work-sort">
      <div class="mark">
        <h3 class="sort-title">作品分类</h3>
        <div class="work-type">
          <li v-for="(typeItem, index) in workTypeList" :key="index">
            <workTypeModule :workTypeObj="typeItem" @click="gotoWorksType(typeItem.id)"></workTypeModule>
          </li>
        </div>
      </div>
    </div>
    <!-- 作品分类 -->
    <!-- 关于我们 -->
    <div class="about-us">
      <h3 class="title"><span>关于</span></h3>
      <p class="sign">广药数媒工作室</p>
      <div class="about-content">
        <div class="about-img"></div>
        <div class="about-sign">广药数媒工作室位于广东药科大学中山校区，是本校数字媒体技术专业的学生进行学习与项目创作的平台。当前工作室团队约十人左右，主要从事游戏开发、网络平台开发、影视动画等数媒专业方向的开发创作。</div>
      </div>
    </div>
    <!-- 关于我们 -->
    <commonFooter></commonFooter>
  </div>
</template>

<script>
import {request} from '@/network/request'
import api_list from '@/network/api_list'
import commonHeader from './common/CommonHeader'
import advantageItem from './common/advantageItem'
import learnModule from './common/learnModule'
import workTypeModule from './common/workTypeModule'
import commonFooter from './common/commonFooter'
import qs from 'qs'
import '../assets/resetCss/reComment.css'
import '../assets/resetCss/commonCss.css'
export default {
  name: 'HelloWorld',
  data(){
    return{
      //数据加载完成
      isLoad:false,
      //滚轮滚动的距离
      scrollDistance:0,
      // 优势
      advantList: [{
        name: '学习资源',
        icon: 'iconfont icon-ziyuan1'
      },
      {
        name: '作品交流',
        icon: 'iconfont icon-collaboration-system'
      },
      {
        name: '在线学习',
        icon: 'iconfont icon-xianshanglianjie'
      },
      {
        name: '脱离课堂',
        icon: 'iconfont icon-zhihuiketang'
      },
      {
        name: '快速入门',
        icon: 'iconfont icon-huojian'
      },
      {
        name: '展示作品',
        icon: 'iconfont icon-dapingzhanshi'
      },],
      // 学习方向
      learnNavList: [{
        name: '动画',
        describe: '每个细节都用心创造',
        icon: 'iconfont icon-dianshizhiboguankanshipinbofangmeiti'
      },
      {
        name: '影视后期',
        describe: '',
        icon: 'iconfont icon-shexiangji'
      },
      {
        name: '三维模型',
        describe: '',
        icon: 'iconfont icon-sanwei'
      },
      {
        name: '游戏开发',
        describe: '',
        icon: 'iconfont icon-huojian'
      },
      {
        name: 'web前端/小程序',
        describe: '',
        icon: 'iconfont icon-wangye'
      },
      {
        name: '绘画',
        describe: '',
        icon: 'iconfont icon-V'
      },
      {
        name: '安卓手机app开发',
        describe: '',
        icon: 'iconfont icon-app'
      },
      {
        name: '后端',
        describe: '',
        icon: 'iconfont icon-houduankaifa'
      },
      {
        name: '平面设计',
        describe: '',
        icon: 'iconfont icon-chizi'
      }],
      //作品分类对象
      workTypeList:[
        {
          id:'1',
          icon:'iconfont icon-dianshiju',
          name:'动画',
          describe:'每个细节都用心创造'
        },
        {
          id:'2',
          icon:'iconfont icon-airudiantubiaohuizhi-zhuanqu_youxi',
          name:'游戏开发',
          describe:'少一个bug, 多一撮头发'
        },
        {
          id:'3',
          icon:'iconfont icon-iconset0129',
          name:'影视后期',
          describe:'世界尽在手中'
        },
        {
          id:'4',
          icon:'iconfont icon-huihua',
          name:'绘画',
          describe:'走进形色世界, 发掘美的真谛'
        },
        {
          id:'5',
          icon:'iconfont icon-wangye',
          name:'前/后端开发',
          describe:'在网络中创造属于自己的一片天地'
        },
        {
          id:'6',
          icon:'iconfont icon-app',
          name:'手机app开发',
          describe:'走进形色世界, 发掘美的真谛'
        },
        {
          id:'7',
          icon:'iconfont icon-shitusanweishitu',
          name:'三维建模',
          describe:'枯燥与乏味的过程, 成就与幸福的余味'
        },
        {
          id:'8',
          icon:'iconfont icon-chizi',
          name:'平面设计',
          describe:'用图形开世界, 开启不一样的新视角'
        }
      ],
      // 显示专业介绍
      majorShow:false,
      //专业详情
      majorInfo:[
        {
          name:'色彩与素描',
          describe:'色彩同素描一样是造型艺术的重要形式和手段，是美术基础教学中最重要的科目之一。素描是运用单色的明暗和线条来塑造形象、表现空间、而色彩则是通过丰富多彩的颜色来表现景物。'
        },
        {
          name:'平面设计与制作',
          describe:''
        },
        {
          name:'三维动画设计与制作',
          describe:''
        },
        {
          name:'影视包装与制作',
          describe:''
        },
        {
          name:'三维特效与制作',
          describe:''
        },
        {
          name:'影视后期制作',
          describe:''
        },
        {
          name:'C语言程序设计',
          describe:''
        },
        {
          name:'数据结构',
          describe:''
        },
        {
          name:'面向对象程序设计',
          describe:''
        },
        {
          name:'游戏设计与开发',
          describe:''
        }
      ],
      
      //推荐作品
      recommendWorks:[],
    }
  },
  created(){
    if(this.$cookies.isKey('user_token')){
      // this.getUserInfo();
    }
    this.getRecomWorks();
  },
  components:{commonHeader,advantageItem,learnModule,workTypeModule,commonFooter},
  computed:{
    userObj(){
      this.isLoad = true;
      console.log(this.$store.state.userObj)
      return this.$store.state.userObj;
    }
  },
  mounted(){
    this.initListener();
    this.getWorkType();
  },
  methods:{
    // 获取作品分类
    getWorkType(){
      request({
        url: api_list.api_getAllWorksSortName,
        method: 'get'
      }).then(res => {
        // console.log(res.data)
      })
    },
    //加载用户数据
    // getUserInfo(){
    //   request({
    //     url:api_list.api_getUserInfo,
    //     method:'get'
    //   }).then(res => {
    //     // console.log(res)
    //     this.isLoad = true;
    //     this.userObj = res.data.item;
    //     this.$store.commit('updateUserInfo',this.userObj)
    //     //存放用户id
    //     if(!this.$cookies.isKey('user_id') && this.userObj){
    //       this.$cookies.set('user_id',this.userObj.id,3*24*60*60);
    //     }
    //   });
    // },
    // 初始化监听器
    initListener(){
      document.addEventListener('scroll',()=>{
        this.scrollDistance = window.pageYOffset;
        if(this.scrollDistance>200){
          this.majorShow = true;
        }
      });
    },
    //获取推荐作品
    getRecomWorks(){
      request({
        url:api_list.api_getRelatAllWork,
        method:'get',
        params:{
          page:1,
          limit:4,
          search:'?' + qs.stringify({hot:0})
        }
      }).then(res => {
        // console.log(res)
        if(res.success){
          this.recommendWorks = res.data.rows;
          this.isLoad = true;
        }
      });
    },
    //跳转作品分类页面
    gotoWorksType(_typeId){
      this.$router.push({path:'/WorksType', query:{typeId:_typeId}});
    },
  }
}
</script>

<style scoped>
  .home{
    position: relative;
    overflow-x: hidden;
    background-repeat: no-repeat;
    background-image: url('../assets/imgs/user_spaceImg.jpg');
    background-attachment: fixed;
  }
  .swipe-imgs{
    width: 100%;
    height: 4rem;
  }
  .inner{
    width: 6rem;
    margin: 0 auto;
  }
  .title{
    font-size: .3rem;
    color: #515353;
    text-align: center;
    padding: .1rem;
    margin: 0;
  }
  .title span{
    border-bottom: 5px solid rgb(0, 0, 0);
  }
  .sign{
    font-size: .1rem;
    text-align: center;
    color: #666666;
  }
  .target-title span{
    font-size: .1rem;
  }
  .advantages{
    padding: .5rem 0 .4rem 0;
    background-color: #fff;
  }
  .advantages-list{
    box-sizing: border-box;
    display: flex;
    width: 100%;
    padding: .1rem 1.5rem;
    flex-wrap: wrap;
    justify-content: space-between;
    /* border: 1px solid black; */
  }
  .advantages-list li{
    width: 2rem;
    height: 1rem;
    margin-bottom: .1rem;
    border: 1px solid rgb(151, 151, 151);
    background-color: #fff;
  }
  .target-nav{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 2rem;
    /* background-color: black; */
  }
  .target-title{
    font-size: .3rem;
    color: #fff;
    font-weight: 400;
    text-align: center;
    margin: .1rem 0;
  }
  .target-sign{
    font-size: .15rem;
    color: #fff;
    text-align: center;
    margin: 0;
  }
  .learn-nav{
    box-sizing: border-box;
    width: 100%;
    padding: .5rem .4rem;
    background-color: #fff;
  }
  .learn-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    /* height: 2rem; */
    /* border: 1px solid black; */
  }
  .learn-list li{
    width: 2.5rem;
    height: 1rem;
    /* border: 1px solid black; */
    margin: .1rem 0;
  }
  .sort-title{
    font-size: .3rem;
    text-align: center;
    margin: 0;
    color: #fff;
  }

  .hot-work{
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .work-sort{
    width: 100%;
    /* background-image: url('../assets/imgs/user_spaceImg.jpg'); */
  }
  .mark{
    width: 100%;
    padding: .5rem 0;
    background-color: rgba(0, 0, 0, 0.651);
  }
  .work-type{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: .3rem 1rem;
  }
  .work-type li{
    width: 3rem;
    height: 1rem;
    margin-bottom: .1rem;
  }
  .about-us{
    padding: 0 0 .5rem 0;
    background-color: #fff;
  }
  .about-content{
    display: flex;
    padding: 0 2rem;
  }
  .about-img{
    width: 40%;
    height: 2rem;
    /* border: 1px solid black; */
    background-size: cover;
    background-image: url('../assets/imgs/about.jpg')
  }
  .about-sign{
    width: 60%;
    box-sizing: border-box;
    font-size: .1rem;
    margin-left: .1rem;
    /* width: 5rem; */
    padding: 0 .5rem 0 0;
    text-indent: .2rem;
  }



  .type{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45%;
    height: 1.2rem;
  }
  .type-icon{
    width: .8rem;
    height: .8rem;
    border: 1px solid #fff;
    font-size: .3rem;
    color: #fff;
    text-align: center;
    line-height: .8rem;
    cursor: pointer;
  }
  .type-icon:hover{
    box-shadow: 0 0 15px rgb(255,255,255,.3);
  }
  .type-txt{
    width: 2rem;
    height: .8rem;
    margin-left: .1rem;
  }
  .type-name{
    font-size: .15rem;
    color: #fff;
    border-bottom: 1px dashed #fff;
  }
  .type-describe{
    font-size: .1rem;
    font-weight: 200;
    color: #fff;
    width: 100%;
    margin-top: .1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
  }
</style>
