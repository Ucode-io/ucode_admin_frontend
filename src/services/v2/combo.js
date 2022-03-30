import request from "utils/axios_v2";

export const getCombos = async (params) => {
  return await request({
    method: "get",
    url: `/combo`,
    params,
  });
};
export const getCombo = async (id, params) => {
  return await request({
    method: "get",
    url: `/combo/${id}`,
    params,
  });
};
export const deleteCombo = async (id) => {
  return await request({
    method: "delete",
    url: `/combo/${id}`,
  });
};
export const postCombo = async (data, params) => {
  return await request({
    method: "post",
    url: `/combo`,
    data,
    params,
  });
};
export const updateCombo = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/combo/${id}`,
    data,
    params,
  });
};
