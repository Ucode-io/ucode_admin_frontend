import request from "../utils/request";
import requestV2 from "../utils/requestV2";

const constructorFunctionService = {
  getListV2: (function_path, data, params) =>
    requestV2.get(`/function`, { params }),
  getList: (params) => request.get("/function", { params }),
  update: (data) => request.put("/function", data),
  create: (data) => request.post("/function", data),
  delete: (id, data) => request.delete(`/function/${id}`, data),
  invoke: (data) => request.post("/invoke_function", data),
};

export default constructorFunctionService;
