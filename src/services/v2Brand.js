import request from "utils/axios_v2";

export const getV2Brands = async (params) => {
  return await request({ method: "get", url: `/brand`, params });
};
export const getV2Brand = async (id, params) => {
  return await request({ method: "get", url: `/brand/${id}`, params });
};
export const deleteV2Brand = async (id) => {
  return await request({ method: "delete", url: `/brand/${id}` });
};
export const postV2Brand = async (data, params) => {
  return await request({ method: "post", url: `/brand`, data, params });
};
export const updateV2Brand = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/brand/${id}`,
    data,
    params,
  });
};
