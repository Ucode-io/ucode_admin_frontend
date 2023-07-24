import { Box } from "@mui/material";
import React from "react";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadCell,
  CTableRow,
} from "../../../components/CTable";
import FRow from "../../../components/FormElements/FRow";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import styles from "./styles.module.scss";
import HFCheckboxRecord from "./HFCheckboxRecord";

function TablePermission({ control, getUserPermission, getTablePermission }) {
  const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
  const currentPermissions =
    getTablePermission?.current_user_permission.table?.record_permissions || {};

  const isCheckboxDisabled = (permissionName) => {
    if (getUserPermission?.current_user_permission) {
      return true;
    } else if (grantAccess && currentPermissions[permissionName] === "Yes") {
      return false;
    }
  };

  return (
    <Box sx={{ marginTop: "10px" }}>
      <CTable removableHeight={null} disablePagination>
        <CTableHead>
          <CTableRow>
            <CTableHeadCell width={250}>Название доступа</CTableHeadCell>
            <CTableHeadCell width={250}>Тип доступа</CTableHeadCell>
          </CTableRow>
        </CTableHead>
        <CTableBody loader={false} columnsCount={2} dataLength={1}>
          <CTableRow>
            <CTableCell>- Таблица</CTableCell>
            <CTableCell>
              <Box sx={{ padding: "10px" }}>
                <div className={styles.tableCells}>
                  <FRow style={{ marginBottom: "0px" }} label="View" />{" "}
                  <HFCheckboxRecord
                    control={control}
                    name="table.record_permissions.read"
                    disabled={isCheckboxDisabled("read")}
                  />
                </div>
                <div className={styles.tableCells}>
                  <FRow style={{ marginBottom: "0px" }} label="Create" />{" "}
                  <HFCheckboxRecord
                    control={control}
                    name="table.record_permissions.write"
                    disabled={isCheckboxDisabled("write")}
                  />
                </div>
                <div className={styles.tableCells}>
                  <FRow style={{ marginBottom: "0px" }} label="Edit" />{" "}
                  <HFCheckboxRecord
                    control={control}
                    name="table.record_permissions.update"
                    disabled={isCheckboxDisabled("update")}
                  />
                </div>
                <div className={styles.tableCells}>
                  <FRow style={{ marginBottom: "0px" }} label="Delete" />{" "}
                  <HFCheckboxRecord
                    control={control}
                    name="table.record_permissions.delete"
                    disabled={isCheckboxDisabled("delete")}
                  />
                </div>
                <div className={styles.tableCells}>
                  <FRow style={{ marginBottom: "0px" }} label="Owner" />{" "}
                  <HFCheckbox
                    control={control}
                    name="table.record_permissions.is_public"
                    disabled={isCheckboxDisabled("is_public")}
                  />
                </div>
              </Box>
            </CTableCell>
          </CTableRow>
        </CTableBody>
      </CTable>
    </Box>
  );
}

export default TablePermission;
