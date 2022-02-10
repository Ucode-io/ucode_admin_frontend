// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from '../utils/axios'

export const getSettlements = (params) => request({ method: 'get', url: '/settlements-all', params })
export const getOneSettlement = (id, params) => request({ method: 'get', url: `/settlements/${id}`, params })
export const postSettlement = (data, params) => request({ method: 'post', url: '/settlements', data, params })
