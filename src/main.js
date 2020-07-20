// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//axios
import Axios from './utils/axios.js'
// 允许携带cookie
// Axios.defaults.withCredentials=true
// import {BASEURL} from '../static/js/api.js'
// Axios.defaults.baseURL= BASEURL;
Vue.prototype.$ = Axios;


//底部组件
import FooterNav from './components/FooterNav.vue'
Vue.component('FooterNav', FooterNav)

//动态设置html字体大小
import '../static/js/flexible.js'
//mui样式库
import './assets/mui/css/mui.css'
import mui from './assets/mui/js/mui.js'
Vue.prototype.mui=mui;

//解决移动端点击300ms延迟
import fastClick from 'fastclick'
fastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
