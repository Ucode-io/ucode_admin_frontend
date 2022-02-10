// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "../utils/axios"

export const getDeliveryPrice = (params) =>
  request({ method: "get", url: "/delivery-price", params })
export const getComputeDeliveryPrice = (data) =>
  request({ method: "patch", url: "/fares/compute-price", data })
