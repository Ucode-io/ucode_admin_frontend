import request from "../utils/axios"

export const getPromotions = (params) =>
  request({ method: "get", url: "/promotion", params })
export const savePromotion = (data) =>
  request({ method: "post", url: "/promotion", data })
export const getOnePromotion = (id, params) =>
  request({ method: "get", url: `/promotion/${id}`, params })
