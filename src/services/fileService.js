import { useQuery } from "react-query";
import request from "../utils/request";

const fileService = {
  upload: (data, params) => request.post("/upload", data, { params }),
  folderUpload: (data, params) =>
    request.post("/folder_upload", data, { params }),
  getMinioList: (folderName, params) =>
    request.get(`/minio_object/${folderName}`, { params }),
};

export const useMinioObjectListQuery = ({
  folderName,
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["MINIO_OBJECT", { folderName, ...params }],
    () => {
      return fileService.getMinioList(folderName, params);
    },
    queryParams
  );
};

export default fileService;
