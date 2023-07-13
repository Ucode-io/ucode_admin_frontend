import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const companyService = {
  getList: (params) => {
    return request.get(`/company`, {
      params,
    });
  },
  getProjectList: (params) => {
    return request.get(`/company-project`, {
      params,
    });
  },
  getEnvironmentList: (params) => {
    return request.get(`/environment`, {
      params,
    });
  },
  getByID: (params, platformId) =>
    request.get(`/company/${platformId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/company`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    request.post(`/company`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id) => request.delete(`/company/${id}`),
};

export const useCompanyListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["COMPANY", params],
    () => {
      return companyService.getList(params);
    },
    queryParams
  );
};
export const useProjectListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["PROJECT", params],
    () => {
      return companyService.getProjectList(params);
    },
    queryParams
  );
};
export const useEnvironmentListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["ENVIRONMENT", params],
    () => {
      return companyService.getEnvironmentList(params);
    },
    queryParams
  );
};

export const useCompanyGetByIdQuery = ({
  menuId,
  params = {},
  queryParams,
}) => {
  return useQuery(
    ["COMPANY_GET_BY_ID", { ...params, menuId }],
    () => {
      return companyService.getByID(params, menuId);
    },
    queryParams
  );
};

export const useCompanyUpdateMutation = (mutationSettings) => {
  return useMutation((data) => companyService.update(data), mutationSettings);
};

export const useCompanyCreateMutation = (mutationSettings) => {
  return useMutation((data) => companyService.create(data), mutationSettings);
};

export const useCompanyDeleteMutation = (mutationSettings) => {
  return useMutation((id) => companyService.delete(id), mutationSettings);
};

export default companyService;
