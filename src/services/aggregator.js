// Here you can set services. Inside Object, you can define
// POST/PUT/GET/DELETE operations

import request from "utils/axios";

export const getAggregators = (params) =>
  request({ method: "get", url: "/aggregator", params });
export const getAggregator = (id, params) =>
  request({ method: "get", url: `/aggregator/${id}`, params });
export const deleteAggregator = (id) =>
  request({ method: "delete", url: `/aggregator/${id}` });
export const postAggregator = (data, params) =>
  request({ method: "post", url: "/aggregator", data, params });
export const updateAggregator = (id, data, params) =>
  request({ method: "put", url: `/aggregator/${id}`, data, params });
