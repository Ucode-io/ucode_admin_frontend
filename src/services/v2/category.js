import request from "utils/axios_v2";

export const getCategories = async (params) => {
  return await request({
    method: "get",
    url: `/category`,
    params,
  });
};
export const getCategory = async (id, params) => {
  return await request({
    method: "get",
    url: `/category/${id}`,
    params,
  });
};
export const deleteCategory = async (id) => {
  return await request({
    method: "delete",
    url: `/category/${id}`,
  });
};
export const postCategory = async (data, params) => {
  return await request({
    method: "post",
    url: `/category`,
    data,
    params,
  });
};
export const updateCategory = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/category/${id}`,
    data,
    params,
  });
};
