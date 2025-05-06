import requestAuth from "../../utils/requestAuth";

const inviteAuthUserService = {
  login: (data, projectId, params) =>
    requestAuth.post(`/v2/register?project-id=${projectId}`, data, {params}),
};

export default inviteAuthUserService;
