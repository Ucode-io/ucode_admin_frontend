import request from "../utils/request";

const billingService = {
  getList: (id) => request.get(`/fare/${id}`),
  getTransactionList: () => request.get("/transaction"),
  fillBalance: (data) => request.post("/transaction", data),
};

export default billingService;
