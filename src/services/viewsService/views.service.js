import { useMutation, useQuery } from "react-query";
import requestV2 from "@/utils/requestV2";
import requestV3 from "@/utils/requestV3";

const constructorViewService = {
  getList: (tableSlug, params) =>
    requestV2.get(`/views/${tableSlug}`, { params }),
  update: (tableSlug, data) => {
    return requestV2.put(`/views/${tableSlug}`, data);
  },
  create: (tableSlug, data) => requestV2.post(`/views/${tableSlug}`, data),
  getById: (id, tableSlug) => requestV2.get(`/views/${tableSlug}/${id}`),
  delete: (id, tableSlug) => requestV2.delete(`/views/${tableSlug}/${id}`),
  changeViewOrder: (data, tableSlug) =>
    requestV2.put(`/views/${tableSlug}/update-order`, data),
  getViewListMenuId: (menuId) => requestV3.get(`menus/${menuId}/views`),
  createViewMenuId: (menu_id, data) =>
    requestV3.post(`menus/${menu_id}/views`, data),
};

export const useGetViewsList = (menuId, queryParams = {}) => {
  return useQuery(
    ["GET_VIEWS_LIST", menuId],
    () => {
      return constructorViewService.getViewListMenuId(menuId);
    },
    queryParams
  );
};

export const useUpdateViewMutation = (tableSlug, mutationSettings = {}) =>
  useMutation((data) => constructorViewService.update(tableSlug, data), {
    ...mutationSettings,
  });

export default constructorViewService;
