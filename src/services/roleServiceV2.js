import { useQuery } from "react-query";
import requestAuthV2 from "../utils/requestAuthV2";

const roleServiceV2 = {
  getList: (params, headers) => requestAuthV2.get("/role", { params, headers }),
  getById: (id, params) => requestAuthV2.get(`/role/${id}`, { params }),
  create: (data) => requestAuthV2.post("/role", data),
  update: (data) => requestAuthV2.put("/role", data),
  delete: (id) => requestAuthV2.delete(`/role/${id}`),
  addPermissionToRole: (data) =>
    requestAuthV2.post(`/role-permission/many`, data),
};

export const useRoleListQuery = ({
  params = {},
  headers = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["ROLES", { params, headers }],
    () => {
      return roleServiceV2.getList(params, headers);
    },
    queryParams
  );
};

export default roleServiceV2;
