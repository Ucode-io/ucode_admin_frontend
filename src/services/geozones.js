import request from "../utils/axios"

export const postGeozone = (data, params) =>
  request({ method: "post", url: "/geozones", data, params })
export const getOneGeozone = (id) =>
  request({ method: "get", url: `/geozones/${id}` })
export const updateGeozone = (geozone_id, data, params) =>
  request({ method: "put", url: `/geozones/${geozone_id}`, data, params })
