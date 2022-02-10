// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from '../utils/axios'

const requests = {
    getFares: (params) => request({ method: 'get', url: '/fares', params }),
    getMenus: (params) => request({ method: 'get', url: '/menu' , params })
}
export default requests