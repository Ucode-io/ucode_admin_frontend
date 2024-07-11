import React, {useState} from "react";
import styles from "./style.module.scss";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import CPagination from "./NewCPagination";
import {useParams} from "react-router-dom";

const TableComponent = ({openFilter, fields, folders}) => {
  const [openGroups, setOpenGroups] = useState({});
  const [limit, setLimit] = useState(0);

  const toggleGroup = (groupId) => {
    setOpenGroups((prevOpenGroups) => ({
      ...prevOpenGroups,
      [groupId]: !prevOpenGroups[groupId],
    }));
  };

  return (
    <div className={styles.tableComponent}>
      <div
        className={
          openFilter ? styles.tableWrapperActive : styles.tableWrapper
        }>
        <table className={styles.expandable_table}>
          <TableHead columns={fields} />
          <TableBody
            folders={folders}
            toggleGroup={toggleGroup}
            openGroups={openGroups}
          />
        </table>
      </div>
      <CPagination limit={limit} setLimit={setLimit} />
    </div>
  );
};

export default TableComponent;
