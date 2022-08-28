import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import dataV from '@jiaminghi/data-view'
import "element-ui/lib/theme-chalk/index.css"
import request from "@/axios";
import modal from "@/plugins/modal";
import global from './globalFun'
import RightToolBar from "@/views/components/RightToolBar";
import moment from "moment";
// 样式
// import '@/assets/styles/element-variables.scss'
// import '@/assets/styles/index.scss'
import '@/assets/icons'

// 全局组件挂载
Vue.component("RightToolBar",RightToolBar)


Vue.use(dataV)
Vue.use(Element)
Vue.prototype.$axios = request
// 模态框对象
Vue.prototype.$modal = modal
// 时间格式化
Vue.prototype.$moment = moment

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
