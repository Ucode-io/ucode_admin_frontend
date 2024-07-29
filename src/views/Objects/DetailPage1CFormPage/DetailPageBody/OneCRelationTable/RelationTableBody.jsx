import React from "react";
import styles from "./style.module.scss";

function RelationTableBody({columns, item, view}) {
  return (
    <tr
      onClick={() => {
        // navigateToDetailPage(item);
      }}
      //   key={item.guid}
      className={styles.child_row}
      //   style={{paddingLeft: `${(level + 1) * 40}px`, cursor: "pointer"}}
    >
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
          {item?.[col?.slug]}
        </td>
      ))}
    </tr>
  );
}

export default RelationTableBody;
