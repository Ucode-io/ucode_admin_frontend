import { useEffect, useRef, useState } from "react";
import { store } from "@/store";
import { useVersionHistoryListQuery } from "@/services/environmentService";
import { pageToOffset } from "@/utils/pageToOffset";
import { format } from "date-fns";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import { useGetLang } from "@/hooks/useGetLang";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { settingsModalActions } from "../../../../../../store/settingsModal/settingsModal.slice";

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
  { label: "Upsert Many Item", value: "UPSERT MANY ITEM" },
];

export const useActivityFeedTableProps = ({
  setHistories,
  requestType = "GLOBAL",
  apiKey,
  dateFilters,
  actionType,
  setActionType,
}) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const tableLan = useGetLang("Activity Logs");

  const [inputValue, setInputValue] = useState("");
  const [actionValue, setActionValue] = useState({});

  const company = store.getState().company;
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const [collectionText, setCollectionText] = useState("");
  const [userInfoText, setUserInfoText] = useState("");

  const collectionRef = useRef();
  const userInfoRef = useRef();

  const onCollectionChange = (e) => {
    setCollectionText(e.target.value);
  };

  const onUserInfoChange = (e) => {
    setUserInfoText(e.target.value);
  };

  const onCollectionClick = () => {
    setIsCollectionOpen((prev) => !prev);
    setIsUserInfoOpen(false);
  };

  const onUserInfoClick = () => {
    setIsUserInfoOpen((prev) => !prev);
    setIsCollectionOpen(false);
  };

  const handleActivityClick = (id) => {
    dispatch(
      settingsModalActions.setTab(
        TAB_COMPONENTS.ACTIVITY_LOGS.ACTIVITY_LOGS_DETAIL
      )
    );
    dispatch(settingsModalActions.setActivityLogId(id));
  };

  const changeHandler = (newValue) => {
    setActionValue(newValue);
    setActionType(newValue || {});
  };

  const { data: histories, isLoading: versionHistoryLoader } =
    useVersionHistoryListQuery({
      envId: company.environmentId,
      params: {
        type: requestType,
        limit: 10,
        offset: actionValue?.value ? 0 : pageToOffset(currentPage),
        api_key: apiKey,
        action_type: actionValue?.value || "",
        collection: collectionText || "",
        user_info: userInfoText || "",
        from_date: dateFilters?.$gte
          ? format(dateFilters?.$gte, "yyyy-MM-dd")
          : undefined,
        to_date: dateFilters?.$lte
          ? format(dateFilters?.$lte, "yyyy-MM-dd")
          : undefined,
      },
      queryParams: {
        onSuccess: (res) => {
          setHistories(res);
          setPageCount(Math.ceil(res?.count / 10));
        },
      },
    });

  const onWindowClick = (e) => {
    if (
      e.target.contains(collectionRef.current) ||
      e.target.contains(userInfoRef.current)
    ) {
      return;
    }

    setIsCollectionOpen(false);
    setIsUserInfoOpen(false);

    // if (anchorEl && !anchorEl.contains(e.target)) {
    //   setOpen(false);
    // }
  };

  useEffect(() => {
    window.addEventListener("click", onWindowClick);

    return () => {
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  return {
    pageCount,
    currentPage,
    setCurrentPage,
    handleActivityClick,
    histories,
    versionHistoryLoader,
    tableLan,
    i18n,
    onCollectionChange,
    onUserInfoChange,
    collectionText,
    userInfoText,
    onCollectionClick,
    isCollectionOpen,
    isUserInfoOpen,
    onUserInfoClick,
    collectionRef,
    userInfoRef,
    inputValue,
    setInputValue,
    actionOptions,
    changeHandler,
    actionType,
  };
};
