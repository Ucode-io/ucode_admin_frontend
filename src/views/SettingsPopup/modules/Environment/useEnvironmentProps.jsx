import { useTranslation } from "react-i18next";
import { useGetLang } from "../../../../hooks/useGetLang"
import { useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { store } from "../../../../store";
import { useEnvironmentDeleteMutation, useEnvironmentListQuery } from "../../../../services/environmentService";
import { showAlert } from "../../../../store/alert/alert.thunk";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "../../constants";

export const useEnvironmentProps = () => {
  const { i18n } = useTranslation();
  const lang = useGetLang("Setting");

  const {
    setSearchParams,
  } = useSettingsPopupContext();

  const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const projectId = store.getState().company.projectId;
  
    const navigateToEditForm = (id) => {
      setSearchParams({ tab: TAB_COMPONENTS.ENVIRONMENTS.EDIT_ENVIRONMENT, envId: id });
    };
  
    const navigateToCreateForm = () => {
      setSearchParams({ tab: TAB_COMPONENTS.ENVIRONMENTS.CREATE_ENVIRONMENT });
    };
  
    const {data: environments, isLoading: environmentLoading} =
      useEnvironmentListQuery({
        params: {
          project_id: projectId,
        },
      });
  
    const {mutateAsync: deleteEnv, isLoading: createLoading} =
      useEnvironmentDeleteMutation({
        onSuccess: () => {
          queryClient.refetchQueries(["ENVIRONMENT"]);
          store.dispatch(showAlert("Успешно", "success"));
        },
      });
  
    const deleteEnvironment = (id) => {
      deleteEnv(id);
    };

  return { 
    lang,
    i18n,
    environmentLoading,
    environments,
    navigateToEditForm,
    deleteEnvironment,
    navigateToCreateForm,
  }
}
