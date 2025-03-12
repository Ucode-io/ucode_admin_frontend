import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import apiKeyService from "@/services/apiKey.service";
import fileService from "@/services/fileService";
import exportToJsonService from "@/services/exportToJson";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";

export const useApiKeysProps = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const list = useSelector((state) => state.application.list);
  const loader = useSelector((state) => state.application.loader);
  const projectId = useSelector((state) => state.auth.projectId);
  const clientTypeId = useSelector((state) => state.auth.clientType.id);
  const envId = useSelector((state) => state?.auth?.environmentId);
  const roleId = useSelector((state) => state.auth.roleInfo.id);
  const inputRef = useRef();
  const [apiKeys, setApiKeys] = useState();

  const { setSearchParams } = useSettingsPopupContext();

  const navigateToEditForm = (id) => {
    setSearchParams({ tab: TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL, apiKeyId: id, edit: true });
  };

  const navigateToForm = (id) => {
    setSearchParams({ tab: TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL, apiKeyId: id, view: true });
  };
  
  const navigateToCreateForm = () => {
    setSearchParams({ tab: TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL, create: true });
  };

  const deleteTable = (id) => {
    apiKeyService.delete(projectId, id).then(() => {
      getList();
    });
  };

  const getList = () => {
    const params = {
      client_type_id: clientTypeId,
      role_id: roleId,
      "environment-id": envId,
    };
    apiKeyService
      .getList(projectId, params)
      .then((res) => {
        setApiKeys(res.data);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const inputChangeHandler = (e) => {
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService.upload(data).then((res) => {
      fileSend(res?.filename);
    });
  };

  const fileSend = (value) => {
    exportToJsonService.uploadToJson({
      file_name: value,
      // app_id: appId,
    });
  };

  const URLFILE = window.location.origin + "/apikeys.zip";
  const downloadUrl = (url) => {
    const filename = url.split("/").pop();
    const aTag = document.createElement("a");

    aTag.href = url;
    aTag.setAttribute("download", filename);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  return {
    downloadUrl,
    URLFILE,
    apiKeys,
    navigateToForm,
    navigateToEditForm,
    deleteTable,
    navigateToCreateForm,
    list,
  }
}
