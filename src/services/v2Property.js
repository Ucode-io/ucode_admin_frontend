import request from "utils/axios_v2";

export const getV2Properties = async (params) => {
  return await request({
    method: "get",
    url: `/property-group`,
    params,
  });
};
export const getV2Property = async (id, params) => {
  return await request({
    method: "get",
    url: `/property-group/${id}`,
    params,
  });
};
export const deleteV2Property = async (id) => {
  return await request({
    method: "delete",
    url: `/property-group/${id}`,
  });
};
export const postV2Property = async (data, params) => {
  return await request({
    method: "post",
    url: `/property-group`,
    data,
    params,
  });
};
export const updateV2Property = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/property-group/${id}`,
    data,
    params,
  });
};
