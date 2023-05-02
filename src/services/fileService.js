import request from "../utils/request";

const fileService = {
  upload: (data, params) => request.post("/upload", data, { params }),
};

export default fileService;
