import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const resourceService = {
  getList: (params) => request.get(`/company/project/resource`, { params }),
  getVariableResources: () => request.get('/company/project/resource-variable'),
  getByID: (id) => request.get(`/company/project/resource/${id}`),
  create: (data) => request.post(`/company/project/resource`, data),
  update: (data) => request.put(`/company/project/resource/${data.id}`, data),
  createFromCluster: (data) =>
  request.post("/company/project/create-resource", data),
  getResourceEnvironment: (id) =>
  request.get(`v1/company/project/resource-environment/${id}`),
  configureResource: (data) =>
  request.post("/v1/company/project/configure-resource", data),
  delete: (data) => request.delete(`v1/company/project/resource`, { data }),
  reconnect: ({ data, projectId }) => {
    return request.post(`v1/company/project/resource/reconnect`, data, {
      params: { "project-id": projectId },
    });
  },
};

export const useResourceListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["RESOURCES", params],
    () => {
      return resourceService.getList(params);
    },
    queryParams
  );
};

export const useVariableResourceListQuery = ({ queryParams } = {}) => {
  return useQuery(
    ["RESOURCES_VARIABLE"],
    () => {
      return resourceService.getVariableResources();
    },
    queryParams
  );
};

export const useResourceGetByIdQuery = ({ id, queryParams } = {}) => {
  return useQuery(
    ["RESOURCE_BY_ID", id],
    () => {
      return resourceService.getByID(id);
    },
    queryParams
  );
};

export const useResourceCreateFromClusterMutation = (mutationSettings) => {
  return useMutation(
    (data) => resourceService.createFromCluster(data),
    mutationSettings
  );
};

export const useResourceReconnectMutation = ({
  projectId,
  mutationSettings,
}) => {
  return useMutation(
    (data) => resourceService.reconnect({ data, projectId }),
    mutationSettings
  );
};

export const useResourceEnvironmentGetByIdQuery = ({
  id,
  queryParams,
} = {}) => {
  return useQuery(
    ["RESOURCE_ENVIRONMENT_BY_ID", id],
    () => {
      return resourceService.getResourceEnvironment(id);
    },
    queryParams
  );
};


export const useResourceDeleteMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.delete(data), mutationSettings);
};

export const useResourceCreateMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.create(data), mutationSettings);
};

export const useResourceUpdateMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.update(data), mutationSettings);
};

export const useResourceConfigureMutation = (mutationSettings) => {
  return useMutation(
    (data) => resourceService.configureResource(data),
    mutationSettings
  );
};

