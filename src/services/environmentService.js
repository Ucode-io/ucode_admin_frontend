import request from "../utils/request";
import requestAuth from "../utils/requestAuthV2";

const environmentService = {
  getList: (params) => requestAuth.get("/resource-environment", { params }),
  getEnvironments: (envId) => {
    return request.get(`/environment/${envId}`);
  },
};

export default environmentService;
