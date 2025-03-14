import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettingsPopupContext } from "../../../../providers";
import { useVersionHistoryExcel } from "@/services/environmentService";
import { store } from "@/store";
import { format } from "date-fns";

const actionOptions = [
  { label: "Create", value: "CREATE" },
  { label: "Update", value: "UPDATE" },
  { label: "Delete", value: "DELETE" },
  { label: "Bulkwrite", value: "BULKWRITE" },
  { label: "Get", value: "GET" },
  { label: "Login", value: "LOGIN" },
  { label: "Delete Item", value: "DELETE ITEM" },
  { label: "Create Item", value: "CREATE ITEM" },
  { label: "Update Item", value: "UPDATE ITEM" },
  { label: "Create Table", value: "CREATE TABLE" },
  { label: "Update Table", value: "UPDATE TABLE" },
  { label: "Delete Table", value: "DELETE TABLE" },
  { label: "Create Menu", value: "CREATE MENU" },
  { label: "Delete Menu", value: "DELETE MENU" },
  { label: "Update Menu", value: "UPDATE MENU" },
  { label: "Create Field", value: "CREATE FIELD" },
  { label: "Update Field", value: "UPDATE FIELD" },
  { label: "Delete Field", value: "DELETE FIELD" },
  { label: "Create View", value: "CREATE VIEW" },
  { label: "Delete View", value: "DELETE VIEW" },
  { label: "Update View", value: "UPDATE VIEW" },
  { label: "Create Relation", value: "CREATE RELATION" },
  { label: "Delete Relation", value: "DELETE RELATION" },
  { label: "Update Relation", value: "UPDATE RELATION" },
  { label: "Delete Layout", value: "DELETE LAYOUT" },
  { label: "Update Layout", value: "UPDATE LAYOUT" },
  { label: "Create Client Type", value: "CREATE CLIENT TYPE" },
  { label: "Update Client Type", value: "UPDATE CLIENT TYPE" },
  { label: "Delete Client Type", value: "DELETE CLIENT TYPE" },
  { label: "Create Role", value: "CREATE ROLE" },
  { label: "Delete Role", value: "DELETE ROLE" },
  { label: "Update Permission", value: "UPDATE PERMISSION" },
  { label: "Create User", value: "CREATE USER" },
  { label: "Update User", value: "UPDATE USER" },
  { label: "Delete User", value: "DELETE USER" },
  { label: "Upsert Many Item", value: "UPSERT MANY ITEM" }
];

export const useActivityFeedHeaderProps = ({ setActionValue, dateFilters }) => {
  const envId = store.getState().company.environmentId;

  const {searchParams} = useSettingsPopupContext();

  const [inputValue, setInputValue] = useState("");
  const [actionType, setActionType] = useState("");
  const {i18n} = useTranslation();

  const {data} = useVersionHistoryExcel({
    envId: envId,
    action_type: actionType?.value,
    collection: searchParams.get("collection"),
    user_info: searchParams.get("user_info"),
    from_date: dateFilters?.$gte
      ? format(dateFilters?.$gte, "yyyy-MM-dd")
      : undefined,
    to_date: dateFilters?.$lt
      ? format(dateFilters?.$lt, "yyyy-MM-dd")
      : undefined
  });

  const changeHandler = (newValue) => {
    setActionValue(newValue);
    setActionType(newValue || {});
  }

  return {
    inputValue,
    setInputValue,
    i18n,
    actionOptions,
    changeHandler,
    link: data?.link,
    actionType,
  }
}
