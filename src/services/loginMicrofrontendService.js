import { useQuery } from "react-query";
import httpsRequest from "../utils/httpsRequest";




const loginMicrofrontendService = {
  get: (params) => httpsRequest.get('v1/login-microfront', { params })
}

export const useLoginMicrofrontendQuery = ({ params = {}, queryParams }) => {
  
  return useQuery(["GET_LOGIN_MICROFRONTEND", params], () => {
    return loginMicrofrontendService.get(params)
  }, queryParams)
}