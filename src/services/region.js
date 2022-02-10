import request from '../utils/axios'

export const getRegions = (params) => request({ method: 'get', url: '/region', params })
export const deleteRegion = (id) => request({ method: 'delete', url:`/region/${id}`})
export const getOneRegion = (id) => request({ method: 'get', url: `/region/${id}` })
export const postRegion = (data, params) => request({ method: 'post', url: '/region', data, params })
export const updateRegion = (region_id, data, params) => request({ method: 'put', url: `/region/${region_id}`, data, params })

