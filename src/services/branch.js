import request from "utils/axios"; 

export const postBranch = (data) => request({method: 'post', url: '/branch', data})
export const getBranchList = (data) => request({method: 'get', url: '/branch'})
export const deleteBranch = (id) => request({method: 'delete', url: `/branch/${id}` })
export const getBranchById = (id) => request({method: 'get', url: `/branch/${id}`})
export const updateBranch = (data) => request({method: 'put', url: `/branch`, data})