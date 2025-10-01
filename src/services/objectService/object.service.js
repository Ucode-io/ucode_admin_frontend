import request from "@/utils/request";
import requestV2 from "@/utils/requestV2";

const constructorObjectService = {
  getList: (tableSlug, data, params) =>
    request.post(`/object/get-list/${tableSlug}`, data, {params}),
  getListTreeData: (tableSlug, data) =>
    requestV2.post(`/items/${tableSlug}/tree`, {data}),
  getListV2: (tableSlug, data, params) =>
    requestV2.post(`/object/get-list/${tableSlug}`, data, {params}),
  groupByList: (tableSlug, rowTableSlug, data, params) =>
    request.post(
      `/object/get-list-group-by/${tableSlug}/${rowTableSlug}`,
      data,
      {params}
    ),
  getAutofilterList: ({tableSlug, ...params}, data) =>
    request.post(`/object/get-list/${tableSlug}`, data, {params}),
  update: (tableSlug, data) => requestV2.put(`/items/${tableSlug}`, data),
  updateMultiple: (tableSlug, data) =>
    request.post(`/object-upsert/${tableSlug}`, data),
  create: (tableSlug, data) => requestV2.post(`/items/${tableSlug}`, data),
  getById: (tableSlug, id) => requestV2.get(`/items/${tableSlug}/${id}`),
  getItems: (tableSlug, id) => requestV2.get(`/items/${tableSlug}`),
  getObjectByID: ({tableSlug, resourceId, id, envId, projectId}) =>
    request.get(`/object/${tableSlug}/${id}`, {
      headers: {
        "resource-id": resourceId,

        "platform-type": "super-admin",
      },
      params: {"project-id": projectId},
    }),
  delete: (tableSlug, id) =>
    requestV2.delete(`/items/${tableSlug}/${id}`, {data: {data: {}}}),
  deleteObject: ({tableSlug, resourceId, objectId}) =>
    requestV2.delete(`/items/${tableSlug}/${objectId}`, {
      headers: {"resource-id": resourceId},
      data: {data: {}},
    }),
  updateManyToMany: (data) => requestV2.put(`/items/many-to-many`, data),
  updateMultipleObject: (tableSlug, data) =>
    requestV2.put(`/items/${tableSlug}`, data),
  deleteManyToMany: (data) => requestV2.delete(`/items/many-to-many`, {data}),
  downloadExcel: (tableSlug, data) =>
    request.post(`/object/excel/${tableSlug}`, data),
  getFinancialAnalytics: (tableSlug, data) =>
    request.post(`/object/get-financial-analytics/${tableSlug}`, data),
  updateObject: (data) =>
    request.put(
      `/object/${data.tableSlug}`,
      {data},
      {
        headers: {
          "resource-id": data.resourceId,
          "environment-id": data.envId,
        },
      }
    ),
  createObject: (data) =>
    request.post(
      `/object/${data.tableSlug}`,
      {data},
      {
        headers: {
          "resource-id": data.resourceId,
          "environment-id": data.envId,
        },
      }
    ),
  deleteMultiple: (tableSlug, data) =>
    request.delete(`/object/${tableSlug}`, {data}),
};

export const updateObject = (tableSlug = "", data) => {
  constructorObjectService.update(tableSlug, {data: {...data}});
};