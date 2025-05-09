import requestV3 from "../utils/requestV3";

const menuSettingsService = {
  getList: (params) => requestV3.get("/menus", {params}),
  update: (data) => requestV3.put("/menus", data),
  create: (data) => requestV3.post("/menus", data),
  getById: (id) => requestV3.get(`/menus/${id}`),
  delete: (id) => requestV3.delete(`/menus/${id}`),
};

export default menuSettingsService;
