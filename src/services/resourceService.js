import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const resourceService = {
  getList: (params) => request.get(`/company/project/resource`, { params }),
  getByID: (id) => request.get(`/company/project/resource/${id}`),
  create: (data) => request.post(`/company/project/resource`, data),
  update: (data) => request.put(`/company/project/resource/${data.id}`, data),
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

export const useResourceGetByIdQuery = ({ id, queryParams } = {}) => {
  return useQuery(
    ["RESOURCE_BY_ID", id],
    () => {
      return resourceService.getByID(id);
    },
    queryParams
  );
};

export const useResourceCreateMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.create(data), mutationSettings);
};

export const useResourceUpdateMutation = (mutationSettings) => {
  return useMutation((data) => resourceService.update(data), mutationSettings);
};
