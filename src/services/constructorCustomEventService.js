import requestV2 from "../utils/requestV2";

const constructorCustomEventService = {
  getList: (params, tableSlug) => requestV2.get(`/collections/${tableSlug}/automation`, { params }),
  getById: (id, tableSlug) => requestV2.get(`/collection/${tableSlug}/automation/${id}`),
  update: (data, tableSlug) => requestV2.put(`/collection/${tableSlug}/automation`, data),
  create: (data, tableSlug) => requestV2.post(`/collection/${tableSlug}/automation`, data),
  delete: (id, data, tableSlug) => requestV2.delete(`/collection/${tableSlug}/automation/${id}`, data),
}

export default constructorCustomEventService;