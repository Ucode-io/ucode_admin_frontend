import React, {useEffect, useState} from "react";
import styles from "./style.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function TableBody({toggleGroup, openGroups, folders, columns}) {
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [openGroupId, setOpenGroupId] = useState(null); // new state to manage currently open group

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

  useEffect(() => {
    if (!currentFolder?.id) {
      localStorage.removeItem("folder_id");
    }
  }, [currentFolder]);

  const buildFolderHierarchy = (folders) => {
    const folderMap = {};
    const rootFolders = [];

    folders?.forEach((folder) => {
      folderMap[folder.id] = {...folder, children: []};
    });

    folders?.forEach((folder) => {
      if (folder?.parent_id) {
        if (folderMap[folder?.parent_id]) {
          folderMap[folder?.parent_id].children.push(folderMap[folder?.id]);
        }
      } else {
        rootFolders.push(folderMap[folder?.id]);
      }
    });

    return rootFolders;
  };

  const handleToggleGroup = (groupId) => {
    if (openGroupId === groupId) {
      setOpenGroupId(null); // close the group if it's already open
    } else {
      setOpenGroupId(groupId); // open the new group and close the others
    }
  };

  const renderRows = (items, level = 0) => {
    return items?.map((item) => {
      if (item.type === "FOLDER") {
        const hasChildren =
          item?.children?.length > 0 || item?.items?.response?.length > 0;
        const isOpen = openGroupId === item.id; // check if this folder is open
        return (
          <React.Fragment key={item.id}>
            <tr
              className={styles.group_row}
              onDoubleClick={() => handleFolderDoubleClick(item)}
              style={{paddingLeft: `${(level + 1) * 20}px`}}>
              {columns.map((col, index) => (
                <td key={index}>
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
                  key={subItem.id}
                  className={styles.child_row}
                  style={{paddingLeft: `${(level + 1) * 40}px`}}>
                  {columns.map((col, index) => (
                    <td key={index}>
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
            key={item.id}
            className={styles.child_row}
            style={{paddingLeft: `${(level + 1) * 40}px`}}>
            {columns.map((col, index) => (
              <td key={index}>
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

  const folderHierarchy = buildFolderHierarchy(folders);

  if (currentFolder) {
    const {children, items} = currentFolder;
    const hasItems = items && items.response && items.response.length > 0;
    const hasChildren = children && children.length > 0;

    return (
      <tbody>
        <tr onClick={handleBackClick} className={styles.back_row}>
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
              key={item.guid}
              className={styles.child_row}
              style={{paddingLeft: "40px"}}>
              {columns.map((col, index) => (
                <td key={index}>
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
            <td colSpan={columns.length} className={styles.empty_state}>
              No items found in this folder.
            </td>
          </tr>
        )}
      </tbody>
    );
  }

  return <tbody>{renderRows(folderHierarchy)}</tbody>;
}

export default TableBody;
