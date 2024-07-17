import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, {useEffect} from "react";
import styles from "./style.module.scss";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import newTableService from "../../../../services/newTableService";

const ChildRows = ({
  columns,
  view,
  tableSettings,
  pageName,
  navigateToDetailPage,
  currentFolder,
  hasItems,
  items,
  handleBackClick,
  handleFolderDoubleClick,
  setFoldersState,
  parentId,
  menuItem,
  folderIds,
  setFolderIds,
}) => {
  const {tableSlug} = useParams();

  const {data: {foldersList, count} = {data: []}, isLoading2} = useQuery(
    ["GET_FOLDER_LIST", {tableSlug, folderIds}],
    () => {
      return newTableService.getFolderList({
        table_id: menuItem?.table_id,
        parent_id: folderIds?.[folderIds?.length - 1],
      });
    },
    {
      enabled: Boolean(parentId),
      cacheTime: 10,
      select: (res) => {
        const foldersList = res?.folder_groups ?? [];
        const count = res?.count;
        return {
          foldersList,
          count,
        };
      },
    }
  );

  useEffect(() => {
    if (foldersList?.length) {
      setFoldersState((prevFolders) => {
        const existingIds = new Set(prevFolders.map((folder) => folder.id));
        const uniqueNewFolders = foldersList.filter(
          (folder) => !existingIds.has(folder.id)
        );
        return [...prevFolders, ...uniqueNewFolders];
      });
    }
  }, [foldersList]);

  const calculateWidthFixedColumn = (colId) => {
    const prevElementIndex = columns?.findIndex((item) => item.id === colId);
    if (prevElementIndex === -1 || prevElementIndex === 0) {
      return 0;
    }
    let totalWidth = 0;

    for (let i = 0; i < prevElementIndex; i++) {
      const element = document.querySelector(`[id='${columns?.[i].id}']`);
      totalWidth += element?.offsetWidth || 0;
    }
    return totalWidth;
  };

  return (
    <>
      <tr
        onClick={() => {
          handleBackClick();
          setFolderIds((prevIds) => prevIds.slice(0, -1));
        }}
        className={styles.back_row}>
        <td colSpan={columns.length}>
          <button className={styles.back_btn}>
            <span>
              <ArrowBackIcon />
            </span>
            <div className={styles.current_folder_name}>
              <span className={styles.folder_icon}>
                <img src="/img/folder_icon.svg" alt="" />
              </span>
              {currentFolder.name}
            </div>
          </button>
        </td>
      </tr>
      {hasItems ? (
        <>
          {foldersList?.map((item) => (
            <tr className={styles.group_row} style={{paddingLeft: `20px`}}>
              {columns.map((col, index) => (
                <td
                  style={{
                    position: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === col?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    left: view?.attributes?.fixedColumns?.[col?.id]
                      ? `${calculateWidthFixedColumn(col.id) + 0}px`
                      : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === col?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === col?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                        ? "1"
                        : "0"
                    }`,
                  }}
                  key={index}>
                  {index === 0 ? (
                    <div className={styles.td_row}>
                      {/* {level === 0 && (
                      <button
                        onClick={() => handleToggleGroup(item.id)}
                        className={styles.toggle_btn}>
                        {isOpen ? (
                          <img src="/img/dropdown_icon.svg" alt="" />
                        ) : (
                          <img src="/img/right_icon.svg" alt="" />
                        )}
                      </button>
                    )} */}
                      <span
                        onDoubleClick={() => handleFolderDoubleClick(item)}
                        style={{marginLeft: `30px`}}
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
          ))}
          {items.response.map((item) => (
            <tr
              onClick={() => {
                navigateToDetailPage(item);
              }}
              key={item.guid}
              className={styles.child_row}
              style={{paddingLeft: "40px"}}>
              {columns.map((col, index) => (
                <td
                  style={{
                    position: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === col?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                        ? "sticky"
                        : "relative"
                    }`,
                    left: view?.attributes?.fixedColumns?.[col?.id]
                      ? `${calculateWidthFixedColumn(col.id) + 0}px`
                      : "0",
                    backgroundColor: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === col?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
                        ? "#F6F6F6"
                        : "#fff"
                    }`,
                    zIndex: `${
                      tableSettings?.[pageName]?.find(
                        (item) => item?.id === col?.id
                      )?.isStiky || view?.attributes?.fixedColumns?.[col?.id]
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
          ))}
        </>
      ) : (
        <tr>
          <td
            style={{paddingLeft: "60px"}}
            colSpan={columns.length}
            className={styles.empty_state}>
            No items found in this folder.
          </td>
        </tr>
      )}
    </>
  );
};

export default ChildRows;
