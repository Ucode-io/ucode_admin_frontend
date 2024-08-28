import React from "react";
import styles from "./style.module.scss";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import {useSelector} from "react-redux";
import {es} from "date-fns/locale";

function FolderRow({
  pageName,
  tableSettings,
  view,
  level,
  columns,
  item,
  handleFolderDoubleClick,
}) {
  return (
    <tr
      onClick={() => handleFolderDoubleClick(item, level)}
      className={styles.group_row}
      style={{paddingLeft: `${(level + 1) * 20}px`}}>
      {columns.map((col, index) => (
        <td
          style={{
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
            <div className={styles.td_row}>
              <span
                style={{marginLeft: `${level * 30}px`}}
                className={styles.folder_icon}>
                <img src="/img/folder_icon.svg" alt="" />
              </span>
              <p>{item.name}</p>
            </div>
          ) : (
            item[col.slug]
          )}
        </td>
      ))}
    </tr>
  );
}

export default FolderRow;
