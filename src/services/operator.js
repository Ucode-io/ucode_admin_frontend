import request from '../utils/axios'

export const getOperators = (params) => request({ method: 'get', url: '/shipper-users', params })
export const deleteOperator = (id) => request({ method: 'delete', url:`/shipper-users/${id}`})
export const getOperator = (id) => request({ method: 'get', url: `/shipper-users/${id}` })
export const postOperator = (data, params) => request({ method: 'post', url: '/shipper-users', data, params })
export const updateOperator = (courier_id, data, params) => request({ method: 'put', url: `/shipper-users/${courier_id}`, data, params })
