import TableCard from "../../../../TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../CTable";
import Tag from "../../../../Tag";
import {ActivityFeedColors} from "../../../../Status";
import style from "../style.module.scss";
import {store} from "../../../../../store";
import {useEffect, useState} from "react";
import ActivitySinglePage from "./ActivitySinglePage";
import EmptyDataComponent from "../../../../EmptyDataComponent";
import {Backdrop} from "@mui/material";
import RingLoaderWithWrapper from "../../../../Loaders/RingLoader/RingLoaderWithWrapper";
import {format} from "date-fns";
import apiKeyService from "../../../../../services/apiKey.service";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

const TokensTable = ({
  setHistories,
  type = "withoutPadding",
  requestType = "GLOBAL",
  apiKey,
  actionByVisible = true,
  dateFilters,
  mainForm,
}) => {
  const company = store.getState().company;
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [id, setId] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const projectId = useSelector((state) => state.auth.projectId);
  const [data, setData] = useState();

  const openDrawer = (id) => {
    setId(id);
    setDrawerIsOpen(true);
  };

  const closeDrawer = () => {
    setDrawerIsOpen(false);
  };

  const getList = () => {
    const params = {
      client_id: mainForm.watch("client_id"),
    };
    apiKeyService
      .getListTokens(projectId, params)
      .then((res) => {
        setData(res?.client_tokens);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  //   if (data?.lenght)
  //     return (
  //       <Backdrop sx={{zIndex: (theme) => theme.zIndex.drawer + 999}} open={true}>
  //         <RingLoaderWithWrapper />
  //       </Backdrop>
  //     );
  console.log("datadata", data);
  return (
    <>
      <TableCard type={type}>
        <CTable
          loader={false}
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell width={130}>Client Id</CTableCell>

            <CTableCell>Given time</CTableCell>
            <CTableCell>Info</CTableCell>
          </CTableHead>
          <CTableBody loader={false} columnsCount={5} dataLength={1}>
            {data?.map((element, index) => {
              return (
                <CTableRow
                  height="50px"
                  className={style.row}
                  key={element.id}
                  //   onClick={() => {
                  //     openDrawer(element?.id);
                  //   }}
                  style={{
                    width: "80px",
                  }}>
                  <CTableCell>{(currentPage - 1) * 10 + index + 1}</CTableCell>
                  <CTableCell>{element?.client_id}</CTableCell>
                  <CTableCell>
                    {format(new Date(element?.given_time), "dd-mm-yyyy")}
                  </CTableCell>
                  <CTableCell>
                    {JSON.stringify(JSON.parse(element.info), null, 2)}
                  </CTableCell>
                  {actionByVisible && (
                    <CTableCell>{element?.user_info}</CTableCell>
                  )}
                </CTableRow>
              );
            })}
            <EmptyDataComponent
              columnsCount={5}
              //   isVisible={!histories?.histories}
            />
          </CTableBody>
        </CTable>
      </TableCard>

      <ActivitySinglePage
        open={drawerIsOpen}
        closeDrawer={closeDrawer}
        // history={history}
        // versionHistoryByIdLoader={versionHistoryByIdLoader}
      />
    </>
  );
};

export default TokensTable;
