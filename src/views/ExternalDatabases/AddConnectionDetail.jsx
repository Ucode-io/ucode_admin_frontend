import React, {useState} from "react";
import {useSearchParams} from "react-router-dom";
import TableCard from "../../components/TableCard";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import cls from "./style.module.scss";
import clsx from "clsx";
import {useQuery} from "react-query";
import conectionDatabaseService from "../../services/connectionDatabaseService";
import {Delete} from "@mui/icons-material";
import {Button, CircularProgress} from "@mui/material";

function AddConnectionDetail() {
  const [searchParams] = useSearchParams();
  const [loadingId, setLoadingId] = useState();

  const {data: tables, refetch} = useQuery(
    ["GET_CONNECTION_TABLES"],
    () => {
      return conectionDatabaseService.getTables(searchParams.get("connect"));
    },
    {
      select: (res) => res?.tables ?? [],
    }
  );

  const trackConnection = (id) => {
    setLoadingId(id);
    conectionDatabaseService
      .trackTable(searchParams.get("connect"), {
        table_ids: [id],
      })
      .then((res) => refetch())
      .finally(() => {
        setLoadingId(null);
      });
  };

  return (
    <>
      {" "}
      <TableCard type={"withoutPadding"}>
        <CTable disablePagination removableHeight={120}>
          <CTableHead>
            <CTableCell className={cls.tableHeadCell} width={10}>
              №
            </CTableCell>
            <CTableCell className={cls.tableHeadCell}>Name</CTableCell>
            <CTableCell className={cls.tableHeadCell}>Tracked</CTableCell>
            <CTableCell className={cls.tableHeadCell} width={60} />
          </CTableHead>
          <CTableBody columnsCount={4} dataLength={1} loader={false}>
            {tables?.map((element, index) => (
              <CTableRow key={element.id}>
                <CTableCell
                  style={{textAlign: "center"}}
                  className={cls.tBodyCell}>
                  {index + 1}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  {element?.table_name}
                </CTableCell>
                <CTableCell className={cls.tBodyCell}>
                  <Button
                    disabled={element?.is_tracked}
                    onClick={() => trackConnection(element?.id)}
                    color={element?.is_tracked ? "success" : "primary"}
                    variant={element?.is_tracked ? "contained" : "outlined"}>
                    {loadingId === element.id ? (
                      <CircularProgress size={20} />
                    ) : element?.is_tracked ? (
                      "Tracked"
                    ) : (
                      "Track"
                    )}
                  </Button>
                </CTableCell>

                <CTableCell className={clsx(cls.tBodyCell, cls.tBodyAction)}>
                  <RectangleIconButton
                    id="delete_btn"
                    color="error"
                    size="small">
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </>
  );
}

export default AddConnectionDetail;
