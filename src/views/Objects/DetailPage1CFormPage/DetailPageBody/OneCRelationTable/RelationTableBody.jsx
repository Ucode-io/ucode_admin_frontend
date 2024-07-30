import React from "react";
import styles from "./style.module.scss";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import CellElementGenerator from "../../../../../components/ElementGenerators/CellElementGenerator";
import {useNavigate, useParams} from "react-router-dom";

function RelationTableBody({
  columns,
  item,
  view,
  tableData,
  control,
  menuItem,
}) {
  const {appId} = useParams();
  const navigate = useNavigate();
  return (
    <tr
      onClick={() => {
        navigate(
          `/main/${appId}/1c/${view?.relation_table_slug}/${item?.guid}?menuId=${menuItem?.id}`
        );
      }}
      style={{cursor: "pointer"}}
      key={item.guid}
      className={styles.child_row}>
      {tableData?.map((el, index) => (
        <td style={{textAlign: "center"}}>{index + 1}</td>
      ))}
      {columns?.map((col, index) => (
        <td
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
    </tr>
  );
}

export default RelationTableBody;
