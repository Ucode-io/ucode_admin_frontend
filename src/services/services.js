import request from "utils/axios";  

export const postService = (data) => request({method: 'post', url: '/product', data})
export const getServiceList = (params) => request({method: 'get', url: '/product', params})
export const getServiceById = (id) => request({method: 'get', url: `/product/${id}`})
export const updateService = (data) => request({method: 'put', url: "/product", data})
export const deleteService = (id) => request({method: 'delete', url: `/product/${id}`})