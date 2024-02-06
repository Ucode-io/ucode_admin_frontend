import { Box } from "@mui/material";
import { useState } from "react";
import style from "../style.module.scss";
import ActivityFeedHeader from "./ActivityFeedHeader";
import ActivityFeedTable from "./ActivityFeedTable";

const ActivityFeedPage = () => {
    const [histories, setHistories] = useState(null)

    return (
        <>
            <Box className={style.activity}>
                <ActivityFeedHeader histories={histories?.histories} />
                <ActivityFeedTable setHistories={setHistories} />
            </Box>
        </>
    );
};

export default ActivityFeedPage;
