import request from "utils/axios_v2";

export const getV2Measurements = async (params) => {
  return await request({
    method: "get",
    url: `/measurement`,
    params,
  });
};
export const getV2Measurement = async (id, params) => {
  return await request({
    method: "get",
    url: `/measurement/${id}`,
    params,
  });
};
export const deleteV2Measurement = async (id) => {
  return await request({
    method: "delete",
    url: `/measurement/${id}`,
  });
};
export const postV2Measurement = async (data, params) => {
  return await request({
    method: "post",
    url: `/measurement`,
    data,
    params,
  });
};
export const updateV2Measurement = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/measurement/${id}`,
    data,
    params,
  });
};
