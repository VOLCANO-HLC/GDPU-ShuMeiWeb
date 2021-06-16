import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueCookies from 'vue-cookies'
import '@/assets/icons/iconfont/iconfont.css'

import { Button, Dialog, Icon, Sidebar, SidebarItem, Uploader, Toast, ImagePreview,Progress
,Checkbox, CheckboxGroup, Cell, CellGroup, Loading, Overlay, RadioGroup, Radio} from 'vant';
import infiniteScroll from 'vue-infinite-scroll'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/resetCss/commonCss.css'
import './rem'
import './assets/resetCss/reIndex.css'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueCookies);
Vue.use(infiniteScroll);
Vue.use(Button).use(Dialog).use(Icon).use(Sidebar).use(SidebarItem).use(Uploader)
.use(Toast).use(ImagePreview).use(Progress).use(Checkbox).use(CheckboxGroup)
.use(Cell).use(CellGroup).use(Loading).use(Overlay).use(RadioGroup).use(Radio)



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
