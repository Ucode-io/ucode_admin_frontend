import React from "react";
import styles from "./style.module.scss";

function FiltersRow({
  navigateToDetailPage,
  calculateWidthFixedColumn,
  columns,
  tableSettings,
  pageName,
  view,
  item,
}) {
  return (
    <tr
      onClick={() => {
        navigateToDetailPage(item);
      }}
      key={item.guid}
      className={styles.child_row}
      style={{paddingLeft: "40px"}}>
      {columns.map((col, index) => (
        <td
          onClick={() => {
            navigateToDetailPage(item);
          }}
          style={{
            cursor: "pointer",
            position: `${
              tableSettings?.[pageName]?.find((item) => item?.id === col?.id)
                ?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                ? "sticky"
                : "relative"
            }`,
            left: view?.attributes?.fixedColumns?.[col?.id]
              ? `${calculateWidthFixedColumn(col.id, columns) + 0}px`
              : "0",
            backgroundColor: `${
              tableSettings?.[pageName]?.find((item) => item?.id === col?.id)
                ?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                ? "#F6F6F6"
                : "#fff"
            }`,
            zIndex: `${
              tableSettings?.[pageName]?.find((item) => item?.id === col?.id)
                ?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                ? "1"
                : "0"
            }`,
          }}
          key={index}>
          {index === 0 ? (
            <div className={styles.childTd}>
              <img src="/img/child_icon.svg" alt="" />
              <p>{item[col.slug]}</p>
            </div>
          ) : (
            item[col.slug]
          )}
        </td>
      ))}
    </tr>
  );
}

export default FiltersRow;
