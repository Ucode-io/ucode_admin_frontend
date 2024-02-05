import CustomDrawer from "./Drawer";
import CloseIcon from '@mui/icons-material/Close';
import style from "../style.module.scss";
import { Box, Typography } from "@mui/material";
import WidgetsIcon from '@mui/icons-material/Widgets';
const ActivitySinglePage = ({ open, closeDrawer, }) => {


    return (
        <CustomDrawer
            title={"Start Node"}
            onClose={closeDrawer}
            open={open}
            className={style.drawer}
        >
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
        </CustomDrawer>
    );
};

export default ActivitySinglePage;
