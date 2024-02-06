import { Box, Skeleton } from "@mui/material";
import style from "../style.module.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ActivityFeedHeader from "./ActivityFeedHeader";
import menuService from "../../../../../services/menuService";
import ActivityFeedTable from "./ActivityFeedTable";
import ActivitySinglePage from "./ActivitySinglePage";
import { useVersionHistoryByIdQuery, useVersionHistoryListQuery } from "../../../../../services/environmentService";
import { store } from "../../../../../store";

const ActivityFeedPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [menuItem, setMenuItem] = useState(null);
    const company = store.getState().company;
    const navigate = useNavigate()
    const { appId, logId } = useParams();
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const openDrawer = (id) => {
        setDrawerIsOpen(true);
        navigate(`/main/${appId}/activity/${id}`);
    };

    const closeDrawer = () => {
        setDrawerIsOpen(false)
        navigate(`/main/${appId}/activity`);
    };

    const { data: histories, isLoading: versionHistoryLoader } =
        useVersionHistoryListQuery({
            envId: company.environmentId,
            params: {
                type: "GLOBAL"
            }
        });


    const { data: history, isLoading: versionHistoryByIdLoader } =
        useVersionHistoryByIdQuery({
            envId: company.environmentId,
            id: logId,
            queryParams: {
                enabled: !!Boolean(logId)
            }
        });

    console.log("history", history)

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
                history={history}
                versionHistoryByIdLoader={versionHistoryByIdLoader}
            />
        </>
    );
};

export default ActivityFeedPage;
