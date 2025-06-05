import { useMutation } from "react-query";
import requestV2 from "../utils/requestV2";

const boardViewService = {
  getBoardStructure: (data, tableSlug) => requestV2.post(`/items/${tableSlug}/board/structure`, data),
  getBoard: (data, tableSlug) => requestV2.post(`/items/${tableSlug}/board`, data),
};

export const useGetBoardStructureMutation = (mutationSettings, tableSlug) => {
  return useMutation(
    (data) => boardViewService.getBoardStructure(data, tableSlug),
    mutationSettings
  );
};

export const useGetBoardMutation = (mutationSettings, tableSlug) => {
  return useMutation(
    (data) => boardViewService.getBoard(data, tableSlug),
    mutationSettings
  );
};

export default boardViewService;