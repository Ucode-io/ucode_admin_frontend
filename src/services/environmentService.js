


import request from "../utils/request";
import requestAuth from "../utils/requestAuthV2";


const environmentService = {
  getList: (params) => requestAuth.get('/resource-environment', { params }),
}

export default environmentService