import request from "../utils/request";
import requestV2 from "../utils/requestV2";


const excelService = {
  getExcel: ({excel_id, tableSlug}) => requestV2.get(`/collections/${tableSlug}/import/fields/${excel_id}`),
  upload: (excel_id, data) => request.post(`/excel/excel_to_db/${excel_id}`, data),
}

export default excelService