import request from "utils/axios_v2";

export const getBrands = async (params) => {
  return await request({ method: "get", url: `/brand`, params });
};
export const getBrand = async (id, params) => {
  return await request({ method: "get", url: `/brand/${id}`, params });
};
export const deleteBrand = async (id) => {
  return await request({ method: "delete", url: `/brand/${id}` });
};
export const postBrand = async (data, params) => {
  return await request({ method: "post", url: `/brand`, data, params });
};
export const updateBrand = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/brand/${id}`,
    data,
    params,
  });
};
