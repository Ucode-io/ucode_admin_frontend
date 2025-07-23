import {useEffect, useState} from "react";
import constructorFunctionService from "@/services/constructorFunctionService";
import {useQueryClient} from "react-query";
import {useFunctionDeleteMutation} from "@/services/functionService";
import useDebounce from "@/hooks/useDebounce";
import { useSettingsPopupContext } from "../../providers";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import { useDispatch } from "react-redux";
import { settingsModalActions } from "../../../../store/settingsModal/settingsModal.slice";

export const useFunctionsProps = () => {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);

  const [debounceValue, setDebouncedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const { searchParams, setSearchParams } = useSettingsPopupContext();

  const navigateToEditForm = (id) => {
    dispatch(
      settingsModalActions.setTab(TAB_COMPONENTS.FUNCTIONS.FUNCTIONS_DETAIL)
    );
    // setSearchParams({ tab: TAB_COMPONENTS.FUNCTIONS.FUNCTIONS_DETAIL, functionId: id });
    // navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    dispatch(
      settingsModalActions.setTab(TAB_COMPONENTS.FUNCTIONS.FUNCTIONS_DETAIL)
    );
    setSearchParams({ create: true });
    // navigate(`${location.pathname}/create`);
  };

  const deleteTable = (id) => {
    constructorFunctionService.delete(id).then(() => {
      getList();
    });
  };

  const getList = () => {
    setLoader(true);
    constructorFunctionService
      .getList({
        search: debounceValue,
        limit: 10,
        offset: currentPage * 10,
      })
      .then((res) => {
        setList(res);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const { mutate: deleteFunction, isLoading: deleteFunctionLoading } =
    useFunctionDeleteMutation({
      onSuccess: () => getList(),
    });

  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  useEffect(() => {
    getList();
  }, [debounceValue, currentPage]);

  return {
    loader,
    list,
    setCurrentPage,
    navigateToEditForm,
    navigateToCreateForm,
    deleteFunction,
    inputChangeHandler,
  };
};
