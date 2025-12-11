import { useFunctionsListQuery, useGetActivityFunctionLogs } from "@/services/functionService";
import { settingsModalActions } from "@/store/settingsModal/settingsModal.slice";
import { TAB_COMPONENTS } from "@/utils/constants/settingsPopup";
import { pageToOffset } from "@/utils/pageToOffset";
// import { pageToOffset } from "@/utils/pageToOffset";
import { useState } from "react";
import { useDispatch } from "react-redux";

export const useFunctionLogsProps = () => {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");

  const [functionValue, setFunctionValue] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState(null);

  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // const [limitFunctionList] = useState(10);
  // const [offsetFunctionList, setOffsetFunctionList] = useState(1);

  const [functionOptions, setFunctionOptions] = useState([]);

  const statusOptions = [
    {
      label: "Success",
      value: "success",
    },
    {
      label: "Error",
      value: "error",
    },
  ];

  const getStatusColors = (status) => {
    switch (status) {
      case "success":
        return "rgb(73, 204, 144)";
      case "error":
        return "#F56565";
      default:
        return "#A0AEC0";
    }
  };

  const changeHandler = (newValue) => {
    setFunctionValue(newValue);
  };

  const changeStatusHandler = (newValue) => {
    setSelectedStatus(newValue);
  };

  const onRowClick = (element) => {
    dispatch(
      settingsModalActions.setTab(
        TAB_COMPONENTS.ACTIVITY_LOGS.FUNCTION_LOGS_DETAIL,
      ),
    );
    dispatch(settingsModalActions.setFunctionLogsData(element));
  };

  const { data, isLoading } = useGetActivityFunctionLogs({
    queryParams: {
      onSuccess(data) {
        setPageCount(Math.ceil(data?.total_count / 10));
      },
    },
    params: {
      function_id: functionValue?.value || null,
      status: selectedStatus?.value || null,
      limit: 10,
      offset: pageToOffset(currentPage, 10),
    },
  });

  useFunctionsListQuery({
    params: {
      search: inputValue,
      // limit: limitFunctionList,
      // offset: pageToOffset(offsetFunctionList, limitFunctionList),
    },
    queryParams: {
      onSuccess(data) {
        setFunctionOptions(
          data?.functions?.map((item) => ({
            value: item?.id,
            label: item?.name,
          })),
        );
      },
    },
  });

  const onMenuScrollToBottom = () => {
    // setOffsetFunctionList((prev) => prev + 1);
  };

  const functionLogs = selectedStatus
    ? data?.function_logs?.filter(
        (item) => item?.status === selectedStatus?.value,
      )
    : data?.function_logs;

  const totalCount = data?.total_count;

  return {
    inputValue,
    setInputValue,
    functionValue,
    pageCount,
    currentPage,
    setCurrentPage,
    changeHandler,
    totalCount,
    functionOptions,
    functionLogs,
    onRowClick,
    isLoading,
    statusOptions,
    changeStatusHandler,
    selectedStatus,
    onMenuScrollToBottom,
    getStatusColors,
  };
};
