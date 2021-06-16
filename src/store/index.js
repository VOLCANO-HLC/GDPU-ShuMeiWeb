import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import spaceModule from './modules/spaceModule'
import workExhibition from './modules/workExhibition'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    //要缓存的组件数组
    catchArr:[],
    //用户信息
    userInfo:{},
    //作者信息
    authorInfo:{},
    //作品信息
    workDetail:{},
    //用户未读消息数量
    noReadMessage:[],
    //用户空间颜色
    spaceColor:'',
    //用户字体颜色
    textColor:'',
  },
  getters,
  mutations,
  actions,
  modules: {
    spaceModule,
    workExhibition
  }
});
