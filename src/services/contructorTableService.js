import request from "../utils/request";

const contructorTableService = {
  getList: (params) => request.get('/table', { params }),
  update: (data) => request.put('/table', data),
  create: (data) => request.post('/table', data),
  getById: (id) => request.get(`/table/${id}`),
  delete: (id) => request.delete(`/table/${id}`)
}

export default contructorTableService;