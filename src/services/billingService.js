import request from "../utils/request";

const billingService = {
  getList: (id) => request.get(`/fare/${id}`),
  getCardList: (params) => request.get("/payme/card-list", {params}),
  getTransactionList: () => request.get("/transaction"),
  fillBalance: (data) => request.post("/transaction", data),
  cardVerify: (data) => request.post("/payme/get-verify-code", data),
};

export default billingService;
