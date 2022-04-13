import request from "utils/axios";   

export const getRequisites = (params) => request({method: 'get', url: "/requisite", params})
export const postRequisites = (data) => request({method: 'post', url:"/requisite", data})
export const getRequisiteById = (id) => request({method: 'get' , url: `/requisite/${id}`})
export const updateRequisite = (data) => request({method: 'put', url: '/requisite', data})
export const deleteRequsite = (id) => request({method: 'delete', url: `/requisite/${id}`})