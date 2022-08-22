
import request from "../utils/request";

const documentTemplateService = {
  getList: (params) => request.get('/html-template', { params }),
  update: (data) => request.put('/html-template', data),
  create: (data) => request.post('/html-template', data),
  delete: (id) => request.delete(`/html-template/${id}`)
}


export default documentTemplateService;