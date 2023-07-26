import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const relationService = {
  getList: (params, headers) => request.get("/relation", { params, headers }),
  getByID: ({ resourceId, fieldId }) =>
    request.get(`/relation/${fieldId}`, {
      headers: { "resource-id": resourceId },
    }),
  update: (data) =>
    request.put(`/relation`, data, {
      headers: { "resource-id": data.resourceId },
    }),
  create: (data) =>
    request.post("/relation", data, {
      headers: { "resource-id": data.resourceId },
    }),
  delete: ({ id, resourceId }) =>
    request.delete(`/relation/${id}`, {
      headers: { "resource-id": resourceId },
    }),
};

export const useRelationsListQuery = ({
  params = {},
  headers,
  queryParams,
} = {}) => {
  return useQuery(
    ["RELATIONS", params],
    () => {
      return relationService.getList(params, headers);
    },
    queryParams
  );
};

export const useRelationGetByIdQuery = ({
  fieldId,
  resourceId,
  envId,
  queryParams,
}) => {
  return useQuery(
    ["RELATION_GET_BY_ID", { fieldId, resourceId, envId }],
    () => {
      return relationService.getByID({ resourceId, fieldId, envId });
    },
    queryParams
  );
};

export const useRelationUpdateMutation = (mutationSettings) => {
  return useMutation((data) => relationService.update(data), mutationSettings);
};

export const useRelationsCreateMutation = (mutationSettings) => {
  return useMutation((data) => relationService.create(data), mutationSettings);
};

export const useRelationsDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, resourceId, envId }) =>
      relationService.delete({ id, resourceId, envId }),
    mutationSettings
  );
};

export default relationService;
