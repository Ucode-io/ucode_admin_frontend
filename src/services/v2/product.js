import request from "utils/axios_v2";

export const getGoods = async (params) => {
  return await request({
    method: "get",
    url: `/product`,
    params,
  });
};
export const getGood = async (id, params) => {
  return await request({
    method: "get",
    url: `/product/${id}`,
    params,
  });
};
export const deleteGood = async (id) => {
  return await request({
    method: "delete",
    url: `/product/${id}`,
  });
};
export const postGood = async (data, params) => {
  return await request({
    method: "post",
    url: `/product`,
    data,
    params,
  });
};
export const updateGood = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/product/${id}`,
    data,
    params,
  });
};
export const changeStatus = async (id, data) => {
  return await request({
    method: "patch",
    url: `/product-variant/${id}/change-status`,
    data,
  });
};
