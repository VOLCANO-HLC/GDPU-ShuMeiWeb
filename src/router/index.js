import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import VueCookies from 'vue-cookies'
import {request} from '@/network/request';
import api_list from '@/network/api_list';
const Home = () => import('@/components/Home.vue');
const Login = () => import('@/components/Login.vue');
const Register = () => import('@/components/Register.vue');
const FindPass = () => import('@/components/FindPass.vue');
const UserSpace = () => import('@/components/UserSpace.vue');
const UpWork = () => import('@/components/UpWork.vue');
const ModifyWork = () => import('@/components/ModifyWork.vue');
const WorkExhibition = () => import('@/components/WorkExhibition.vue');
const Search = () => import('@/components/Search.vue');
const WorksType = () => import('@/components/WorksType.vue');
const AuthorSpace = () => import('@/components/AuthorSpace.vue');

const feedList = () => import('@/components/common/feedList.vue');
const fansList = () => import('@/components/common/fansList.vue');
const followList = () => import('@/components/common/followList.vue');
const worksList = () => import('@/components/common/worksList.vue');
const collectList = () => import('@/components/common/collectList.vue');
const messageList = () => import('@/components/common/messageList.vue');

Vue.use(VueRouter)
Vue.use(VueCookies);


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta:{
      title:'首页'
    }
  },{
    path: '/Register',
    name: 'Register',
    component: Register,
    meta:{
      title:'注册'
    }
  },{
    path: '/Login',
    name: 'Login',
    component: Login,
    meta:{
      title:'登录'
    }
  },{
    path: '/FindPass',
    name: 'FindPass',
    component: FindPass,
    meta:{
      title:'找回密码'
    }
  },{
    path: '/UserSpace',
    name: 'UserSpace',
    component: UserSpace,
    redirect:'/UserSpace/feedList',
    children:[
      {
        path:'/UserSpace/feedList',
        name:'feedList',
        component: feedList,
        meta:{
          title:'动态'
        }
      },
      {
        path:'/UserSpace/fansList',
        name:'fansList',
        component: fansList,
        meta:{
          title:'粉丝'
        }
      },
      {
        path:'/UserSpace/followList',
        name:'followList',
        component: followList,
        meta:{
          title:'关注'
        }
      },
      {
        path:'/UserSpace/worksList',
        name:'worksList',
        component: worksList,
        meta:{
          title:'作品'
        }
      },
      {
        path:'/UserSpace/collectList',
        name:'collectList',
        component: collectList,
        meta:{
          title:'收藏'
        }
      },
      {
        path:'/UserSpace/messageList',
        name:'messageList',
        component: messageList,
        meta:{
          title:'消息'
        }
      }
    ],
    meta:{
      title:'用户中心'
    }
  },{
    path: '/UpWork',
    name: 'UpWork',
    component: UpWork,
    meta:{
      title:'投稿 '
    }
  },{
    path: '/ModifyWork',
    name: 'ModifyWork',
    component: ModifyWork,
    meta:{
      title:'编辑作品'
    }
  },{
    path: '/WorkExhibition',
    name: 'WorkExhibition',
    component: WorkExhibition,
    meta:{
      title:'作品展示'
    }
  },{
    path: '/Search',
    name: 'Search',
    component: Search,
    meta:{
      title:'搜索'
    }
  },{
    path: '/WorksType',
    name: 'WorksType',
    component: WorksType,
    meta:{
      title:'作品分类'
    }
  },{
    path: '/AuthorSpace',
    name: 'AuthorSpace',
    component: AuthorSpace,
    
    meta:{
      title:'作者空间'
    }
  }
]



const router = new VueRouter({
  routes
})
//路由守卫实现，跳转时改变title
router.beforeEach((to, from, next)=>{
  document.title = to.meta.title;
  next();
});
router.afterEach((to, from) => {
  request({
    url: api_list.api_getUserInfo,
    method: 'get'
  }).then(res => {
    console.log(res)
    // 如果token过期，就重新登录
    if(res.code === 28004){
      if(to.name !== 'Login'){
        router.push({path: '/Login'})
      }
    }
    // 保存token, 用户id
    if(res.success){
      store.commit('updateUserInfo', res.data.item);
      store.commit('updateSpaceColor', res.data.item.color);
      store.commit('updateSpaceTextColor', res.data.item.textColor);
      if(!$cookies.isKey('user_id')){
        $cookies.set('user_id',res.data.item.id,3*24*60*60);
      }
    }
  })
})
export default router
