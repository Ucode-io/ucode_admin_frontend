import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { endOfMonth, startOfMonth } from "date-fns";
import apiKeyService from "../../../../services/apiKey.service";
import roleServiceV2 from "../../../../services/roleServiceV2";
import { useParams } from "react-router-dom";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";
import { store } from "@/store/index";

export const useApiKeysDetail = () => {
  const dispatch = useDispatch();
  const { appId } = useParams();
  const { t } = useTranslation();

  const authStore = useSelector((state) => state.auth);
  const projectId = store.getState().company.projectId;

  const [date, setDate] = useState({
    $gte: startOfMonth(new Date()),
    $lte: endOfMonth(new Date()),
  });

  const [selectedTab, setSelectedTab] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const [btnLoader, setBtnLoader] = useState();

  const [platformList, setPlatformList] = useState([]);

  const { apiKeyId, view, edit, create } = useSelector(
    (state) => state.settingsModal,
  );

  const mainForm = useForm({
    defaultValues: {
      environment_id: authStore.environmentId,
      project_id: projectId,
      client_type_id: authStore.clientType.id,
      role_id: authStore.roleInfo.id,
    },
  });

  const apiKey = mainForm.getValues("app_id");

  const onBackBtnClick = () => {
    dispatch(settingsModalActions.resetParams());
  };

  const getById = () => {
    apiKeyService
      .getById(projectId, apiKeyId)
      .then((res) => {
        mainForm.reset(res);
        mainForm.setValue("client_platform_id", res?.client_platform?.id);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  const getClientTypeList = () => {
    clientTypeServiceV2.getList({}).catch((err) => {
      console.log("exportToJson error", err);
    });
  };

  const getClientPlatformList = () => {
    apiKeyService.getClientPlatform().then((res) =>
      setPlatformList(
        res?.client_platforms?.map((item) => ({
          label: item?.name,
          value: item?.id,
        })),
      ),
    );
  };

  const getRoleList = () => {
    roleServiceV2
      .getList({
        clienty_type_id: mainForm.watch("client_type_id"),
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  const createApp = (data) => {
    setBtnLoader(true);

    apiKeyService
      .create(projectId, data)
      .then(() => {
        dispatch(settingsModalActions.resetParams());
        getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const updateApp = (data) => {
    setBtnLoader(true);

    apiKeyService
      .update(projectId, apiKeyId, {
        ...data,
      })
      .then(() => {
        dispatch(settingsModalActions.resetParams());
        getRoleList();
      })
      .catch(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    if (apiKeyId) updateApp(data);
    else createApp(data);
  };

  useEffect(() => {
    if (apiKeyId) {
      getById();
    }
  }, [apiKeyId]);

  useEffect(() => {
    getClientTypeList();
    getClientPlatformList();
  }, []);

  return {
    t,
    selectedTab,
    appId,
    mainForm,
    setSelectedTab,
    inputValue,
    setInputValue,
    setDate,
    date,
    onSubmit,
    apiKeyId,
    btnLoader,
    view,
    edit,
    create,
    getClientPlatformList,
    getRoleList,
    platformList,
    apiKey,
    onBackBtnClick,
  };
};
