// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from '../utils/axios'

export const branchUsers = (params) => request({ method: 'get', url: '/branch-users', params })
export const deleteBranchUser = (id) => request({ method: 'delete', url:`/branch-users/${id}`})
export const getOneBranchUser = (id, params) => request({ method: 'get', url: `/branch-users/${id}`, params })
export const postBranchUser = (data, params) => request({ method: 'post', url: '/branch-users', data, params })
export const updateBranchUser = (id, data, params) => request({ method: 'put', url: `/branch-users/${id}`, data, params })
