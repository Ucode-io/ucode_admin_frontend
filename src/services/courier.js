import request from "utils/axios";

export const getCouriers = (params) =>
  request({ method: "get", url: "/couriers", params });
export const deleteCourier = (id) =>
  request({ method: "delete", url: `/couriers/${id}` });
export const getCourier = (id) =>
  request({ method: "get", url: `/couriers/${id}` });
export const postCourier = (data, params) =>
  request({ method: "post", url: "/couriers", data, params });
export const updateCourier = (courier_id, data, params) =>
  request({ method: "put", url: `/couriers/${courier_id}`, data, params });
