import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const constructorFieldService = {
  getList: (params) => request.get("/field", { params }),
  getFieldPermission: ({ role_id, table_slug }) =>
    request.get(`field-permission/${role_id}/${table_slug}`),
  update: (data) => request.put("/field", data),
  create: (data) => request.post("/field", data),
  delete: (id) => request.delete(`/field/${id}`),
};

export const useFieldsListQuery = ({
  params = {},
  headers,
  queryParams,
} = {}) => {
  return useQuery(
    ["FIELDS", params],
    () => {
      return constructorFieldService.getList(params, headers);
    },
    queryParams
  );
};

export const useFieldCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => constructorFieldService.create(data),
    mutationSettings
  );
};

export default constructorFieldService;
