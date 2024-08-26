import React from "react";
import calculateWidthFixedColumn from "../../../../utils/calculateWidthFixedColumn";
import styles from "./style.module.scss";
import {useNavigate, useParams} from "react-router-dom";
import ArticleIcon from "@mui/icons-material/Article";

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
      <td
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "5px",
          backgroundColor: "#fff",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
        }}>
        <button
          style={{
            width: "34px",
            minHeight: "34px",
            border: "1px solid #D0D5DD",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(
              `/main/${appId}/object/${tableSlug}/templates?id=${item?.guid}`
            );
            console.log("Button clicked");
          }}>
          <ArticleIcon style={{color: "#429424"}} />
        </button>
      </td>
    </tr>
  );
}

export default ItemsRow;
