// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from '../utils/axios'

export const getMenus = (params) => request({ method: 'get', url: '/menu', params })
export const getOneMenu = (id, params) => request({ method: 'get', url: `/menu/${id}`, params })
export const postMenu = (data, params) => request({ method: 'post', url: '/menu', data, params })
export const getJowiMenu = (params) => request({ method: 'get', url: '/jowi/menu', params })
export const getProduct = (params) => request({ method: 'get', url: '/product', params })
export const postProduct = (id, data) => request({ method: 'put', url: `/product/${id}`, data })
export const putBranches = (id, data) => request({ method: 'put', url: `/branches/${id}`, data })
export const updateMenu = (id, data, params) => request({ method: 'put', url: `/menu/${id}`, data, params })
