import request from "../utils/request";

const layoutService = {
  getList: (data, params) => request.get(`/layout/${data?.tableId}`, data, { params })
};

export default layoutService;