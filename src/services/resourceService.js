import { useMutation, useQuery } from "react-query";
import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const resourceService = {
  getList: (params) => request.get(`/company/project/resource`, { params }),
  getListV2: (params) => requestV2.get(`/company/project/resource`, { params }),
  getVariableResources: (id) => request.get(`/company/project/resource-variable/${id}`),
  getByID: (id) => request.get(`/company/project/resource/${id}`),
  create: (data) => request.post(`/company/project/resource`, data),
  createV2: (data) => requestV2.post(`/company/project/resource`, data),
  update: (data) => request.put(`/company/project/resource/${data.id}`, data),
  createFromCluster: (data) =>
  request.post("/company/project/create-resource", data),
  getResourceEnvironment: (id) =>
  request.get(`v1/company/project/resource-environment/${id}`),
  configureResource: (data) =>
  request.post("/v1/company/project/configure-resource", data),
  delete: (data) => request.delete(`v1/company/project/resource`, { data }),
  deleteV2: ({id}) => requestV2.delete(`/company/project/resource/${id}`),
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

export const useResourceListQueryV2 = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["RESOURCESV2", params],
    () => {
      return resourceService.getListV2(params);
    },
    queryParams
  );
};

export const useVariableResourceListQuery = ({ id, queryParams } = {}) => {
  return useQuery(
    ["RESOURCES_VARIABLE", id],
    () => {
      return resourceService.getVariableResources(id);
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

export const useResourceDeleteMutationV2 = (mutationSettings) => {
  return useMutation(({id}) => resourceService.deleteV2({id}), mutationSettings);
};

export const useResourceCreateMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.create(data), mutationSettings);
};

export const useResourceCreateMutationV2 = (mutationSettings) => {
  return useMutation((data) => resourceService.createV2(data), mutationSettings);
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


export default  resourceService;