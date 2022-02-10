// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "../utils/axios"

export const getMenus = (params) =>
  request({ method: "get", url: "/menu", params })
export const getIngredient = (id, params) =>
  request({ method: "get", url: `/ingredients/${id}`, params })
export const postIngredients = (data, params) =>
  request({ method: "post", url: "/ingredients", data, params })
export const updateIngredients = (id, data, params) =>
  request({ method: "put", url: `/ingredient/${id}`, data, params })
