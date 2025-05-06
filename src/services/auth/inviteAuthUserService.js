import requestAuth from "../../utils/requestAuth";

const inviteAuthUserService = {
  login: (data, params) => requestAuth.post("/v2/register", data, {params}),
};

export default inviteAuthUserService;
