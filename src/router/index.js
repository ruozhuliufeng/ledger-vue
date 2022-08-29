import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Index from '../views/Index.vue'
import axios from "../axios";
import store from "../store"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/index',
                name: 'Index',
                meta: {
                    title: "首页"
                },
                component: Index
            },
            {
                path: '/userCenter',
                name: 'UserCenter',
                meta: {
                    title: "个人中心"
                },
                component: () => import('@/views/common/UserCenter.vue')
            },
        ]
    },

    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {

    let hasRoute = store.state.menus.hasRoutes
    let waitMsgNum = store.state.waitMsgNum
    let token = localStorage.getItem("token")

    if (to.path === '/login') {
        next()

    } else if (!token) {
        next({path: '/login'})


    } else if (token && !hasRoute) {
        axios.get("/system/menu/nav", {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res => {
            // 拿到menuList
            store.commit("setMenuList", res.data.data.nav)
            // 拿到用户权限
            store.commit("setPermList", res.data.data.authoritys)
            // 动态绑定路由
            let newRoutes = router.options.routes

            res.data.data.nav.forEach(menu => {
                if (menu.children) {
                    menu.children.forEach(e => {

                        // 转成路由
                        let route = menuToRoute(e)

                        // 吧路由添加到路由管理中
                        if (route) {
                            newRoutes[0].children.push(route)
                        }

                    })
                }
            })
            router.addRoutes(newRoutes)
            hasRoute = true
            store.commit("changeRouteStatus", hasRoute)
        })
    } else if (token) {
        // 更新未读数量
        axios.get('/system/message/query/wait/message/num', {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then(res => {
            store.commit("SET_WAIT_MSG_NUM", res.data.data)
        })
    }


    next()
})


// 导航转成路由
const menuToRoute = (menu) => {

    if (!menu.component) {
        return null
    }

    let route = {
        name: menu.name,
        path: menu.path,
        meta: {
            icon: menu.icon,
            title: menu.title
        }
    }
    route.component = () => import('@/views/' + menu.component + '.vue')

    return route
}

export default router
