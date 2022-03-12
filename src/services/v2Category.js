import request from "utils/axios_v2";

export const getV2Categories = async (params) => {
  return await request({
    method: "get",
    url: `/category`,
    params,
  });
};
export const getV2Category = async (id, params) => {
  return await request({
    method: "get",
    url: `/category/${id}`,
    params,
  });
};
export const deleteV2Category = async (id) => {
  return await request({
    method: "delete",
    url: `/category/${id}`,
  });
};
export const postV2Category = async (data, params) => {
  return await request({
    method: "post",
    url: `/category`,
    data,
    params,
  });
};
export const updateV2Category = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/category/${id}`,
    data,
    params,
  });
};
