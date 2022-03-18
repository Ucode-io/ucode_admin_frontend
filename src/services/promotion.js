import request from "../utils/axios"

export const getPromos = (params) => request({method: "get", url: "/promo", params})
export const getPayme = (params) => request({method: "get", url: "/payme-info", params})
export const postPayme = (data,params) => request({method: "post", url: "/payme-info", data,params})
export const getOnePayme = (id,params) => request({method: "get", url: `/payme-info/${id}`, id,params})
export const updatePayme = (data,id) => request({method: "put", url: `/payme-info/${id}`, data,id})
export const deletePayme = (id,params) => request({method: "delete", url: `/payme-info/${id}`, params})
export const getClick = (params) => request({method: "get", url: "/click-info", params})
export const postClick = (data,params) => request({method: "post", url: "/click-info", data,params})
export const getOneClick = (id,params) => request({method: "get", url: `/click-info/${id}`, id,params})
export const updateClick = (data,id) => request({method: "put", url: `/click-info/${id}`, data,id})
export const deleteClick = (id,params) => request({method: "delete", url: `/click-info/${id}`, params})
export const deletePromo = (id) => request({ method: 'delete', url:`/promo/${id}`})
export const getPromo = (id) => request({ method: 'get', url: `/promo/${id}` })
export const postPromo = (data, params) => request({ method: 'post', url: '/promo', data, params })
export const updatePromo = (id, data, params) => request({ method: 'put', url: `/promo/${id}`, data, params })


export const savePromotion = (data) =>
    request({ method: "post", url: "/promotion", data })
export const getOnePromotion = (id, params) =>
    request({ method: "get", url: `/promotion/${id}`, params })
