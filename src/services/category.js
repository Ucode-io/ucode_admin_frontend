import request from "utils/axios";   

export const postCategory = (data) => request({method: 'post', url: '/category', data})
export const getCategoriesList = (params) => request({method: 'get', url: '/category', params})
export const getCategoryById = (id) => request({method: 'get', url: `/category/${id}`})
export const updateCategory = (data) => request({method: 'put', url: '/category', data})
export const deleteCategory = (id) => request({method: 'delete', url: `/category/${id}`})