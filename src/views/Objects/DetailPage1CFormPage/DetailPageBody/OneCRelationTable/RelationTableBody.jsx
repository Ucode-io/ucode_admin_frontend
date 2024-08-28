import React from "react";
import styles from "./style.module.scss";
import CellElementGenerator from "../../../../../components/ElementGenerators/CellElementGenerator";
import {useNavigate, useParams} from "react-router-dom";

function RelationTableBody({
  columns,
  item,
  view,
  tableData,
  control,
  menuItem,
  index,
  offset,
  limit,
}) {
  const {appId} = useParams();
  const navigate = useNavigate();
  const currentPage = offset === 0 ? 1 : offset + 1;

  return (
    <tr
      style={{cursor: "pointer"}}
      key={item.guid}
      className={styles.child_row}>
      <td style={{textAlign: "center"}}>
        {limit === "all" ? index + 1 : currentPage + index}
      </td>
      {columns?.map((col, index) => (
        <td
          onClick={() => {
            navigate(
              `/main/${appId}/1c/${view?.relation_table_slug}/${item?.guid}?menuId=${menuItem?.id}`,
              {
                state: {
                  label: item?.[col?.slug],
                },
              }
            );
          }}
          style={{height: "35px"}}
          //   style={{
          //     position: `${
          //       tableSettings?.[pageName]?.find(
          //         (item) => item?.id === col?.id
          //       )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
          //         ? "sticky"
          //         : "relative"
          //     }`,
          //     left: view?.attributes?.fixedColumns?.[col?.id]
          //       ? `${calculateWidthFixedColumn(col.id, columns) + 0}px`
          //       : "0",
          //     backgroundColor: `${
          //       tableSettings?.[pageName]?.find(
          //         (item) => item?.id === col?.id
          //       )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
          //         ? "#F6F6F6"
          //         : "#fff"
          //     }`,
          //     zIndex: `${
          //       tableSettings?.[pageName]?.find(
          //         (item) => item?.id === col?.id
          //       )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
          //         ? "1"
          //         : "0"
          //     }`,
          //   }}
          key={index}>
          <CellElementGenerator row={item} field={col} />
        </td>
      ))}
      <td></td>
    </tr>
  );
}

export default RelationTableBody;
