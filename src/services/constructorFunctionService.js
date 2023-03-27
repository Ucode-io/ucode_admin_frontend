import request from "../utils/request";

const constructorFunctionService = {
  getList: (params) => request.get("/function", { params }),
  update: (data) => request.put("/function", data),
  create: (data) => request.post("/function", data),
  delete: (id, data) => request.delete(`/function/${id}`, data),
  invoke: (data) => request.post("/invoke_function", data),
};

export default constructorFunctionService;
