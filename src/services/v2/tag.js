import request from "utils/axios_v2";

export const getTags = async (params) => {
  return await request.request({ method: "get", url: `/tag`, params });
};
export const getTag = async (id, params) => {
  return await request({ method: "get", url: `/tag/${id}`, params });
};
export const deleteTag = async (id) => {
  return await request({ method: "delete", url: `/tag/${id}` });
};
export const postTag = async (data, params) => {
  return await request({ method: "post", url: `/tag`, data, params });
};
export const updateTag = async (id, data, params) => {
  return await request({ method: "put", url: `/tag/${id}`, data, params });
};
