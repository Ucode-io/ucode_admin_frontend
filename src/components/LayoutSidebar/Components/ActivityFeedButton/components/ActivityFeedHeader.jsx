import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Typography } from "@mui/material";
import style from "../style.module.scss";

const ActivityFeedHeader = ({ histories }) => {
    return (
        <>
            <Box className={style.header}>
                <Box className={style.leftside}>
                    <div className={style.foldericon}>
                        <AccessTimeIcon />
                    </div>
                    <Typography variant="h3">Activity Feed</Typography>
                </Box>
                <Box className={style.rightside}>
                    <Typography variant="h5" className={style.itemtitle}>
                        {histories?.length || "0"} Items
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default ActivityFeedHeader;
