import React, {useState} from "react";
import styles from "./style.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function TableBody({toggleGroup, openGroups, folders, columns}) {
  const [currentFolder, setCurrentFolder] = useState(null);

  const handleFolderDoubleClick = (folder) => {
    setCurrentFolder(folder);
    localStorage.setItem("folder_id", folder?.id);
  };

  const handleBackClick = () => {
    setCurrentFolder(null);
    localStorage.removeItem("folder_id");
  };

  const renderRows = (folders) => {
    return folders?.map((folder) => (
      <React.Fragment key={folder.id}>
        <tr
          className={styles.group_row}
          onDoubleClick={() => handleFolderDoubleClick(folder)}>
          {columns.map((col, index) => (
            <td key={index}>
              {index === 0 ? (
                <div className={styles.td_row}>
                  <button
                    onClick={() => toggleGroup(folder.id)}
                    className={styles.toggle_btn}>
                    {openGroups[folder.id] ? (
                      <img src="/img/dropdown_icon.svg" alt="" />
                    ) : (
                      <img src="/img/right_icon.svg" alt="" />
                    )}
                  </button>
                  <span className={styles.folder_icon}>
                    <img src="/img/folder_icon.svg" alt="" />
                  </span>
                  <p>{folder.name}</p>
                </div>
              ) : (
                folder[col.slug]
              )}
            </td>
          ))}
        </tr>
        {openGroups[folder.id] &&
          folder?.items?.response
            ?.filter((item) => item.folder_id === folder.id)
            .map((item) => (
              <tr key={item.guid} className={styles.child_row}>
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
            ))}
      </React.Fragment>
    ));
  };
  if (currentFolder) {
    const {items} = currentFolder;
    const hasItems = items && items.response && items.response.length > 0;

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
        {hasItems ? (
          items.response.map((item) => (
            <tr key={item.guid} className={styles.child_row}>
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

  return <tbody>{renderRows(folders)}</tbody>;
}

export default TableBody;
