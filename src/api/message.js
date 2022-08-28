import request from "@/axios";

export function queryReadMessage() {
    return request({
        url: '/system/message/query/read/list',
        method: 'get'
    })
}

export function queryNoReadMessage() {
    return request({
        url: '/system/message/query/no/read/list',
        method: 'get'
    })
}

export function confirmMessage(id) {
    return request({
        url: '/system/message/confirm/' + id,
        method: 'get'
    })
}

export function readMessage(id) {
    return request({
        url: '/system/message/read/' + id,
        method: 'get'
    })
}
