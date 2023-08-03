
import requestAuth from "../../utils/requestAuth"
import requestAuthV2 from "../../utils/requestAuthV2";

const userService = {
  getList: (params) => requestAuth.get(`/user`, { params }),
  getById: (id, params) => requestAuth.get(`/user/${id}`, { params }),
  create: (data) => requestAuth.post('/user', data),
  update: (data) => requestAuth.put('/user', data),
  updateV2: (data) => requestAuthV2.put('/user', data),
  delete: (id) => requestAuth.delete(`/user/${id}`)
}

export default userService


