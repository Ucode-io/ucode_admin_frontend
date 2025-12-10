import { settingsModalActions } from "@/store/settingsModal/settingsModal.slice";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux"

export const useFunctionLogsDetailProps = () => {

  const detailData = useSelector((state) => state.settingsModal.functionLogsData);

  const dispatch = useDispatch();

  const handleBackClick = () => {
    dispatch(settingsModalActions.resetParams());
  }

  const mainData = [
    { label: "Name", value: detailData?.function_name },
    { label: "Status", value: detailData?.status },
    { label: "Request Method", value: detailData?.request_method },
    { label: "Action Type", value: detailData?.action_type },
    {
      label: "Started at",
      value: format(new Date(detailData?.send_at), "yyyy-MM-dd HH:mm:ss")
    },
    {
      label: "Completed at",
      value: format(new Date(detailData?.completed_at), "yyyy-MM-dd HH:mm:ss")
    },
    { label: "Duration", value: `${detailData?.duration}ms` },
    { label: "Table Slug", value: detailData?.table_slug },
  ];

  const data = [
    { label: "Return Size", value: detailData?.return_size },
    { label: "Compute", value: detailData?.compute },
    { label: "DB Bandwidth", value: detailData?.db_bandwidth },
    { 
      label: "File Bandwidth",
      value: detailData?.file_bandwidth,
    },
    { 
      label: "Vector Bandwidth",
      value: detailData?.vector_bandwidth,
    },
  ];


  return {
    handleBackClick,
    data,
    mainData,
  }
}
