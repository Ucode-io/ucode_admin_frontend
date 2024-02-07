import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Typography } from "@mui/material";
import style from "../style.module.scss";
import FiltersBlock from '../../../../FiltersBlock';
import CRangePickerNew from '../../../../DatePickers/CRangePickerNew';
import { useState } from 'react';
import { endOfMonth, startOfMonth } from "date-fns";


const ActivityFeedHeader = ({ histories }) => {
    const [dateFilters, setDateFilters] = useState({
        $gte: startOfMonth(new Date()),
        $lt: endOfMonth(new Date()),
    });
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
            {/* <FiltersBlock >
                <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
            </FiltersBlock> */}
        </>
    );
};

export default ActivityFeedHeader;
