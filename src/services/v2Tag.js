import request from "utils/axios_v2";

export const getV2Tags = async (params) => {
  return await request.request({ method: "get", url: `/tag`, params });
};
export const getV2Tag = async (id, params) => {
  return await request({ method: "get", url: `/tag/${id}`, params });
};
export const deleteV2Tag = async (id) => {
  return await request({ method: "delete", url: `/tag/${id}` });
};
export const postV2Tag = async (data, params) => {
  return await request({ method: "post", url: `/tag`, data, params });
};
export const updateV2Tag = async (id, data, params) => {
  return await request({ method: "put", url: `/tag/${id}`, data, params });
};
