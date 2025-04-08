import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettingsPopupContext } from "../../../../providers";
import { useVersionHistoryExcel } from "@/services/environmentService";
import { store } from "@/store";
import { format } from "date-fns";

export const useActivityFeedHeaderProps = ({
  setActionValue,
  dateFilters,
  actionType,
}) => {
  const envId = store.getState().company.environmentId;

  const { searchParams } = useSettingsPopupContext();

  const { i18n } = useTranslation();

  const { refetch, isLoading } = useVersionHistoryExcel(
    {
      envId: envId,
      action_type: actionType?.value,
      collection: searchParams.get("collection"),
      user_info: searchParams.get("user_info"),
      from_date: dateFilters?.$gte
        ? format(dateFilters?.$gte, "yyyy-MM-dd")
        : undefined,
      to_date: dateFilters?.$lt
        ? format(dateFilters?.$lt, "yyyy-MM-dd")
        : undefined,
    },
    {
      enabled: false,
      onSuccess(data) {
        window.open("https://" + data.link, "_blank");
      },
    }
  );

  const handleDownloadExcel = (e) => {
    e.preventDefault();
    if (!isLoading) refetch();
  };

  return { i18n, handleDownloadExcel };
};
