import requestV2 from "../utils/requestV2";

const layoutService = {
  getList: (params, tableSlug) => requestV2.get(`/collections/${tableSlug}/layout`, { params }),
  update: (data, tableSlug) => requestV2.put(`/collections/${tableSlug}/layout`, data),
};

export default layoutService;