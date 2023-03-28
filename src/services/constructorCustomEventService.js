
import request from "../utils/request";
import requestV2 from "../utils/requestV2.js";


const constructorCustomEventService = {
  getList: (params) => requestV2.get('/custom-event', { params }),
  update: (data) => requestV2.put('/custom-event', data),
  create: (data) => requestV2.post('/custom-event', data),
  delete: (id, data) => requestV2.delete(`/custom-event/${id}`, data),
}

export default constructorCustomEventService;