import { Box } from "@mui/material";
import React, { useState } from "react";
import FRow from "../../../components/FormElements/FRow";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../components/CTable";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import styles from "./styles.module.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";

function FieldPermission({ control }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const field_permissions = useWatch({
    control,
    name: "table.field_permissions",
  });

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className={styles.collapse}>
      <Box
        sx={{ display: "flex", justifyContent: "center", width: "200px" }}
        onClick={handleCollapseToggle}
      >
        <FRow style={{ marginBottom: "0px" }} label="-  Поля" />{" "}
        <ExpandMoreIcon />
      </Box>

      {isCollapsed && (
        <CTable removableHeight={null} disablePagination>
          <CTableBody loader={false} columnsCount={2} dataLength={1}>
            {field_permissions?.map((item, index) => (
              <CTableRow>
                <CTableCell width={250}>{item?.label}</CTableCell>
                <CTableCell width={250}>
                  <Box sx={{ padding: "10px" }}>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Viewer" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.${index}.field_permissions.view_permission`}
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Editor" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.${index}.field_permissions.edit_permission`}
                      />
                    </div>
                  </Box>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </div>
  );
}

export default FieldPermission;
