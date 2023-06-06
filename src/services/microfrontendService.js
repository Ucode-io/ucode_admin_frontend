import requestV2 from "../utils/requestV2";

const microfrontendService = {
  getList: (params) => requestV2.get("/functions/micro-frontend", { params }),
  getById: (id, params) =>
    requestV2.get(`/functions/micro-frontend/${id}`, { params }),
  create: (data) => requestV2.post("/functions/micro-frontend", data),
  update: (data) => requestV2.put("/functions/micro-frontend", data),
  delete: (id) => requestV2.delete(`/functions/micro-frontend/${id}`),
};

export default microfrontendService;
