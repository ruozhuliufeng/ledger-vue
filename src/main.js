import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import request from "@/axios";
import global from './globalFun'

Vue.use(Element)
Vue.prototype.$axios = request

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
