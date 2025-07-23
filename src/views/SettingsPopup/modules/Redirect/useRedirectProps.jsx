import { store } from "@/store";
import { useQueryClient } from "react-query";
import { showAlert } from "@/store/alert/alert.thunk";
import {
  useRedirectDeleteMutation,
  useRedirectListQuery,
  useRedirectUpdateReorderMutation,
} from "@/services/redirectService";
import { applyDrag } from "@/utils/applyDrag";
import { useState } from "react";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import { useDispatch } from "react-redux";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";

export const useRedirectProps = () => {
  const queryClient = useQueryClient();
  const [computedData, setComputedData] = useState();

  const { setSearchParams } = useSettingsPopupContext();

  const dispatch = useDispatch();

  const navigateToEditForm = (id) => {
    dispatch(
      settingsModalActions.setTab(TAB_COMPONENTS.REDIRECT.REDIRECT_FORM)
    );
    setSearchParams({
      redirectId: id,
    });
  };

  const navigateToCreateForm = () => {
    dispatch(
      settingsModalActions.setTab(TAB_COMPONENTS.REDIRECT.REDIRECT_FORM)
    );
  };

  const { isLoading: redirectLoading } = useRedirectListQuery({
    queryParams: {
      onSuccess: (res) => setComputedData(res?.redirect_urls),
    },
  });

  const { mutateAsync: deleteRedirect, isLoading: createLoading } =
    useRedirectDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["REDIRECT"]);
      },
    });
  const { mutateAsync: updateReorder, isLoading: reorderLoading } =
    useRedirectUpdateReorderMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["REDIRECT"]);
      },
    });

  const deleteRedirectElement = (id) => {
    deleteRedirect(id);
  };

  const onDrop = (dropResult, index) => {
    const result = applyDrag(computedData, dropResult);
    if (result) {
      setComputedData(result);
      updateReorder({ ids: result.map((item) => item?.id) });
    }
  };

  return {
    computedData,
    navigateToEditForm,
    navigateToCreateForm,
    deleteRedirectElement,
    onDrop,
  };
};
