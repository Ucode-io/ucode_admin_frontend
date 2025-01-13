import requestAuthV2 from "../utils/requestAuthV2";

const sessionService = {
  getList: (params) => requestAuthV2.get(`/session`, {params}),
  delete: (session_id) => requestAuthV2.delete(`/session/${session_id}`),
};

export default sessionService;
