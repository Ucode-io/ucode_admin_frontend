import request from "../utils/request";

const billingService = {
  getList: (id) => request.get(`/fare/${id}`),
  getFareList: () => request.get(`/fare`),
  getDiscounts: () => request.get("/discounts"),
  calculateFarePrice: (data) => request.post("fare/calculate-price", data),
  makePayment: (data) => request.patch("/company/project/attach-fare", data),
  getCardList: (params) => request.get("/payment/card-list", { params }),
  getTransactionList: () => request.get("/transaction"),
  fillBalance: (data) => request.post("/transaction", data),
  receiptPay: (data, params) =>
    request.post("/payment/receipt-pay", data, { params }),
  cardVerify: (data) => request.post("/payment/get-verify-code", data),
  cardOtpVerify: (data) => request.post("/payment/verify", data),
};

export default billingService;
