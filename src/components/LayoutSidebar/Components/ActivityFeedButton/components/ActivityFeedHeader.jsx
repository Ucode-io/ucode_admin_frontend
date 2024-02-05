import { Box, Tooltip, Typography } from "@mui/material";
import style from "../style.module.scss";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import AddIcon from "@mui/icons-material/Add";
import { useQueryClient } from "react-query";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ActivityFeedHeader = ({ menuItem, histories }) => {
    const queryClient = useQueryClient();


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
