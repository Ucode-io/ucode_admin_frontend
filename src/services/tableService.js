import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const tableService = {
  getList: (params) =>
    request.get("/table", {
      params,
      headers: {
        "resource-id": params.resourceId,
      },
    }),
  getByID: ({ resourceId, tableId, envId, projectId }) =>
    request.get(`/table/${tableId}`, {
      headers: { "resource-id": resourceId },
    }),
  update: (data) =>
    request.put(`/table`, data, {
      headers: { "resource-id": data.resourceId },
    }),
  create: (data) => {
    return request.post("/table", data, {
      headers: { "resource-id": data.resourceId },
    });
  },
  delete: ({ id, resourceId, envId }) =>
    request.delete(`/table/${id}`, {
      headers: { "resource-id": resourceId },
    }),
  configure: ({ data, resourceId, envId }) =>
    request.post(`/fields-relations`, data, {
      headers: { "resource-id": resourceId },
    }),
  getHistory: ({ tableId, projectId, envId }) =>
    request.get(`/table-history/list/${tableId}`, {}),
  getHistoryById: ({ historyId, envId, projectId }) =>
    request.get(`/table-history/${historyId}`, {}),
  revertCommit: ({ data, projectId }) =>
    request.put(`/table-history/revert`, data, {}),
  postVersion: ({ data, projectId }) => request.put(`/table-history`, data, {}),
};

export const useTablesListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["TABLES", params],
    () => {
      return tableService.getList(params);
    },
    queryParams
  );
};

export const useTableGetByIdQuery = ({
  tableId,
  resourceId,
  envId,
  projectId,
  queryParams,
}) => {
  return useQuery(
    ["TABLE_GET_BY_ID", { tableId, resourceId, envId, projectId }],
    () => {
      return tableService.getByID({ tableId, resourceId, envId, projectId });
    },
    queryParams
  );
};

export const useTableUpdateMutation = (mutationSettings) => {
  return useMutation((data) => tableService.update(data), mutationSettings);
};

export const useTableCreateMutation = (mutationSettings) => {
  return useMutation((data) => tableService.create(data), mutationSettings);
};

export const useTableDeleteMutation = (mutationSettings) => {
  return useMutation(
    ({ id, resourceId, envId }) =>
      tableService.delete({ id, resourceId, envId }),
    mutationSettings
  );
};

export const useTableHistoryQuery = ({
  tableId,
  projectId,
  envId,
  queryParams,
} = {}) => {
  return useQuery(
    ["TABLE_HISTORY", { tableId, projectId, envId }],
    () => {
      return tableService.getHistory({ tableId, projectId, envId });
    },
    queryParams
  );
};
export const useHistoryGetByIdQuery = ({
  historyId,
  envId,
  projectId,
  queryParams,
}) => {
  return useQuery(
    ["HISTORY_GET_BY_ID", { historyId, envId, projectId }],
    () => {
      return tableService.getHistoryById({ historyId, envId, projectId });
    },
    queryParams
  );
};

export const useTableRevertCommitMutation = (mutationSettings) => {
  return useMutation(
    (data) =>
      tableService.revertCommit({
        projectId: mutationSettings.projectId,
        data,
      }),
    mutationSettings
  );
};
export const useTableCommitVersionMutation = (mutationSettings) => {
  return useMutation(
    (data) =>
      tableService.postVersion({
        projectId: mutationSettings.projectId,
        data,
      }),
    mutationSettings
  );
};

export const useTableConfigureMutation = (mutationSettings) => {
  return useMutation(
    ({ data, resourceId, envId }) =>
      tableService.configure({ data, resourceId, envId }),
    mutationSettings
  );
};

export default tableService;
