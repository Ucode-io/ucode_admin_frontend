import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import microfrontendService from "@/services/microfrontendService";
import {useTranslation} from "react-i18next";
import { useGetLang } from "@/hooks/useGetLang";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "../../../../utils/constants/settingsPopup";

export const useMicroFrontendProps = () => {

  const {searchParams, setSearchParams} = useSettingsPopupContext();

  const navigate = useNavigate();
  const {appId} = useParams();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [debounceValue, setDebouncedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const {i18n} = useTranslation();
  const microLan = useGetLang("Setting");

  const navigateToEditForm = (id) => {
    setSearchParams({ tab: TAB_COMPONENTS.MICROFRONTEND.MICROFRONTEND_DETAIL, microfrontendId: id })
  };

  const navigateToCreateForm = () => {
    setSearchParams({ tab: TAB_COMPONENTS.MICROFRONTEND.MICROFRONTEND_DETAIL })
  };

  const deleteTable = (id) => {
    microfrontendService.delete(id).then(() => {
      getMicrofrontendList();
    });
  };

  const getMicrofrontendList = () => {
    microfrontendService
      .getList({
        search: debounceValue,
        offset: currentPage * 10,
      })
      .then((res) => {
        setList(res);
      });
  };

  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  useEffect(() => {
    getMicrofrontendList();
  }, [debounceValue, currentPage]);

  return {
    loader,
    list,
    setCurrentPage,
    i18n,
    microLan,
    navigateToEditForm,
    navigateToCreateForm,
    deleteTable,
    inputChangeHandler,
  }
}
