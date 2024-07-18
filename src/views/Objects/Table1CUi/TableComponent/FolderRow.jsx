import React from "react";
import styles from "./style.module.scss";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import {useSelector} from "react-redux";

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
                onDoubleClick={() => handleFolderDoubleClick(item, level)}
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

{
  /* {isOpen && hasChildren && renderRows(item.children, level + 1)}
            {isOpen &&
              item.items?.response?.map((subItem) => (
                <tr
                  onClick={() => {
                    navigateToDetailPage(subItem);
                  }}
                  key={subItem.guid}
                  className={styles.child_row}
                  style={{
                    paddingLeft: `${(level + 1) * 40}px`,
                    cursor: "pointer",
                  }}>
                  {columns.map((col, index) => (
                    <td
                      style={{
                        position: `${
                          tableSettings?.[pageName]?.find(
                            (item) => item?.id === col?.id
                          )?.isStiky ||
                          view?.attributes?.fixedColumns?.[col?.id]
                            ? "sticky"
                            : "relative"
                        }`,
                        left: view?.attributes?.fixedColumns?.[col?.id]
                          ? `${calculateWidthFixedColumn(col.id) + 0}px`
                          : "0",
                        backgroundColor: `${
                          tableSettings?.[pageName]?.find(
                            (item) => item?.id === col?.id
                          )?.isStiky ||
                          view?.attributes?.fixedColumns?.[col?.id]
                            ? "#F6F6F6"
                            : "#fff"
                        }`,
                        zIndex: `${
                          tableSettings?.[pageName]?.find(
                            (item) => item?.id === col?.id
                          )?.isStiky ||
                          view?.attributes?.fixedColumns?.[col?.id]
                            ? "1"
                            : "0"
                        }`,
                      }}
                      key={index}>
                      {index === 0 ? (
                        <div className={styles.childTd}>
                          <img src="/img/child_icon.svg" alt="" />
                          <p>{subItem[col.slug]}</p>
                        </div>
                      ) : (
                        subItem[col.slug]
                      )}
                    </td>
                  ))}
                </tr>
              ))} */
}
