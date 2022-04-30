import request from "../utils/request";

const constructorObjectService = {
  getList: (tableSlug, data) => request.post(`/object/get-list/${tableSlug}`, data),
  update: (tableSlug, data) => request.put(`/object/${tableSlug}`, data),
  create: (tableSlug, data) => request.post(`/object/${tableSlug}`, data),
  getById: (tableSlug, id) => request.get(`/object/${tableSlug}/${id}`),
  delete: (tableSlug, id) => request.delete(`/object/${tableSlug}/${id}`),
}

export default constructorObjectService;