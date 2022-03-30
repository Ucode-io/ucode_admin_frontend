import request from "utils/axios_v2";

export const getMeasurements = async (params) => {
  return await request({
    method: "get",
    url: `/measurement`,
    params,
  });
};
export const getMeasurement = async (id, params) => {
  return await request({
    method: "get",
    url: `/measurement/${id}`,
    params,
  });
};
export const deleteMeasurement = async (id) => {
  return await request({
    method: "delete",
    url: `/measurement/${id}`,
  });
};
export const postMeasurement = async (data, params) => {
  return await request({
    method: "post",
    url: `/measurement`,
    data,
    params,
  });
};
export const updateMeasurement = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/measurement/${id}`,
    data,
    params,
  });
};
