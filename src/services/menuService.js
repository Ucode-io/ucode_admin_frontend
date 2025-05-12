import {useMutation, useQuery} from "react-query";
import requestV3 from "../utils/requestV3";

const menuService = {
  getList: (params) => {
    return requestV3.get(`/menus`, {
      params,
    });
  },
  getByID: ({menuId, params}) =>
    requestV3.get(`/menus/${menuId}`, {
      params,
    }),
  update: (data) =>
    requestV3.put(`/menus`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  updateOrder: (data) =>
    requestV3.put(`/menus/menu-order`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    requestV3.post(`/menus`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: ({id, projectId}) =>
    requestV3.delete(`/menus/${id}`, {
      params: {"project-id": projectId},
    }),

  getFieldsListMenu: (menuId, viewId, tableSlug) =>
    requestV3.post(`/menus/${menuId}/views/${viewId}/tables/${tableSlug}`, {
      data: {},
    }),
  getFieldsTableData: (menuId, viewId, tableSlug, data) =>
    requestV3.post(
      `/menus/${menuId}/views/${viewId}/tables/${tableSlug}/items/list`,
      data
    ),

  getFieldsTableDataById: (menuId, viewId, tableSlug, itemId) =>
    requestV3.get(
      `/menus/${menuId}/views/${viewId}/tables/${tableSlug}/items/${itemId}`
    ),
};

export const useMenuListQuery = ({params = {}, queryParams} = {}) => {
  return useQuery(
    ["MENU", params],
    () => {
      return menuService.getList(params);
    },
    {
      ...queryParams,
    }
  );
};

export const useMenuGetByIdQuery = ({menuId, params = {}, queryParams}) => {
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
