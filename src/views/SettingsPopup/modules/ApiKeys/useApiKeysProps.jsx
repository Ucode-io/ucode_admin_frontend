import {useDispatch, useSelector} from "react-redux";
import { useEffect, useState } from "react";
import apiKeyService from "@/services/apiKey.service";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";

export const useApiKeysProps = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.application.list);
  const projectId = useSelector((state) => state.company.projectId);
  const clientTypeId = useSelector((state) => state.auth.clientType.id);
  const envId = useSelector((state) => state?.company?.environmentId);
  const roleId = useSelector((state) => state.auth.roleInfo.id);
  const [apiKeys, setApiKeys] = useState();

  const navigateToEditForm = (id) => {
    dispatch(
      settingsModalActions.setTab(TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL),
    );
    dispatch(settingsModalActions.setApiKeyId(id));
    dispatch(settingsModalActions.setEdit(true));
    dispatch(settingsModalActions.setView(false));
    // setSearchParams({
    //   tab: TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL,
    //   apiKeyId: id,
    //   edit: true,
    // });
  };

  const navigateToForm = (id) => {
    dispatch(
      settingsModalActions.setTab(TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL),
    );
    dispatch(settingsModalActions.setApiKeyId(id));
    dispatch(settingsModalActions.setView(true));
    dispatch(settingsModalActions.setCreate(false));
    // setSearchParams({ apiKeyId: id, view: true });
  };

  const navigateToCreateForm = () => {
    dispatch(
      settingsModalActions.setTab(TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL),
    );
    dispatch(settingsModalActions.setCreate(true));
    // setSearchParams({ tab: TAB_COMPONENTS.API_KEYS.API_KEYS_DETAIL, create: true });
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

  // const inputChangeHandler = (e) => {
  //   const file = e.target.files[0];

  //   const data = new FormData();
  //   data.append("file", file);

  //   fileService.upload(data).then((res) => {
  //     fileSend(res?.filename);
  //   });
  // };

  // const fileSend = (value) => {
  //   exportToJsonService.uploadToJson({
  //     file_name: value,
  //     // app_id: appId,
  //   });
  // };

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
  };
};
