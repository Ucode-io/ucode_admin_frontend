import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const projectService = {
  getList: (params) => request.get("/company-project", { params }),

  getById: (projectId) => request.get(`/company-project/${projectId}`),

  update: (data) =>
    request.put(`/company-project`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    request.post(`/company-project`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id) => request.delete(`/company-project/${id}`),
};

export const useProjectListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["PROJECT", params],
    () => {
      return projectService.getProjectList(params);
    },
    queryParams
  );
};

export const useProjectGetByIdQuery = ({ envId, params = {}, queryParams }) => {
  return useQuery(
    ["PROJECT_GET_BY_ID", { ...params, envId }],
    () => {
      return projectService.getByID(params, envId);
    },
    queryParams
  );
};

export const useProjectUpdateMutation = (mutationSettings) => {
  return useMutation((data) => projectService.update(data), mutationSettings);
};

export const useProjectCreateMutation = (mutationSettings) => {
  return useMutation((data) => projectService.create(data), mutationSettings);
};

export const useProjectDeleteMutation = (mutationSettings) => {
  return useMutation((id) => projectService.delete(id), mutationSettings);
};

export default projectService;
