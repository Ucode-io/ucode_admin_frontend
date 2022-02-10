import request from "../utils/axios"

export const getCompanyCategories = (params) =>
  request({ method: "get", url: "/company_category", params })
export const deleteCompanyCategory = (id) =>
  request({ method: "delete", url: `/company_category/${id}` })
export const getOneCompanyCategory = (id) =>
  request({ method: "get", url: `/company_category/${id}` })
export const postCompanyCategory = (data, params) =>
  request({ method: "post", url: "/company_category", data, params })
export const updateCompanyCategory = (category_id, data, params) =>
  request({
    method: "put",
    url: `/company_category/${category_id}`,
    data,
    params,
  })
export const getCategories = (params) =>
  request({ method: "get", url: "/category", params })
