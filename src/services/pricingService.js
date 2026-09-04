import { useQuery } from "react-query";
import request from "../utils/request";

const pricingService = {
  getApiUsageBreakdown: (params) =>
    request.get("/pricing/api-call/breakdown", { params }),
};

export const useApiUsageBreakdownQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["API_USAGE_BREAKDOWN", params],
    () => {
      return pricingService.getApiUsageBreakdown(params);
    },
    queryParams,
  );
};

export default pricingService;
