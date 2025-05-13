import { useActivityLogsProps } from "./useActivityLogsProps"
import {Box} from "@mui/material";
import cls from "./styles/styles.module.scss";
import { ActivityFeedHeader } from "./components/ActivityFeedHeader";
import { ActivityFeedTable } from "./components/ActivityFeedTable";

export const ActivityLogs = () => {

  const {
    histories,
    setHistories,
    dateFilters,
    setDateFilters,
    activityLan,
    actionValue,
    setActionValue,
    actionType,
    setActionType,
  } = useActivityLogsProps();

  return (
    <Box className={cls.activity}>
      <ActivityFeedHeader
        histories={histories?.histories}
        setDateFilters={setDateFilters}
        dateFilters={dateFilters}
        activityLan={activityLan}
        setActionValue={setActionValue}
        actionType={actionType}
      />
      <ActivityFeedTable
        setHistories={setHistories}
        dateFilters={dateFilters}
        actionValue={actionValue}
        activityLan={activityLan}
        actionType={actionType}
        setActionType={setActionType}
      />
    </Box>
  );
};
