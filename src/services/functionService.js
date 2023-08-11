import { useMutation, useQuery } from "react-query";
import requestV2 from "../utils/requestV2";

const functionService = {
  getList: (params) =>
    requestV2.get("/function", {
      params,
    }),
  getById: (params, functionId) =>
    requestV2.get(`/function/${functionId}`, {
      params,
    }),
  update: ({ data, projectId }) =>
    requestV2.put("/function", data, {
      params: { "project-id": projectId },
    }),
  create: ({ data, projectId }) =>
    requestV2.post("/function", data, {
      params: { "project-id": projectId },
    }),
  delete: ({ functionId, projectId }) =>
    requestV2.delete(`/function/${functionId}`, {
      params: { "project-id": projectId },
    }),
};

export const useFunctionsListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["FUNCTIONS", { params }],
    () => {
      return functionService.getList(params);
    },
    queryParams
  );
};

export const useFunctionByIdQuery = ({
  params = {},
  functionId,
  queryParams,
} = {}) => {
  return useQuery(
    ["FUNCTION_BY_ID", { params, functionId }],
    () => {
      return functionService.getById(params, functionId);
    },
    queryParams
  );
};

export const useFunctionUpdateMutation = ({ projectId, mutationSettings }) => {
  return useMutation(
    (data) => functionService.update({ data, projectId }),
    mutationSettings
  );
};

export const useFunctionCreateMutation = ({ projectId, mutationSettings }) => {
  return useMutation(
    (data) => functionService.create({ data, projectId }),
    mutationSettings
  );
};

export const useFunctionDeleteMutation = ({ projectId, mutationSettings }) => {
  return useMutation(
    (data) => functionService.delete({ data, projectId }),
    mutationSettings
  );
};
