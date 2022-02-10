import request from '../utils/axios'

export const getBanners = (params) => request({ method: 'get', url: '/banner', params })
export const deleteBanner = (id) => request({ method: 'delete', url:`/banner/${id}`})
export const getOneBanner = (id) => request({ method: 'get', url: `/banner/${id}` })
export const postBanner = (data, params) => request({ method: 'post', url: '/banner', data, params })
export const updateBanner = (banner_id, data, params) => request({ method: 'put', url: `/banner/${banner_id}`, data, params })
