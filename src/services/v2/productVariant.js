import request from "utils/axios_v2";

export const getProductVariants = async (params) => {
  return await request({
    method: "get",
    url: `/product-variant`,
    params,
  });
};
export const getProductVariant = async (id, params) => {
  return await request({
    method: "get",
    url: `/product-variant/${id}`,
    params,
  });
};
export const deleteProductVariant = async (id) => {
  return await request({
    method: "delete",
    url: `/product-variant/${id}`,
  });
};
export const postProductVariant = async (data, params) => {
  return await request({
    method: "post",
    url: `/product-variant`,
    data,
    params,
  });
};
export const updateProductVariant = async (id, data, params) => {
  return await request({
    method: "put",
    url: `/product-variant/${id}`,
    data,
    params,
  });
};
export const changeProductVariantStatus = async (id, data, params) => {
  return await request({
    method: "patch",
    url: `/product-variant/${id}/change-status`,
    data,
    params,
  });
};
