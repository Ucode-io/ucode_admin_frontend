// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "utils/axios";

export const getCustomers = (params) =>
  request({ method: "get", url: "/customers", params });
export const deleteCustomer = (id) =>
  request({ method: "delete", url: `/customers/${id}` });
export const getOneCustomer = (id, params) =>
  request({ method: "get", url: `/customers/${id}`, params });
export const postCustomer = (data, params) =>
  request({ method: "post", url: "/customers", data, params });
export const updateCustomer = (id, data, params) =>
  request({ method: "put", url: `/customers/${id}`, data, params });
