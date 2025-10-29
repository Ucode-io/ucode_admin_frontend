import requestV2 from "@/utils/requestV2";
import { useQuery } from "react-query";

const layoutService = {
  getList: (params, tableSlug) => requestV2.get(`/collections/${tableSlug}/layout`, { params }),
  update: (data, tableSlug) => requestV2.put(`/collections/${tableSlug}/layout`, data),
  getLayout: (tableSlug, menuId, params) => requestV2.get(`/collections/${tableSlug}/layout/${menuId}`, { params }),
  remove: (tableSlug, id) => requestV2.delete(`/collections/${tableSlug}/layout/${id}`),
};

export const useGetLayout = (queryParams = {}, { tableSlug, menuId }) => {
  return useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
        menuId,
      },
    ],
    enabled: Boolean(tableSlug && menuId),
    queryFn: () => {
      console.log({tableSlug, menuId})
      return layoutService.getLayout(tableSlug, menuId);
    },
    onError: (error) => {
      console.error("Error", error);
    },
    ...queryParams
  })
}

export default layoutService;
