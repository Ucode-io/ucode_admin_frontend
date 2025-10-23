import requestV3 from "@/utils/requestV3";
import { useQuery } from "react-query";

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

  getFieldsListMenu: (menuId, viewId, tableSlug, data) =>
    requestV3.post(`/menus/${menuId}/views/${viewId}/tables/${tableSlug}`, {
      data,
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

export const useGetTableInfo = (queryParams = {}, params = {menuId: "", viewId: "", tableSlug: ""}, data = {}) => {
  return useQuery(
    ["GET_VIEWS_AND_FIELDS", params],
    () => {
      return menuService.getFieldsListMenu(
        params.menuId,
        params.viewId,
        params.tableSlug,
        data
      );
    },
    {
      ...queryParams,
    }
  );
}