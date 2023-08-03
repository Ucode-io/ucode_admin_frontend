import { useMutation, useQuery } from "react-query";
import requestAuth from "../../utils/requestAuth";
import authRequestV2 from "../../utils/authRequest";
import requestAuthV2 from "../../utils/requestAuthV2";

const userService = {
  getList: (params) => requestAuth.get(`/user`, { params }),
  getById: (id, params) => requestAuth.get(`/user/${id}`, { params }),
  create: (data) => requestAuth.post("/user", data),
  update: (data) => requestAuth.put("/user", data),
  updateV2: (data) => requestAuthV2.put('/user', data),
  delete: (id) => requestAuth.delete(`/user/${id}`),

  getUserList: (params) => authRequestV2.get("/v2/user", { params }),
  getUserByID: (params, userId) =>
    authRequestV2.get(`/v2/user/${userId}`, {
      params,
    }),
  userUpdate: (data) => authRequestV2.put(`/v2/user`, data, {}),
  userCreate: (data) => authRequestV2.post(`/v2/user`, data, {}),
  userDelete: (id, userMenuId) =>
    authRequestV2.delete(`/v2/user/${id}`, {
      params: {
        "client-type-id": userMenuId,
      },
    }),
};

export const useUserListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["USER", params],
    () => {
      return userService.getUserList(params);
    },
    queryParams
  );
};

export const useUserGetByIdQuery = ({ userId, params = {}, queryParams }) => {
  return useQuery(
    ["USER_GET_BY_ID", { ...params, userId }],
    () => {
      return userService.getUserByID(params, userId);
    },
    queryParams
  );
};

export const useUserUpdateMutation = (mutationSettings) => {
  return useMutation((data) => userService.userUpdate(data), mutationSettings);
};

export const useUserCreateMutation = (mutationSettings) => {
  return useMutation((data) => userService.userCreate(data), mutationSettings);
};

export const useUserDeleteMutation = (mutationSettings) => {
  return useMutation(
    (id) => userService.userDelete(id, mutationSettings.userMenuId),
    mutationSettings
  );
};

export default userService;
