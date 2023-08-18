import request from "../utils/request";

const pivotService = {
  dynamicReport: (data) => {
    return request.post(`/dynamic-report`, data, {
      params: {
        "project-id": data.project_id,
      },
    });
  },

  dynamicReportFormula: (params) =>
    request.get(`/dynamic-report-formula`, {
      params,
    }),

  getListPivotTemplateSetting: (params) =>
    request.get(`/get-pivot-template-setting`, {
      params,
    }),

  getByIdPivotTemplateSetting: ({ id, params }) =>
    request.get(`/get-pivot-template-setting/${id}`, {
      params,
    }),

  deletePivotTemplate: ({ id, projectId }) =>
    request.delete(`/remove-pivot-template/${id}`, {
      params: { "project-id": projectId },
    }),

  savePivotTemplate: (data) => {
    return request.post(`/save-pivot-template`, data, {
      params: {
        "project-id": data.project_id,
      },
    });
  },

  upsertPivotTemplate: (data) =>
    request.put(`/upsert-pivot-template`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),

  deleteReportSetting: (id) => request.delete(`/delete-report-setting/${id}`),

  getListReportSetting: (params) =>
    request.get(`/get-report-setting`, {
      params,
    }),

  getByIdReportSetting: (id, params) =>
    request.get(`/get-report-setting/${id}`, {
      params,
    }),

  upsertReportSetting: (data) =>
    request.put(`/upsert-report-setting`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  getReportLink: (id, params) => request(`/export/dynamic-report/excel/${id}`, { params }),
};

export default pivotService;
