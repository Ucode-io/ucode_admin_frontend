// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from '../utils/axios'

export const getShippers = (params) => request({ method: 'get', url: '/shippers', params })
export const getOneShipper = (id, params) => request({ method: 'get', url: `/shippers/${id}`, params })
