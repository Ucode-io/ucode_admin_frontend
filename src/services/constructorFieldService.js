import { useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const constructorFieldService = {
  getList: (params, tableSlug) => requestV2.get(`/fields/${tableSlug}`, { params }),
  getFieldPermission: ({ role_id, table_slug }) => request.get(`field-permission/${role_id}/${table_slug}`),
  update: (data, tableSlug) => requestV2.put(`/fields/${tableSlug}`, data),
  create: (data, tableSlug) => requestV2.post(`/fields/${tableSlug}`, data),
  delete: (id, tableSlug) => requestV2.delete(`v2/fields/${tableSlug}/${id}`),
};

export const useFieldsListQuery = ({ params = {}, tableSlug, queryParams } = {}) => {
  return useQuery(
    ["FIELDS", params],
    () => {
      return constructorFieldService.getList(params, tableSlug);
    },
    queryParams
  );
};

export default constructorFieldService;
