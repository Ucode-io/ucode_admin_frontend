import request from "utils/axios_v2";

export const getRates = async (params) => {
  return await request.request({ method: "get", url: `/rate`, params });
};
export const getRate = async (id, params) => {
  return await request({ method: "get", url: `/rate/${id}`, params });
};
export const deleteRate = async (id) => {
  return await request({ method: "delete", url: `/rate/${id}` });
};
export const postRate = async (data, params) => {
  return await request({ method: "post", url: `/rate`, data, params });
};
export const updateRate = async (id, data, params) => {
  return await request({ method: "put", url: `/rate/${id}`, data, params });
};
