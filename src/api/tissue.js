import request from "@/axios";

export function queryFamilyUser(id) {
    return request({
        url: '/tissue/family/query/user/'+id,
        method: 'get'
    })
}
export function queryFamily() {
    return request({
        url: '/tissue/family/query',
        method: 'get'
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
        url: '`/tissue/family/query/list`',
        method: 'post',
        data: {
            ...params
        }
    })
}


export function deleteFamilyUser(id){
    return request({
        url: '/tissue/family/delete/user/'+id,
        method: 'put'
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
export function queryFamilyRecord(params){
    return request({
        url: '/tissue/family/query/record',
        method: 'post',
        data: {
            ...params
        }
    })
}
