import {Box} from "@mui/material";
import {useEffect, useState} from "react";
import style from "../style.module.scss";
import ActivityFeedHeader from "./ActivityFeedHeader";
import ActivityFeedTable from "./ActivityFeedTable";
import {endOfMonth, format, startOfMonth} from "date-fns";
import {getAllFromDB} from "../../../../../utils/languageDB";

const ActivityFeedPage = () => {
  const [histories, setHistories] = useState(null);
  const [activityLan, setActivityLan] = useState(null);
  const [dateFilters, setDateFilters] = useState({
    $gte: startOfMonth(new Date()),
    $lt: endOfMonth(new Date()),
  });

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setActivityLan(
          formattedData?.find((item) => item?.key === "Activity Logs")
        );
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Box className={style.activity}>
        <ActivityFeedHeader
          histories={histories?.histories}
          setDateFilters={setDateFilters}
          dateFilters={dateFilters}
          activityLan={activityLan}
        />
        <ActivityFeedTable
          setHistories={setHistories}
          dateFilters={dateFilters}
        />
      </Box>
    </>
  );
};

export default ActivityFeedPage;
