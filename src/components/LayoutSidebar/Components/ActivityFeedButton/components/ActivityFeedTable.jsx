import TableCard from "../../../../TableCard";
import { CTable, CTableBody, CTableCell, CTableHead, CTableRow } from "../../../../CTable";
import Tag from "../../../../Tag";
import { ActivityFeedBackground, ActivityFeedColors } from "../../../../Status";
import style from '../style.module.scss'
import { store } from "../../../../../store";
import { useState } from "react";
import ActivitySinglePage from "./ActivitySinglePage";
import { useVersionHistoryByIdQuery, useVersionHistoryListQuery } from "../../../../../services/environmentService";
import EmptyDataComponent from "../../../../EmptyDataComponent";
import { pageToOffset } from "../../../../../utils/pageToOffset";
import { Backdrop } from "@mui/material";
import RingLoaderWithWrapper from "../../../../Loaders/RingLoader/RingLoaderWithWrapper";

const ActivityFeedTable = ({ setHistories, type = "withoutPadding", requestType = "GLOBAL", apiKey, actionByVisible = true }) => {
    const company = store.getState().company;
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const [id, setId] = useState(null)
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);


    const openDrawer = (id) => {
        setId(id)
        setDrawerIsOpen(true);
    };

    const closeDrawer = () => {
        setDrawerIsOpen(false)
    };

    const { data: histories, isLoading: versionHistoryLoader } =
        useVersionHistoryListQuery({
            envId: company.environmentId,
            params: {
                type: requestType,
                limit: 10,
                offset: pageToOffset(currentPage),
                api_key: apiKey
            },
            queryParams: {
                onSuccess: (res) => {
                    setHistories(res);
                    setPageCount(Math.ceil(res?.count / 10));
                }
            }
        });



    const { data: history, isLoading: versionHistoryByIdLoader } =
        useVersionHistoryByIdQuery({
            envId: company.environmentId,
            id: id,
            queryParams: {
                enabled: !!Boolean(id)
            }
        });

    if (versionHistoryLoader)
        return (
            <Backdrop
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={true}
            >
                <RingLoaderWithWrapper />
            </Backdrop>
        )

    return (
        <>
            <TableCard type={type}>
                <CTable loader={false} removableHeight={false} count={pageCount}
                    page={currentPage}
                    setCurrentPage={setCurrentPage}>
                    <CTableHead>
                        <CTableCell width={10}>№</CTableCell>
                        <CTableCell width={110}>Action</CTableCell>
                        <CTableCell>Collection</CTableCell>
                        <CTableCell>Action On</CTableCell>
                        {actionByVisible && <CTableCell>Action By</CTableCell>}
                    </CTableHead>
                    <CTableBody loader={false} columnsCount={5} dataLength={histories?.histories?.length}
                    >
                        {histories?.histories?.map((element, index) => (
                            <CTableRow height="50px" className={style.row} key={element.id} onClick={() => {
                                openDrawer(element?.id)
                            }} style={{
                                background: `${ActivityFeedBackground(element?.action_type)}`,
                                width: '80px',
                            }}>
                                <CTableCell>{(currentPage - 1) * 10 + index + 1}</CTableCell>
                                <CTableCell>
                                    <Tag
                                        shape="subtle"
                                        color={ActivityFeedColors(element?.action_type)}
                                        size="large"
                                        style={{
                                            background: `${ActivityFeedColors(element?.action_type)}`,
                                        }}
                                        className={style.tag}
                                    >
                                        {element?.action_type}
                                    </Tag>
                                </CTableCell>
                                <CTableCell>{element?.table_slug}</CTableCell>
                                <CTableCell>{element?.date}</CTableCell>
                                {actionByVisible && <CTableCell>{element?.user_info}</CTableCell>}
                            </CTableRow>
                        ))}
                        <EmptyDataComponent
                            columnsCount={5}
                            isVisible={!histories?.histories}
                        />
                    </CTableBody>
                </CTable>
            </TableCard >

            <ActivitySinglePage
                open={drawerIsOpen}
                closeDrawer={closeDrawer}
                history={history}
                versionHistoryByIdLoader={versionHistoryByIdLoader}
            />
        </>
    );
};

export default ActivityFeedTable;
