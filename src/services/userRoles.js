import request from "utils/axios";

export const getUserRoles = (params) =>
  request({ method: "get", url: "/user-roles", params });
export const getUserRole = (id, params) =>
  request({ method: "get", url: `/user-roles${id}`, params });
export const deleteUserRole = (id) =>
  request({ method: "delete", url: `/user-roles/${id}` });
export const postUserRole = (data, params) =>
  request({ method: "post", url: "/user-roles", data, params });
export const updateUserRole = (id, data, params) =>
  request({ method: "put", url: `/user-roles${id}`, data, params });
