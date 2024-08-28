import React, {useMemo, useState} from "react";
import styles from "./style.module.scss";
import CPagination from "../../Table1CUi/TableComponent/NewCPagination";
import {Box} from "@mui/material";
import DetailPageHead from "./DetailPageHead";
import CellElementGenerator from "../../../../components/ElementGenerators/CellElementGenerator";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useMenuGetByIdQuery} from "../../../../services/menuService";
import AddRow from "./AddRow";
import AddIcon from "@mui/icons-material/Add";

const DetailPageTableBody = ({
  fields,
  tableData,
  setLimit,
  setOffset,
  limit,
  offset = 1,
  count,
  view,
  field,
  relatedTableSlug,
  computedColumn,
  addRow,
  setAddRow,
  handleAddRowClick,
}) => {
  const {appId, tableSlug} = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const currentPage = offset === 0 ? 1 : offset + 1;

  const {loader: menuLoader} = useMenuGetByIdQuery({
    menuId: searchParams.get("menuId"),
    queryParams: {
      enabled: Boolean(searchParams.get("menuId")),
      onSuccess: (res) => {
        setMenuItem(res);
      },
    },
  });

  return (
    <div className={styles.table_container}>
      <table className={styles.custom_table}>
        <thead>
          <tr>
            <th style={{width: "40px", textAlign: "center"}}>№</th>
            {computedColumn?.map((column) => (
              <DetailPageHead
                relatedTableSlug={relatedTableSlug}
                view={view}
                column={column}
                fields={fields}
              />
            ))}
            <th style={{width: "60px"}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, index) => (
            <tr
              style={{cursor: "pointer"}}
              onClick={() => {
                navigate(
                  `/main/${appId}/1c/${relatedTableSlug}/${row?.guid}?menuId=${menuItem?.id}`
                );
              }}
              key={index}>
              <td style={{textAlign: "center"}}>
                {limit === "all" ? index + 1 : currentPage + index}
              </td>
              {computedColumn?.map((field) => (
                <td>
                  <CellElementGenerator row={row} field={field} />
                </td>
              ))}
              <td></td>
            </tr>
          ))}

          {addRow && (
            <AddRow
              fields={computedColumn}
              relatedTableSlug={relatedTableSlug}
              view={view}
              data={tableData}
              setAddRow={setAddRow}
              padding={"5px"}
            />
          )}
          {!addRow && (
            <tr style={{borderBottom: "1px solid #fff", borderTop: "none"}}>
              <td
                onClick={handleAddRowClick}
                style={{
                  padding: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  borderTop: "none",
                  cursor: "pointer",
                }}>
                <AddIcon sx={{fontSize: "20px", color: "#000"}} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Box
        sx={{
          position: "sticky",
          left: 0,
          bottom: 0,
          width: "100%",
        }}>
        <CPagination
          limit={limit}
          setLimit={setLimit}
          offset={offset}
          setOffset={setOffset}
          count={count}
        />
      </Box>
    </div>
  );
};

export default DetailPageTableBody;
