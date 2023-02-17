import requestAuthV2 from "../../utils/requestAuthV2";

const connectionServiceV2 = {
  getList: (params, headers) => requestAuthV2.get(`/connection`, { params, headers }),
  getById: (id, params) => requestAuthV2.get(`/connection/${id}`, { params }),
  create: (data) => requestAuthV2.post('/connection', data),
  update: (data) => requestAuthV2.put('/connection', data),
  delete: (id) => requestAuthV2.delete(`/connection/${id}`)
}

export default connectionServiceV2


