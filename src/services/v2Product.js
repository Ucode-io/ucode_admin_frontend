import request from "utils/axios_v2";

export const getV2Goods = async (params) => {
  return await request({
    method: "get",
    url: `/product`,
    params,
  });
};
export const getV2Good = async (id, params) => {
  return await request({
    method: "get",
    url: `/product/${id}`,
    params,
  });
};
export const deleteV2Good = async (id) => {
  return await request({
    method: "delete",
    url: `/product/${id}`,
  });
};
export const postV2Good = async (data, params) => {
  return await request({
    method: "post",
    url: `/product`,
    data,
    params,
  });
};
export const updateV2Good = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/product/${id}`,
    data,
    params,
  });
};
