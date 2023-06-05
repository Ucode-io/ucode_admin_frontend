import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const menuService = {
  getList: (params) => {
    return request.get(`/menu`, {
      params,
    });
  },
  getByID: (params, platformId) =>
    request.get(`/menu/${platformId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/menu`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    request.post(`/menu`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: ({ id, projectId }) =>
    request.delete(`/menu/${id}`, {
      params: { "project-id": projectId },
    }),
};

export const useMenuListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["MENU", params],
    () => {
      return menuService.getList(params);
    },
    queryParams
  );
};

export const usePlatformGetByIdQuery = ({
  params = {},
  platformId,
  queryParams,
}) => {
  return useQuery(
    ["MENU_GET_BY_ID", { ...params, platformId }],
    () => {
      return menuService.getByID(params, platformId);
    },
    queryParams
  );
};

export const usePlatformUpdateMutation = (mutationSettings) => {
  return useMutation((data) => menuService.update(data), mutationSettings);
};

export const usePlatformCreateMutation = (mutationSettings) => {
  return useMutation((data) => menuService.create(data), mutationSettings);
};

export const usePlatformDeleteMutation = ({ projectId, mutationSettings }) => {
  return useMutation(
    (id) => menuService.delete({ id, projectId }),
    mutationSettings
  );
};

export default menuService;
