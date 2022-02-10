import request from '../utils/axios'

export const getUserRoles = (params) => request({ method: 'get', url: '/user-roles', params })
