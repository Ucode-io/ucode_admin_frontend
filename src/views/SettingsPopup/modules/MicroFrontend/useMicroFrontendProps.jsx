import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import microfrontendService from "@/services/microfrontendService";
import { useTranslation } from "react-i18next";
import { useGetLang } from "@/hooks/useGetLang";
import { TAB_COMPONENTS } from "../../../../utils/constants/settingsPopup";
import { useDispatch } from "react-redux";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";

export const useMicroFrontendProps = () => {
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [debounceValue, setDebouncedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { i18n } = useTranslation();
  const microLan = useGetLang("Setting");

  const navigateToEditForm = (id) => {
    dispatch(
      settingsModalActions.setTab(
        TAB_COMPONENTS.MICROFRONTEND.MICROFRONTEND_DETAIL
      )
    );
    dispatch(settingsModalActions.setMicrofrontendId(id));
  };

  const navigateToCreateForm = () => {
    dispatch(
      settingsModalActions.setTab(
        TAB_COMPONENTS.MICROFRONTEND.MICROFRONTEND_DETAIL
      )
    );
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
  };
};
