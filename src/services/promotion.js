import request from "../utils/axios"

export const getPromos = (params) => request({method: "get", url: "/promo", params})
export const deletePromo = (id) => request({ method: 'delete', url:`/promo/${id}`})
export const getPromo = (id) => request({ method: 'get', url: `/promo/${id}` })
export const postPromo = (data, params) => request({ method: 'post', url: '/promo', data, params })
export const updatePromo = (id, data, params) => request({ method: 'put', url: `/promo/${id}`, data, params })


export const savePromotion = (data) =>
    request({ method: "post", url: "/promotion", data })
export const getOnePromotion = (id, params) =>
    request({ method: "get", url: `/promotion/${id}`, params })
