import React from "react";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import styles from "./style.module.scss";
import {useNavigate, useParams} from "react-router-dom";

function ItemsRow({
  view,
  pageName,
  tableSettings,
  columns,
  level,
  item,
  menuItem,
}) {
  const {tableSlug, appId} = useParams();
  const navigate = useNavigate();

  return (
    <tr
      onClick={() => {
        navigate(
          `/main/${appId}/1c/${tableSlug}/${item?.guid}?menuId=${menuItem?.id}`,
          {
            state: {
              label: item?.label || item?.title,
            },
          }
        );
      }}
      key={item.guid}
      className={styles.child_row}
      style={{paddingLeft: `${(level + 1) * 40}px`, cursor: "pointer"}}>
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

export default ItemsRow;
