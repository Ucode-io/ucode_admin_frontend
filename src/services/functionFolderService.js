import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const functionFolderService = {
  getList: (params) =>
    request.get("/function-folder", {
      params,
    }),
  getById: (params, folderId) =>
    request.get(`/function-folder/${folderId}`, {
      params,
    }),
  update: ({ data, projectId }) =>
    request.put("/function-folder", data, {
      params: { "project-id": projectId },
    }),
  create: ({ data, projectId }) =>
    request.post("/function-folder", data, {
      params: { "project-id": projectId },
    }),
  delete: ({ folderId, projectId }) =>
    request.delete(`/function-folder/${folderId}`, {
      params: { "project-id": projectId },
    }),
};

export const useFunctionFoldersListQuery = ({
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["FUNCTION_FOLDERS", { params }],
    () => {
      return functionFolderService.getList(params);
    },
    queryParams
  );
};

export const useFunctionFolderByIdQuery = ({
  params = {},
  folderId,
  queryParams,
} = {}) => {
  return useQuery(
    ["FUNCTION_FOLDER_BY_ID", { params, folderId }],
    () => {
      return functionFolderService.getList(params, folderId);
    },
    queryParams
  );
};

export const useFunctionFolderUpdateMutation = ({
  projectId,
  mutationSettings,
}) => {
  return useMutation(
    (data) => functionFolderService.update({ data, projectId }),
    mutationSettings
  );
};

export const useFunctionFolderCreateMutation = ({
  projectId,
  mutationSettings,
}) => {
  return useMutation(
    (data) => functionFolderService.create({ data, projectId }),
    mutationSettings
  );
};

export const useFunctionFolderDeleteMutation = ({
  projectId,
  mutationSettings,
}) => {
  return useMutation(
    (folderId) => functionFolderService.delete({ folderId, projectId }),
    mutationSettings
  );
};
