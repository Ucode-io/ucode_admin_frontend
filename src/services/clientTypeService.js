import { useMutation, useQuery } from "react-query";
import httpsRequestV2 from "../utils/httpsRequestV2";

const clientTypeService = {
  getList: (params, envId) =>
    httpsRequestV2.get("/client-type", {
      params,
    }),
  getById: (id, params) =>
    httpsRequestV2.get(`/client-type/${id}`, {
      params,
    }),
  create: ({ data, params }) =>
    httpsRequestV2.post("/client-type", data, {
      params,
    }),
  update: ({ data, params }) =>
    httpsRequestV2.put("/client-type", data, {
      params,
    }),
  delete: ({ id, projectId }) =>
    httpsRequestV2.delete(`/client-type/${id}`, {
      params: { "project-id": projectId },
    }),
};

export const useClientTypesListQuery = ({
  params = {},
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["CLIENT_TYPES", { ...params, envId }],
    () => {
      return clientTypeService.getList(params, envId);
    },
    queryParams
  );
};

export const useClientTypeByIdQuery = ({ id, params = {}, quryParams }) => {
  return useQuery(
    ["CLIENT_TYPE_BY_ID", { id, ...params }],
    () => {
      return clientTypeService.getById(id, params);
    },
    quryParams
  );
};

export const useClientTypeCreateMutation = (mutationSettings) => {
  return useMutation(
    ({ data, params }) => clientTypeService.create({ data, params }),
    mutationSettings
  );
};

export const useClientTypeUpdateMutation = (mutationSettings) => {
  return useMutation(
    ({ data, params }) => clientTypeService.update({ data, params }),
    mutationSettings
  );
};

export const useClientTypeDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, projectId }) => clientTypeService.delete({ id, projectId }),
    mutationSettings
  );
};
