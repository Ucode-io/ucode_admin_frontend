import requestAuth from "../../utils/requestAuth";

const inviteAuthUserService = {
  login: (data) => requestAuth.post("/v2/register", data),
};

export default inviteAuthUserService;
