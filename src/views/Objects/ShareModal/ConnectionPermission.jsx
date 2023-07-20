import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Box } from "@mui/material";
import FRow from "../../../components/FormElements/FRow";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../components/CTable";
import HFCheckbox from "../../../components/FormElements/HFCheckbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWatch } from "react-hook-form";

function ConnectionPermission({ control }) {
  const [isCollapsedCon, setIsCollapsedCon] = useState(false);

  const view_permissions = useWatch({
    control,
    name: "table.view_permissions",
  });
  const handleCollapseConToggle = () => {
    setIsCollapsedCon(!isCollapsedCon);
  };

  return (
    <div className={styles.collapse}>
      <Box
        sx={{ display: "flex", justifyContent: "center", width: "200px" }}
        onClick={handleCollapseConToggle}
      >
        <FRow style={{ marginBottom: "0px" }} label="- Связи" />{" "}
        <ExpandMoreIcon />
      </Box>

      {isCollapsedCon && (
        <CTable removableHeight={null} disablePagination>
          <CTableBody loader={false} columnsCount={2} dataLength={1}>
            {view_permissions?.map((item, index) => (
              <CTableRow>
                <CTableCell width={250}>{item?.label}</CTableCell>
                <CTableCell width={250}>
                  <Box sx={{ padding: "10px" }}>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Viewer" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.view`}
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Creator" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.create`}
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Editor" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.edit`}
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="Admin" />{" "}
                      <HFCheckbox
                        control={control}
                        name={`table.view_permissions.${index}.is_public`}
                      />
                    </div>
                    <div className={styles.tableCells}>
                      <FRow style={{ marginBottom: "0px" }} label="is_public" />{" "}
                      <HFCheckbox control={control} name="is_public" />
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

export default ConnectionPermission;
