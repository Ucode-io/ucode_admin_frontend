import requestAuth from "../utils/requestAuth";

const apiKeyService = {
  getList: (projectId, params) =>
    requestAuth.get(`/v2/api-key/${projectId}`, {params}),
  getListTokens: (projectId, params) =>
    requestAuth.get(`/v2/api-key/${projectId}/tokens`, {params}),
  getClientPlatform: () => requestAuth.get("/v2/client-platform"),
  getById: (projectId, id, params) =>
    requestAuth.get(`/v2/api-key/${projectId}/${id}`, {params}),
  create: (projectId, data) =>
    requestAuth.post(`/v2/api-key/${projectId}`, data),
  update: (projectId, id, data) =>
    requestAuth.put(`/v2/api-key/${projectId}/${id}`, data),
  delete: (projectId, id) =>
    requestAuth.delete(`/v2/api-key/${projectId}/${id}`),
};

export default apiKeyService;
