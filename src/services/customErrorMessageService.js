import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const customErrorMessageService = {
  getList: (params, tableSlug) => {
    return requestV2.get(`/collection/${tableSlug}/error_messages`, {
      params,
    });
  },
  getByID: (params, platformId, tableSlug) =>
    requestV2.get(`/collection/${tableSlug}/error_messages/${platformId}`, {
      params,
    }),
  update: (data, tableSlug) =>
    requestV2.put(`/collection/${tableSlug}/error_messages`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  updateOrder: (data) =>
    request.put(`/custom-error-message`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data, tableSlug) =>
    requestV2.post(`/collection/${tableSlug}/error_messages`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id, tableSlug) => request.delete(`/collection/${tableSlug}/error_messages/${id}`),
};

export const useCustomErrorListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["CUSTOM_ERROR_MESSAGE", params],
    () => {
      return customErrorMessageService.getList(params);
    },
    queryParams
  );
};

export const useCustomErrorGetByIdQuery = ({ params = {}, platformId, queryParams }) => {
  return useQuery(
    ["CUSTOM_ERROR_MESSAGE_GET_BY_ID", { ...params, platformId }],
    () => {
      return customErrorMessageService.getByID(params, platformId);
    },
    queryParams
  );
};

export const useCustomErrorUpdateMutation = (mutationSettings) => {
  return useMutation((data) => customErrorMessageService.update(data), mutationSettings);
};

export const useCustomErrorCreateMutation = (mutationSettings) => {
  return useMutation((data) => customErrorMessageService.create(data), mutationSettings);
};

export const useCustomErrorDeleteMutation = (mutationSettings) => {
  return useMutation((id) => customErrorMessageService.delete(id), mutationSettings);
};

export default customErrorMessageService;
