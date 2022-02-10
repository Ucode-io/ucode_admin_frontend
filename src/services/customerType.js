import request from '../utils/axios'

export const getCustomerType = (params) => request({ method: 'get', url: '/customer_type', params })