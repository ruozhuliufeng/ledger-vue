import request from "@/axios";

export function queryRecordList(params) {
    return request({
        url: '/record/list',
        method: 'get',
        data: {
            ...params
        }
    })
}

export function saveRecord(params) {
    return request({
        url: '/record/save',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function updateRecord(params) {
    return request({
        url: '/record/update',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function queryRecord(id) {
    return request({
        url: '/record/info/' + id,
        method: 'get'
    })
}


export function deleteRecordList(params) {
    return request({
        url: '/record/delete',
        method: 'post',
        data: {
            ...params
        }
    })
}
export function queryRecordCategoryList() {
    return request({
        url: '/record/query/category/list',
        method: 'get'
    })
}

export function importThirdRecordList(params) {
    return request({
        headers:{
            "Content-Type": "multipart/form-data"
        },
        url: '/record/import/third/record',
        method: 'post',
        data: {
            ...params
        }
    })
}


