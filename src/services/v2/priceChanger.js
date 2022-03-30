import request from "utils/axios_v2";

export const getPriceChangers = async (params) => {
  return await request.request({
    method: "get",
    url: `/price-changer`,
    params,
  });
};
export const getPriceChanger = async (id, params) => {
  return await request({ method: "get", url: `/price-changer/${id}`, params });
};
export const deletePriceChanger = async (id) => {
  return await request({ method: "delete", url: `/price-changer/${id}` });
};
export const postPriceChanger = async (data, params) => {
  return await request({ method: "post", url: `/price-changer`, data, params });
};
export const updatePriceChanger = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/price-changer/${id}`,
    data,
    params,
  });
};
