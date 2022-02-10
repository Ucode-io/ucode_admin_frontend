// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE operations

import request from "../utils/axios"

export const getFares = (params) => request({ method: "get", url: "/fares", params })
export const getFare = (id, params) => request({ method: "get", url: `/fares/${id}`, params })
export const deleteFare = (id) => request({ method: "delete", url: `/fares/${id}` })
export const postFare = (data, params) => request({ method: "post", url: "/fares", data, params })
export const updateFare = (id, data, params) => request({ method: "put", url: `/fares/${id}`, data, params })
