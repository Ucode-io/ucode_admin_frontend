import request from "../utils/request";

const constructorTableService = {
  getList: (params, projectId) => request.get('/table', { params: { ...params, "project_id": projectId } }),
  update: (data, projectId) => request.put('/table', data, { params: { "project_id": projectId } }),
  create: (data, projectId) => request.post('/table', data, { params: { "project_id": projectId } }),
  getById: (id, projectId) => request.get(`/table/${id}`, { params: { "project_id": projectId } }),
  delete: (id, projectId) => request.delete(`/table/${id}`, { params: { "project_id": projectId } })
}

export default constructorTableService;