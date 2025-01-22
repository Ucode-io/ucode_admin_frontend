import {useQuery} from "react-query";
import clientTypeServiceV2 from "@/services/auth/clientTypeServiceV2";

export const useClientTypesQuery = () => useQuery({
  queryKey: ["GET_CLIENT_TYPES"],
  queryFn: () => clientTypeServiceV2.getList(),
});