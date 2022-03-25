import request from "utils/axios_v2";

export const getV2ProductVariants = async (params) => {
  return await request({
    method: "get",
    url: `/product-variant`,
    params,
  });
};
export const getV2ProductVariant = async (id, params) => {
  return await request({
    method: "get",
    url: `/product-variant/${id}`,
    params,
  });
};
export const deleteV2ProductVariant = async (id) => {
  return await request({
    method: "delete",
    url: `/product-variant/${id}`,
  });
};
export const postV2ProductVariant = async (data, params) => {
  return await request({
    method: "post",
    url: `/product-variant`,
    data,
    params,
  });
};
export const updateV2ProductVariant = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/product-variant/${id}`,
    data,
    params,
  });
};
export const changeV2ProductVariantStatus = async (id, data, params) => {
  return await request({
    method: "patch",
    url: `/product-variant/${id}/change-status`,
    data,
    params,
  });
};
