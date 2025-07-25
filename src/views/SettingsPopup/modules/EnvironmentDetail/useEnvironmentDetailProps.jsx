import { useTranslation } from "react-i18next";
import { useGetLang } from "../../../../hooks/useGetLang";
import { useSettingsPopupContext } from "../../providers";
import { useEnvironmentCreateMutation, useEnvironmentGetByIdQuery, useEnvironmentUpdateMutation } from "../../../../services/environmentService";
import { useForm } from "react-hook-form";
import { store } from "../../../../store";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { useDispatch, useSelector } from "react-redux";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";

export const useEnvironmentDetailProps = () => {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();

  const { searchParams, setSearchParams } = useSettingsPopupContext();

  const projectId = store.getState().company.projectId;
  const companyId = store.getState().company?.companyId;

  const envId = useSelector((state) => state.settingsModal.envId);

  const lang = useGetLang("Setting");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mainForm = useForm({
    defaultValues: {
      description: "",
      name: "",
      project_id: projectId,
    },
  });

  const handleCancelClick = () => {
    dispatch(settingsModalActions.resetParams());
  };

  const { isLoading } = useEnvironmentGetByIdQuery({
    envId: envId,
    queryParams: {
      enabled: Boolean(envId),
      onSuccess: (res) => {
        mainForm.reset(res);
      },
    },
  });

  const { mutateAsync: createEnv, isLoading: createLoading } =
    useEnvironmentCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["ENVIRONMENT"]);
        // setSearchParams({});
        store.dispatch(showAlert("Успешно", "success"));
      },
    });

  const { mutateAsync: updateEnv, isLoading: updateLoading } =
    useEnvironmentUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["ENVIRONMENT"]);
        // setSearchParams({});
        store.dispatch(showAlert("Успешно", "success"));
      },
    });

  const onSubmit = (data) => {
    const createdData = {
      ...data,
      company_id: companyId,
    };
    if (envId) updateEnv(createdData);
    else createEnv(createdData);
  };

  return {
    lang,
    i18n,
    mainForm,
    envId,
    onSubmit,
    navigate,
    createLoading,
    updateLoading,
    handleCancelClick,
  };
};
