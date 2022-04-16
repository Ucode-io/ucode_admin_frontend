import request from "utils/axios";   

export const postCategory = (data) => request({method: 'post', url: '/category', data})
export const getCategoriesList = () => request({method: 'get', url: '/category'})
export const getCategoryById = (id) => request({method: 'get', url: `/category/${id}`})
export const updateCategory = (data) => request({method: 'put', url: '/category', data})