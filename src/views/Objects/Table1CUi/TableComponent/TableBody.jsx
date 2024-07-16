import React, {useEffect, useState} from "react";
import styles from "./style.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useFilters from "../../../../hooks/useFilters";
import {useLocation, useParams} from "react-router-dom";
import hasValidFilters from "../../../../utils/hasValidFilters";
import {mergeStringAndState} from "../../../../utils/jsonPath";
import useTabRouter from "../../../../hooks/useTabRouter";
import {useSelector} from "react-redux";
import {CircularProgress} from "@mui/material";

function TableBody({folders, columns, view, menuItem, searchText}) {
  const {tableSlug, appId} = useParams();
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [openGroupId, setOpenGroupId] = useState(null);
  const [folderHierarchy, setFolderHierarchy] = useState([]);
  const {filters} = useFilters(tableSlug, view.id);
  const tableSettings = useSelector((state) => state.tableSize.tableSettings);
  const location = useLocation();
  const {navigateToForm} = useTabRouter();
  const tableSize = useSelector((state) => state.tableSize.tableSize);
  const pageName =
    location?.pathname.split("/")[location.pathname.split("/").length - 1];

  const handleFolderDoubleClick = (folder) => {
    setCurrentFolder(folder);
    setBreadcrumbs([...breadcrumbs, folder]);
    if (folder?.id) {
      localStorage.setItem("folder_id", folder?.id);
    }
  };

  const handleBackClick = () => {
    const updatedBreadcrumbs = breadcrumbs.slice(0, -1);
    setBreadcrumbs(updatedBreadcrumbs);
    setCurrentFolder(updatedBreadcrumbs[updatedBreadcrumbs.length - 1] || null);
    if (!updatedBreadcrumbs.length) {
      localStorage.removeItem("folder_id");
    }
  };

  const handleToggleGroup = (groupId) => {
    if (openGroupId === groupId) {
      setOpenGroupId(null);
    } else {
      setOpenGroupId(groupId);
    }
  };

  const navigateToDetailPage = (row) => {
    if (
      view?.attributes?.navigate?.params?.length ||
      view?.attributes?.navigate?.url
    ) {
      const params = view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;
      let query = urlTemplate;

      const variablePattern = /\{\{\$\.(.*?)\}\}/g;

      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
  };

  useEffect(() => {
    const folderMap = {};
    const rootFolders = [];
    const rootItems = [];

    folders?.forEach((folder) => {
      folderMap[folder.id] = {...folder, children: [], items: {response: []}};
    });

    folders
      ?.filter((item) => item?.id)
      ?.forEach((folder) => {
        if (folder.parent_id) {
          if (folderMap[folder.parent_id]) {
            folderMap[folder.parent_id].children.push(folderMap[folder.id]);
          }
        } else {
          rootFolders.push(folderMap[folder.id]);
        }
      });

    folders?.forEach((folder) => {
      if (folder.items?.response) {
        folder.items.response.forEach((item) => {
          if (item.folder_id && folderMap[item.folder_id]) {
            folderMap[item.folder_id].items.response.push(item);
          } else {
            rootItems.push(item);
          }
        });
      }
    });

    setFolderHierarchy([...rootFolders, ...rootItems]);
  }, [folders]);

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

  useEffect(() => {
    if (!currentFolder?.id) {
      localStorage.removeItem("folder_id");
    }
  }, [currentFolder]);

  const renderRows = (items, level = 0) => {
    return items?.map((item) => {
      if (item.type === "FOLDER") {
        const hasChildren =
          item?.children?.length > 0 || item?.items?.response?.length > 0;
        const isOpen = openGroupId === item.id;
        return (
          <React.Fragment key={item.id}>
            <tr
              className={styles.group_row}
              style={{paddingLeft: `${(level + 1) * 20}px`}}>
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
                      {level === 0 && (
                        <button
                          onClick={() => handleToggleGroup(item.id)}
                          className={styles.toggle_btn}>
                          {isOpen ? (
                            <img src="/img/dropdown_icon.svg" alt="" />
                          ) : (
                            <img src="/img/right_icon.svg" alt="" />
                          )}
                        </button>
                      )}
                      <span
                        onDoubleClick={() => handleFolderDoubleClick(item)}
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
            {isOpen && hasChildren && renderRows(item.children, level + 1)}
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
              ))}
          </React.Fragment>
        );
      } else {
        return (
          <tr
            onClick={() => {
              navigateToDetailPage(item);
            }}
            key={item.guid}
            className={styles.child_row}
            style={{paddingLeft: `${(level + 1) * 40}px`, cursor: "pointer"}}>
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
        );
      }
    });
  };

  if (hasValidFilters(filters) || Boolean(searchText)) {
    return (
      <tbody>
        {folders?.map((item) => (
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
      </tbody>
    );
  }

  if (currentFolder) {
    const {children, items} = currentFolder;
    const hasItems = items && items.response && items.response.length > 0;
    const hasChildren = children && children.length > 0;

    return (
      <tbody>
        <tr
          onClick={() => {
            handleBackClick();
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
        {hasChildren && renderRows(children, 1)}
        {hasItems ? (
          items.response.map((item) => (
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
          ))
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
      </tbody>
    );
  }

  return (
    <tbody>
      {folders?.length ? (
        renderRows(folderHierarchy)
      ) : (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <CircularProgress sx={{color: "#449424"}} size={50} />
        </div>
      )}
    </tbody>
  );
}

export default TableBody;
