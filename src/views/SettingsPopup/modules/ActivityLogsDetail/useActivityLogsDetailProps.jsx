import { zonedTimeToUtc } from "date-fns-tz"
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "@/store/alert/alert.thunk";
import { store } from "@/store";
import { useVersionHistoryByIdQuery } from "@/services/environmentService";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";

export const useActivityLogsDetailProps = () => {
  const id = useSelector((state) => state.settingsModal.activityLogId);

  const company = store.getState().company;

  const dispatch = useDispatch();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const copyJson = (text) => {
    dispatch(showAlert("Copied to clipboard", "success"));
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
  };

  const onBackClick = () => dispatch(settingsModalActions.resetParams());
  
  const {data: history, isLoading: versionHistoryByIdLoader} =
    useVersionHistoryByIdQuery({
      envId: company.environmentId,
      id: id,
      queryParams: {
        enabled: !!Boolean(id),
      },
    });
  
  const utcDate = zonedTimeToUtc(history?.date, timezone)
  
  return {
    utcDate,
    copyJson,
    history,
    versionHistoryByIdLoader,
    onBackClick,
  }
}

