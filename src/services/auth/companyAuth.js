import requestAuth from "../../utils/requestAuth";

const companyAuthService = {
  create: (data) => requestAuth.post(`/company`, data),
};

export default companyAuthService;
