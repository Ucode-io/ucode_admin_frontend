import requestAuth from "../../utils/requestAuth"

const clientRelationService = {
  getList: (params) => requestAuth.get('/relation', { params }),
  create: (data) => requestAuth.post('/relation', data),
  update: (data) => requestAuth.put('/relation', data),
  delete: (id) => requestAuth.delete(`/relation/${id}`),
}

export default clientRelationService