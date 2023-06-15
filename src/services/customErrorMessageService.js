import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const customErrorMessageService = {
  getList: (params) => {
    return request.get(`/custom-error-message`, {
      params,
    });
  },
  getByID: (params, platformId) =>
    request.get(`/custom-error-message/${platformId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/custom-error-message`, data, {
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
  create: (data) =>
    request.post(`/custom-error-message`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: ({ id, projectId }) =>
    request.delete(`/custom-error-message/${id}`, {
      params: { "project-id": projectId },
    }),
};

export const useCustomErrorListQuery = ({ params = {}, queryParams } = {}) => {
  console.log("object", params);
  return useQuery(
    ["CUSTOM_ERROR_MESSAGE", params],
    () => {
      return customErrorMessageService.getList(params);
    },
    queryParams
  );
};

export const useCustomErrorGetByIdQuery = ({
  params = {},
  platformId,
  queryParams,
}) => {
  return useQuery(
    ["CUSTOM_ERROR_MESSAGE_GET_BY_ID", { ...params, platformId }],
    () => {
      return customErrorMessageService.getByID(params, platformId);
    },
    queryParams
  );
};

export const useCustomErrorUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => customErrorMessageService.update(data),
    mutationSettings
  );
};

export const useCustomErrorCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => customErrorMessageService.create(data),
    mutationSettings
  );
};

export const useCustomErrorDeleteMutation = ({
  projectId,
  mutationSettings,
}) => {
  return useMutation(
    (id) => customErrorMessageService.delete({ id, projectId }),
    mutationSettings
  );
};

export default customErrorMessageService;
