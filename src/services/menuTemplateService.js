import { useMutation, useQuery } from "react-query";
import request from "../utils/request";

const menuTemplateService = {
  getList: (params) => {
    return request.get(`/menu-template`, {
      params,
    });
  },
  getByID: (params, templateId) =>
    request.get(`/menu-template/${templateId}`, {
      params,
    }),
  update: (data) =>
    request.put(`/menu-template`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  create: (data) =>
    request.post(`/menu-template`, data, {
      params: {
        "project-id": data.project_id,
      },
    }),
  delete: (id) => request.delete(`/menu-template/${id}`),
};

export const useMenuTemplateListQuery = ({ params = {}, queryParams } = {}) => {
  return useQuery(
    ["MENU_TEMPLATE", params],
    () => {
      return menuTemplateService.getList(params);
    },
    queryParams
  );
};

export const useMenuTemplateGetByIdQuery = ({
  params = {},
  templateId,
  queryParams,
}) => {
  return useQuery(
    ["MENU_TEMPLATE_GET_BY_ID", { ...params, templateId }],
    () => {
      return menuTemplateService.getByID(params, templateId);
    },
    queryParams
  );
};

export const useMenuTemplateUpdateMutation = (mutationSettings) => {
  return useMutation(
    (data) => menuTemplateService.update(data),
    mutationSettings
  );
};

export const useMenuTemplateCreateMutation = (mutationSettings) => {
  return useMutation(
    (data) => menuTemplateService.create(data),
    mutationSettings
  );
};

export const useMenuTemplateDeleteMutation = (mutationSettings) => {
  return useMutation((id) => menuTemplateService.delete(id), mutationSettings);
};

export default menuTemplateService;
