import { useQuery } from "react-query";
import requestV2 from "../utils/requestV2";

const microfrontendService = {
  getList: (params) => requestV2.get("/functions/micro-frontend", { params }),
  getById: (id, params) =>
    requestV2.get(`/functions/micro-frontend/${id}`, { params }),
  create: (data) => requestV2.post("/functions/micro-frontend", data),
  update: (data) => requestV2.put("/functions/micro-frontend", data),
  delete: (id) => requestV2.delete(`/functions/micro-frontend/${id}`),
};

export const useMicrofrontendListQuery = ({
  params = {},
  queryParams,
} = {}) => {
  return useQuery(
    ["MENU_TEMPLATE", params],
    () => {
      return microfrontendService.getList(params);
    },
    queryParams
  );
};

export default microfrontendService;
