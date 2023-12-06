import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const relationService = {
  getList: (params, headers, tableSlug) => requestV2.get(`/relations/${tableSlug}`, { params, headers }),
  getByID: ({ fieldId }) => request.get(`/relation/${fieldId}`),
  update: (data, tableSlug) => requestV2.put(`/relations/${tableSlug}`, data),
  create: ({ data, tableSlug }) => requestV2.post(`/relations/${tableSlug}`, data),
  delete: ({ id, tableSlug }) => requestV2.delete(`/relations/${tableSlug}/${id}`),
};

export const useRelationsListQuery = ({ params = {}, headers, queryParams, tableSlug } = {}) => {
  return useQuery(
    ["RELATIONS", params],
    () => {
      return relationService.getList(params, headers, tableSlug);
    },
    queryParams
  );
};

export const useRelationGetByIdQuery = ({ fieldId, resourceId, envId, queryParams }) => {
  return useQuery(
    ["RELATION_GET_BY_ID", { fieldId, resourceId, envId }],
    () => {
      return relationService.getByID({ resourceId, fieldId, envId });
    },
    queryParams
  );
};

export const useRelationUpdateMutation = (mutationSettings) => {
  return useMutation(({ data, tableSlug }) => relationService.update({ data, tableSlug }), mutationSettings);
};

export const useRelationsCreateMutation = (mutationSettings) => {
  return useMutation(({ data, tableSlug }) => relationService.create({ data, tableSlug }), mutationSettings);
};

export const useRelationsDeleteMutation = (mutationSettings) => {
  return useMutation(({ id, tableSlug }) => relationService.delete({ id, tableSlug }), mutationSettings);
};

export default relationService;
