import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const projectService = {
  getList: (params) => request.get("/company-project", { params }),
  getByID: (params, projectId) =>
    request.get(`/company-project/${projectId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/company-project/${data.project_id}`, data, {
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
      return projectService.getList(params);
    },
    queryParams
  );
};

export const useProjectGetByIdQuery = ({
  projectId,
  params = {},
  queryParams,
}) => {
  return useQuery(
    ["PROJECT_GET_BY_ID", { ...params, projectId }],
    () => {
      return projectService.getByID(params, projectId);
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
