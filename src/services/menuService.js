import {useMutation, useQuery} from "react-query";
import request from "../utils/request";

const menuService = {
  getList: (params) => {
    return request.get(`/menu`, {
      params,
    });
  },
  getByID: ({menuId, params}) =>
    request.get(`/menu/${menuId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/menu`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  updateOrder: (data) =>
    request.put(`/menu/menu-order`, data, {
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
  delete: ({id, projectId}) =>
    request.delete(`/menu/${id}`, {
      params: {"project-id": projectId},
    }),
};

export const useMenuListQuery = ({params = {}, queryParams} = {}) => {
  return useQuery(
    ["MENU", params],
    () => {
      return menuService.getList(params);
    },
    queryParams
  );
};

export const usePlatformGetByIdQuery = ({menuId, params = {}, queryParams}) => {
  return useQuery(
    ["MENU_GET_BY_ID", {menuId, ...params}],
    () => {
      return menuService.getByID({menuId, params});
    },
    queryParams
  );
};

export const useMenuUpdateMutation = (mutationSettings) => {
  return useMutation((data) => menuService.update(data), mutationSettings);
};

export const useMenuCreateMutation = (mutationSettings) => {
  return useMutation((data) => menuService.create(data), mutationSettings);
};

export const usePlatformDeleteMutation = ({projectId, mutationSettings}) => {
  return useMutation(
    (id) => menuService.delete({id, projectId}),
    mutationSettings
  );
};

export default menuService;
