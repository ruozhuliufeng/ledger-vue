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
