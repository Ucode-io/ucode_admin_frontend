import request from "../utils/request";

const billingService = {
  getList: (id) => request.get(`/fare/${id}`),
  getFareList: () => request.get(`/fare`),
  getDiscounts: () => request.get("/discounts"),
  calculateFarePrice: (data) => request.post("fare/calculate-price", data),
  makePayment: (data) => request.patch("/company/project/attach-fare", data),
  getCardList: (params) => request.get("/payme/card-list", {params}),
  getTransactionList: () => request.get("/transaction"),
  fillBalance: (data) => request.post("/transaction", data),
  receiptPay: (data, params) =>
    request.post("/payme/receipt-pay", data, {params}),
  cardVerify: (data) => request.post("/payme/get-verify-code", data),
  cardOtpVerify: (data) => request.post("/payme/verify", data),
};

export default billingService;
