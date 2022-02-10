import request from '../utils/axios'

export const getNews = (params) => request({ method: 'get', url: '/news', params })
export const deleteNew = (id) => request({ method: 'delete', url:`/news/${id}`})
export const getOneNew = (id) => request({ method: 'get', url: `/news/${id}` })
export const postNew = (data, params) => request({ method: 'post', url: '/news', data, params })
export const updateNew = (new_id, data, params) => request({ method: 'put', url: `/news/${new_id}`, data, params })
