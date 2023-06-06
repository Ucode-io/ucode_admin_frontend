import request from "../utils/request";

const layoutService = {
  getList: (data, params) => request.get(`/layout/${data?.data?.tableId}`, data, { params }),
  update: (data) => request.put(`/layout`, data),
};

export default layoutService;