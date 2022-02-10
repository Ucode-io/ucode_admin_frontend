import request from '../utils/axios'

export const getCourierTypes = (params) => request({ method: 'get', url: '/courier_type', params })
export const deleteCourierType = (id) => request({ method: 'delete', url:`/courier_type/${id}`})
export const getCourierType = (id) => request({ method: 'get', url: `/courier_type/${id}` })
export const postCourierType = (data, params) => request({ method: 'post', url: '/courier_type', data, params })
export const updateCourierType = (courier_type_id, data, params) => request({ method: 'put', url: `/courier_type/${courier_type_id}`, data, params })
