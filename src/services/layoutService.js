import request from "../utils/request";

const layoutService = {
  getList: (params) => request.get(`/layout`, { params }),
  update: (data) => request.put(`/layout`, data),
};

export default layoutService;