import requestAuthNoProjectId from "../../utils/requestAuthNoProjectId";

const inviteAuthUserService = {
  login: ({data, params, Headers}) =>
    requestAuthNoProjectId.post(
      `/v2/register?project-id=${params?.projectId}`,
      {data},
      {
        headers: Headers,
      }
    ),
};

export default inviteAuthUserService;
