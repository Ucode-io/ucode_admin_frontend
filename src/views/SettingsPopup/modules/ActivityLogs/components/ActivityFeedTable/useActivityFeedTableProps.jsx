import { useCallback, useEffect, useRef, useState } from "react";
import { store } from "@/store";
import { 
  useVersionHistoryListQuery 
} from "@/services/environmentService";
import { pageToOffset } from "@/utils/pageToOffset";
import { format } from "date-fns";
import { useSettingsPopupContext } from "../../../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import { useGetLang } from "../../../../../../hooks/useGetLang";
import { useTranslation } from "react-i18next";

export const useActivityFeedTableProps = ({
  setHistories,
  requestType = "GLOBAL",
  apiKey,
  dateFilters,
  actionValue,
}) => {

  const {i18n} = useTranslation()

  const tableLan = useGetLang("Activity Logs");

  const company = store.getState().company;
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false);

  const {searchParams, setSearchParams, updateSearchParam} = useSettingsPopupContext();

  // const [collectionText, setCollectionText] = useState("");
  // const [userInfoText, setUserInfoText] = useState("");

  const collectionRef = useRef();
  const userInfoRef = useRef();

  const onCollectionChange = (e) => {
    updateSearchParam("collection", e.target.value);
    // setCollectionText(e.target.value);
  }

  const onUserInfoChange = (e) => {
    updateSearchParam("user_info", e.target.value);
    // setUserInfoText(e.target.value);
  }

  const onCollectionClick = () => {
    setIsCollectionOpen(prev => !prev);
    setIsUserInfoOpen(false);
  }

  const onUserInfoClick = () => {
    setIsUserInfoOpen(prev => !prev);
    setIsCollectionOpen(false);
  }

  const handleActivityClick = (id) => {
    setSearchParams({ tab: TAB_COMPONENTS.ACTIVITY_LOGS.ACTIVITY_LOGS_DETAIL, id });
  };

  const {data: histories, isLoading: versionHistoryLoader} = useVersionHistoryListQuery({
    envId: company.environmentId,
    params: {
      type: requestType,
      limit: 10,
      offset: pageToOffset(currentPage),
      api_key: apiKey,
      action_type: actionValue?.value || "",
      collection: searchParams.get("collection") || "",
      user_info: searchParams.get("user_info") || "",
      from_date: dateFilters?.$gte
      ? format(dateFilters?.$gte, "yyyy-MM-dd")
      : undefined,
      to_date: dateFilters?.$lt
      ? format(dateFilters?.$lt, "yyyy-MM-dd")
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

    if(e.target.contains(collectionRef.current) || e.target.contains(userInfoRef.current)) {
      return; 
    }

    setIsCollectionOpen(false);
    setIsUserInfoOpen(false);

    // if (anchorEl && !anchorEl.contains(e.target)) {
    //   setOpen(false);
    // }
  }

  useEffect(() => {

    window.addEventListener("click", onWindowClick)

    return () => {
      window.removeEventListener("click", onWindowClick)
    }

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
    collectionText: searchParams.get("collection") || "",
    userInfoText: searchParams.get("user_info") || "",
    onCollectionClick,
    isCollectionOpen,
    isUserInfoOpen,
    onUserInfoClick,
    collectionRef,
    userInfoRef,
  }
}
