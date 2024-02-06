import CustomDrawer from "./Drawer";
import CloseIcon from '@mui/icons-material/Close';
import style from "../style.module.scss";
import { Box, Typography } from "@mui/material";
import WidgetsIcon from '@mui/icons-material/Widgets';
import RingLoaderWithWrapper from "../../../../Loaders/RingLoader/RingLoaderWithWrapper";


const ActivitySinglePage = ({ open, closeDrawer, history, versionHistoryByIdLoader }) => {

    return (
        <CustomDrawer
            title={"Start Node"}
            onClose={closeDrawer}
            open={open}
            className={style.drawer}
        >
            {versionHistoryByIdLoader ? (
                <RingLoaderWithWrapper style={{ height: "100%" }} />
            ) : (
                <>
                    <div className={style.addicon} onClick={closeDrawer}>
                        <CloseIcon />
                    </div>
                    <Box className={style.header}>
                        <Box className={style.leftside}>
                            <div className={style.foldericon}>
                                <WidgetsIcon />
                            </div>
                            <Typography variant="h3">Activity Item</Typography>
                        </Box>
                    </Box>

                    <Box className={style.content}>
                        <Box className={style.card}>
                            <Typography variant="h6">User:</Typography>
                            <Typography variant="p">Shohrux</Typography>
                        </Box>
                        <Box className={style.card}>
                            <Typography variant="h6">Action:</Typography>
                            <Typography variant="p">{history?.action_type}</Typography>
                        </Box>
                        <Box className={style.card}>
                            <Typography variant="h6">Date:</Typography>
                            <Typography variant="p">{history?.date}</Typography>
                        </Box>
                        <Box className={style.card}>
                            <Typography variant="h6">Collection:</Typography>
                            <Typography variant="p">{history?.date}</Typography>
                        </Box>
                    </Box>
                </>
            )}
        </CustomDrawer >
    );
};

export default ActivitySinglePage;
