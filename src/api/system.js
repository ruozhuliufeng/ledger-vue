import request from "@/axios";

export function queryUserList(params) {
    return request({
        url: '/system/user/list',
        method: 'get',
        data: {
            ...params
        }
    })
}

export function saveUser(params) {
    return request({
        url: '/system/user/save',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function updateUser(params) {
    return request({
        url: '/system/user/update',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function queryUser(id) {
    return request({
        url: '/system/user/info/' + id,
        method: 'get'
    })
}


export function deleteUserList(params) {
    return request({
        url: '/system/user/delete',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function repassUser(params) {
    return request({
        url: '/system/user/repass',
        method: 'post',
        data: {
            ...params
        }
    })
}


export function grantUserRole(id, params) {
    return request({
        url: '/system/user/role/' + id,
        method: 'post',
        data: {
            ...params
        }
    })
}

export function uploadUserAvatar(params) {
    return request({
        url: '/system/user/upload/avatar',
        method: 'post',
        data: params
    })
}

export function queryUserPhone(params){
    return request({
        url: '/system/user/query/user/phone',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function queryRoleList(params) {
    return request({
        url: '/system/role/list',
        method: 'get',
        data: {
            ...params
        }
    })
}

export function saveRole(params) {
    return request({
        url: '/system/role/save',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function updateRole(params) {
    return request({
        url: '/system/role/update',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function queryRole(id) {
    return request({
        url: '/system/role/info/' + id,
        method: 'get'
    })
}


export function deleteRoleList(params) {
    return request({
        url: '/system/role/delete',
        method: 'post',
        data: {
            ...params
        }
    })
}


export function grantRoleMenu(id, params) {
    return request({
        url: '/system/role/perms/' + id,
        method: 'post',
        data: {
            ...params
        }
    })
}


export function getMenuTree() {
    return request({
        url: '/system/menu/list',
        method: 'get',
    })
}

export function saveMenu(params) {
    return request({
        url: '/system/menu/save',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function updateMenu(params) {
    return request({
        url: '/system/menu/update',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function queryMenuInfo(id) {
    return request({
        url: '/system/menu/info/' + id,
        method: 'get',
    })
}

export function deleteMenu(id) {
    return request({
        url: '/system/menu/delete/' + id,
        method: 'post',
    })
}

export function queryDictList(parentId, params) {
    return request({
        url: '/system/dict/list/' + parentId,
        method: 'get',
        data: {
            ...params
        }
    })
}

export function queryDict(id) {
    return request({
        url: '/system/dict/query/' + id,
        method: 'get',
    })
}

export function saveDict(params) {
    return request({
        url: '/system/dict/save',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function updateDict(params) {
    return request({
        url: '/system/dict/update',
        method: 'post',
        data: {
            ...params
        }
    })
}

export function deleteDict(id) {
    return request({
        url: '/system/dict/delete/' + id,
        method: 'post',
    })
}
