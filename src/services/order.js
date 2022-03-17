// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE/PATCH operations

import request from "utils/axios";

export const getOrders = (params) =>
  request({ method: "get", url: "/order", params });
export const getOneOrder = (order_id, params) =>
  request({ method: "get", url: `/order/${order_id}`, params });
export const postOrder = (data, params) =>
  request({
    method: "post",
    url: "/ondemand-order",
    data,
    params
    // headers: { shipper_id: "a3361f16-3076-4d50-83bd-38cc9dede994" },
  });
export const updateOrder = (order_id, data, params) =>
  request({ method: "put", url: `/order/${order_id}`, data, params });
export const getCountOrder = (params) =>
  request({ method: "get", url: "/orders-count-by-statuses", params });
export const changeOrderStatus = (id, data, shipperId) =>
  request({
    method: "patch",
    url: `/order/${id}/change-status${
      shipperId ? `?shipper_id=${shipperId}` : ""
    }`,
    data,
  });
