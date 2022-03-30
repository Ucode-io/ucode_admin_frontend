import request from "utils/axios_v2";

export const getProperties = async (params) => {
  return await request({
    method: "get",
    url: `/property-group`,
    params,
  });
};
export const getProperty = async (id, params) => {
  return await request({
    method: "get",
    url: `/property-group/${id}`,
    params,
  });
};
export const deleteProperty = async (id) => {
  return await request({
    method: "delete",
    url: `/property-group/${id}`,
  });
};
export const postProperty = async (data, params) => {
  return await request({
    method: "post",
    url: `/property-group`,
    data,
    params,
  });
};
export const updateProperty = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/property-group/${id}`,
    data,
    params,
  });
};
