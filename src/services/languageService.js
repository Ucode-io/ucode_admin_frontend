import request from "../utils/request";

const languageService = {
  getLanguageList: () => request.get("/language?search=Admin"),
  updateLanguageKey: (data) => request.put(`/language`, data),
};

export default languageService;
