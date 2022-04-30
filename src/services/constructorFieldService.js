
import request from "../utils/request";

const constructorFieldService = {
  getList: (params) => request.get('/field', { params }),
  update: (data) => request.put('/field', data),
  create: (data) => request.post('/field', data),
  delete: (id) => request.delete(`/field/${id}`)
}

export default constructorFieldService;