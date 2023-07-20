import { Box } from '@mui/material';
import React, { useState } from 'react';
import FRow from '../../../components/FormElements/FRow';
import { CTable, CTableBody, CTableCell, CTableRow } from '../../../components/CTable';
import HFCheckbox from '../../../components/FormElements/HFCheckbox';
import styles from './styles.module.scss'
import { useWatch } from 'react-hook-form';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


function ActionPermission({control}) {
    const [isCollapsedCon, setIsCollapsedCon] = useState(false);

    const action_permissions = useWatch({
      control,
      name: "table.action_permissions",
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
          <FRow
            style={{ marginBottom: "0px" }}
            label="- Действие ( Actions )"
          />{" "}
          <ExpandMoreIcon />
        </Box>

        {isCollapsedCon && (
          <CTable removableHeight={null} disablePagination>
            <CTableBody loader={false} columnsCount={2} dataLength={1}>
              {action_permissions?.map((item, index) => (
                <CTableRow>
                  <CTableCell width={250}>{item?.label}</CTableCell>
                  <CTableCell width={250}>
                    <Box sx={{ padding: "10px" }}>
                      <div className={styles.tableCells}>
                        <FRow style={{ marginBottom: "0px" }} label="Run" />{" "}
                        <HFCheckbox
                          control={control}
                          name={`table.action_permissions.${index}.run`}
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

export default ActionPermission;