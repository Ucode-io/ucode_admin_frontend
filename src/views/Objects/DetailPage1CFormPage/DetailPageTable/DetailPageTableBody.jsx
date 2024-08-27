import React, {useMemo, useState} from "react";
import styles from "./style.module.scss";
import CPagination from "../../Table1CUi/TableComponent/NewCPagination";
import {Box} from "@mui/material";
import DetailPageHead from "./DetailPageHead";
import CellElementGenerator from "../../../../components/ElementGenerators/CellElementGenerator";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useMenuGetByIdQuery} from "../../../../services/menuService";
import AddRow from "./AddRow";

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
            <th style={{width: "60px", textAlign: "center"}}>№</th>
            {computedColumn?.map((column) => (
              <DetailPageHead
                relatedTableSlug={relatedTableSlug}
                view={view}
                column={column}
                fields={fields}
              />
            ))}
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
            </tr>
          ))}
          {addRow && (
            <AddRow
              fields={computedColumn}
              relatedTableSlug={relatedTableSlug}
              view={view}
              data={tableData}
              setAddRow={setAddRow}
            />
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
