import request from "../utils/request";

const menuSettingsService = {
  getList: (params) => request.get("/menu", { params }),
  update: (data) => request.put("/menu", data),
  create: (data) => request.post("/menu", data),
  getById: (id) => request.get(`/menu/${id}`),
  delete: (id) => request.delete(`/menu/${id}`),
};

export default menuSettingsService;
