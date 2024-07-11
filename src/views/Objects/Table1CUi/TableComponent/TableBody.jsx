import React from "react";
import styles from "./style.module.scss";

function TableBody({toggleGroup, openGroups}) {
  const mockFolders = [
    {
      id: "57c22903-2b32-4311-8125-c18d0d90152e",
      table_id: "15e2675b-6c3e-4f6c-ba16-d16633db5718",
      name: "ucode",
      comment: "ucode",
      code: "ucode",
    },
    {
      id: "c00dbd2d-5e76-4a65-a9be-e9371f0b1e1f",
      table_id: "15e2675b-6c3e-4f6c-ba16-d16633db5718",
      name: "udevs",
      comment: "udevs",
      code: "udevs",
    },
  ];

  const folderItems = [
    {
      deleted_at: null,
      first_name: "fg",
      guid: "46f77842-f59f-48c3-b7ad-e2af50a881a9",
      last_name: "fdg",
      middle_name: "dfg",
      username: "dfg",
      folder_id: "c00dbd2d-5e76-4a65-a9be-e9371f0b1e1f",
    },
    {
      deleted_at: null,
      first_name: "fdgh",
      guid: "1c7ef55b-cdab-45f1-a1c8-5db16de0b6e6",
      last_name: "fdg",
      middle_name: "fdg",
      username: "dfg",
      folder_id: "c00dbd2d-5e76-4a65-a9be-e9371f0b1e1f",
    },
  ];

  return (
    <tbody>
      {mockFolders.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <tr
            className={styles.group_row}
            onClick={() => toggleGroup(folder.id)}>
            <td>
              <div className={styles.td_row}>
                <button className={styles.toggle_btn}>
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
            </td>
            <td>{folder.code}</td>
            <td></td>
            <td></td>
          </tr>
          {openGroups[folder.id] &&
            folderItems
              .filter((item) => item.folder_id === folder.id)
              .map((item) => (
                <tr key={item.guid} className={styles.child_row}>
                  <td>
                    <div className={styles.childTd}>
                      <img src="/img/child_icon.svg" alt="" />
                      <p>{item.first_name}</p>
                    </div>
                  </td>
                  <td> {item.last_name}</td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
        </React.Fragment>
      ))}
    </tbody>
  );
}

export default TableBody;
