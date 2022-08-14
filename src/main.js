import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import dataV from '@jiaminghi/data-view'
import "element-ui/lib/theme-chalk/index.css"
import request from "@/axios";
import global from './globalFun'
import RightToolBar from "@/views/components/RightToolBar";

// 全局组件挂载
Vue.component("RightToolBar",RightToolBar)


Vue.use(dataV)
Vue.use(Element)
Vue.prototype.$axios = request

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
