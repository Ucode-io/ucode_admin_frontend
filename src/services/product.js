// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "utils/axios";

export const getProducts = (params, shipper_id) =>
  request({
    headers: { Shipper: shipper_id },
    method: "get",
    url: "/product",
    params,
  });
export const getOneProduct = (id, params, shipper_id) =>
  request({
    headers: { Shipper: shipper_id },
    method: "get",
    url: `/product/${id}`,
    params,
  });
export const postProduct = (data, params) =>
  request({ method: "post", url: "/product", data, params });
export const updateProduct = (id, data, params) =>
  request({ method: "put", url: `/product/${id}`, data, params });
export const productChange = (id, data, params) =>
  request({ method: "put", url: `/product_change_active/${id}`, data, params });
export const deleteProduct = (id) =>
  request({ method: "delete", url: `/product/${id}` });
