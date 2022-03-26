import request from "utils/axios_v2";

export const getV2Combos = async (params) => {
  return await request({
    method: "get",
    url: `/combo`,
    params,
  });
};
export const getV2Combo = async (id, params) => {
  return await request({
    method: "get",
    url: `/combo/${id}`,
    params,
  });
};
export const deleteV2Combo = async (id) => {
  return await request({
    method: "delete",
    url: `/combo/${id}`,
  });
};
export const postV2Combo = async (data, params) => {
  return await request({
    method: "post",
    url: `/combo`,
    data,
    params,
  });
};
export const updateV2Combo = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/combo/${id}`,
    data,
    params,
  });
};
