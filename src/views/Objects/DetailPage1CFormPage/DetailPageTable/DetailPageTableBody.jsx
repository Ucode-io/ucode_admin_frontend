import React, {useMemo, useState} from "react";
import styles from "./style.module.scss";
import CPagination from "../../Table1CUi/TableComponent/NewCPagination";
import {Box} from "@mui/material";
import DetailPageHead from "./DetailPageHead";
import CellElementGenerator from "../../../../components/ElementGenerators/CellElementGenerator";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useMenuGetByIdQuery} from "../../../../services/menuService";

const DetailPageTableBody = ({
  fields,
  tableData,
  setLimit,
  setOffset,
  limit,
  offset,
  count,
  view,
  field,
  relatedTableSlug,
  computedColumn,
}) => {
  const {appId} = useParams();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

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
            <th style={{width: "30px", textAlign: "center"}}>№</th>
            {computedColumn?.map((column) => (
              <DetailPageHead view={view} column={column} fields={fields} />
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, index) => (
            <tr
              onClick={() => {
                navigate(
                  `/main/${appId}/1c/${relatedTableSlug}/${row?.guid}?menuId=${menuItem?.id}`
                );
              }}
              key={index}>
              <td style={{textAlign: "center"}}>{index + 1}</td>
              {computedColumn?.map((field) => (
                <td>
                  <CellElementGenerator row={row} field={field} />
                </td>
              ))}
            </tr>
          ))}
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
