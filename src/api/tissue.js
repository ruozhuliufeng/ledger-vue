import request from "@/axios";

export function queryFamilyUser(params) {
    return request({
        url: '/tissue/family/query/user',
        method: 'get',
        data: {
            ...params
        }
    })
}

export function createFamily(params) {
    return request({
        url: '/tissue/family/save',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function updateFamily(params) {
    return request({
        url: '/tissue/family/update',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function deleteFamily(id) {
    return request({
        url: '/tissue/family/delete/' + id,
        method: 'get'
    })
}

export function queryFamilyList(params) {
    return request({
        url: '/tissue/family/query/list',
        method: 'post',
        data: {
            ...params
        }
    })
}


export function deleteFamilyUser(params){
    return request({
        url: '/tissue/family/delete/user/list',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function updateFamilyUser(params){
    return request({
        url: '/tissue/family/update/user',
        method: 'post',
        data: {
            ...params
        }
    })
}
