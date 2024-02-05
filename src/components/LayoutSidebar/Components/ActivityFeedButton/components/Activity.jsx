import { Box } from "@mui/material";
import style from "../style.module.scss";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ActivityFeedHeader from "./ActivityFeedHeader";
import menuService from "../../../../../services/menuService";
import ActivityFeedTable from "./ActivityFeedTable";
import ActivitySinglePage from "./ActivitySinglePage";
import { useVersionHistoryListQuery } from "../../../../../services/environmentService";
import { store } from "../../../../../store";

const ActivityFeedPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [menuItem, setMenuItem] = useState(null);
    const company = store.getState().company;
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const openDrawer = () => {
        setDrawerIsOpen(true);
    };

    const closeDrawer = () => setDrawerIsOpen(false);

    const { data: histories, isLoading: environmentLoading } =
        useVersionHistoryListQuery({
            envId: company.environmentId
        });

    useEffect(() => {
        if (searchParams.get("menuId")) {
            menuService
                .getByID({
                    menuId: searchParams.get("menuId"),
                })
                .then((res) => {
                    setMenuItem(res);
                });
        }
    }, []);


    return (
        <>
            <Box className={style.activity}>
                <ActivityFeedHeader menuItem={menuItem} histories={histories?.histories} />
                <ActivityFeedTable openDrawer={openDrawer} histories={histories?.histories} />
            </Box>

            <ActivitySinglePage
                open={drawerIsOpen}
                closeDrawer={closeDrawer}
            />
        </>
    );
};

export default ActivityFeedPage;
