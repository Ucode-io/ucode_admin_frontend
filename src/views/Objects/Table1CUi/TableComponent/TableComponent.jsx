import React, {useState} from "react";
import styles from "./style.module.scss";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import CPagination from "./NewCPagination";

const TableComponent = ({
  openFilter,
  fields,
  folders,
  count,
  limit,
  setLimit,
  offset,
  setOffset,
}) => {
  const [openGroups, setOpenGroups] = useState({});

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
            columns={fields}
            folders={folders}
            toggleGroup={toggleGroup}
            openGroups={openGroups}
          />
        </table>
      </div>
      <CPagination
        offset={offset}
        setOffset={setOffset}
        limit={limit}
        setLimit={setLimit}
        count={count}
      />
    </div>
  );
};

export default TableComponent;
