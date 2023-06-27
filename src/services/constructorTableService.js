import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const constructorTableService = {
  getList: (params, projectId) => request.get("/table", { params: { ...params, project_id: projectId } }),
  update: (data, projectId) => request.put("/table", data, { params: { project_id: projectId } }),
  create: (data, projectId) => request.post("/table", data, { params: { project_id: projectId } }),
  getById: (id, projectId) => request.get(`/table/${id}`, { params: { project_id: projectId } }),
  delete: (id, projectId) => request.delete(`/table/${id}`, { params: { project_id: projectId } }),
  getFolderList: (appId) => requestV2.get("/table-folder", { params: { app_id: appId } }),
  getFolderById: (id, appId) => requestV2.get(`/table-folder/${id}`, { params: { app_id: appId } }),
  createFolder: (data) => requestV2.post("/table-folder", data),
  updateFolder: (data) => requestV2.put("/table-folder", data),
  deleteFolder: (id) => requestV2.delete(`/table-folder/${id}`),
};

export default constructorTableService;
