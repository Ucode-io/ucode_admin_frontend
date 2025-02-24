import request from "../utils/request";

const languageService = {
  getLanguageList: () => request.get("/language?search=Admin"),
};

export default languageService;
