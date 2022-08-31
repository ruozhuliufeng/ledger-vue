import request from "@/axios";

export function common(loginForm) {
    return request({
        url: '/login?' + loginForm,
        method: 'post',
        data: {}
    })
}

export function getCaptcha() {
    return request({
        url: '/base/captcha',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'post'
    })
}

export function getUserInfo() {
    return request({
        url: "/base/user/info",
        method: 'get'
    })
}

export function updatePass(params) {
    return request({
        url: '/base/update/password',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function queryReport(){
    return request({
        url: '/base/query/report',
        method: 'get'
    })
}

export function queryUserTotal(){
    return request({
        url: '/base/query/total',
        method: 'get'
    })
}
export function queryTradeReport(){
    return request({
        url: '/base/query/trade/report',
        method: 'get'
    })
}
