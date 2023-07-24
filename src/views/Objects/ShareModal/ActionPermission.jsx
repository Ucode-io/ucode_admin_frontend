import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FRow from '../../../components/FormElements/FRow';
import { CTable, CTableBody, CTableCell, CTableRow } from '../../../components/CTable';
import HFCheckbox from '../../../components/FormElements/HFCheckbox';
import styles from './styles.module.scss'
import { useWatch } from 'react-hook-form';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";


function ActionPermission({control, getUserPermission, getTablePermission}) {
    const [isCollapsedCon, setIsCollapsedCon] = useState(false);
    const [isActionPermissionsMatched, setIsActionPermissionsMatched] = useState(false);
    const grantAccess =
    getTablePermission?.current_user_permission?.grant_access || false;
    const actionPermissions = useWatch({
      control,
      name: "table.action_permissions",
    });
    const handleCollapseConToggle = () => {
      setIsCollapsedCon(!isCollapsedCon);
    };
    
    useEffect(() => {
      if (grantAccess && actionPermissions && getUserPermission?.table?.action_permissions) {
        setIsActionPermissionsMatched(
          actionPermissions.every((item, index) => {
            const permissionsInGetTable = getUserPermission.table.action_permissions[index];
            return (
              item.view_permission === permissionsInGetTable.permission
            );
          })
        );
      }
    }, [actionPermissions, getTablePermission]);
    
    return (
        <div className={styles.collapse}>
        <Box
          sx={{ display: "flex", justifyContent: "center", width: "250px" }}
          onClick={handleCollapseConToggle}
        >
          <FRow
            style={{ marginBottom: "0px" }}
            label="- Действие ( Actions )"
          />{isCollapsedCon ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
        </Box>

        {isCollapsedCon && (
          <CTable removableHeight={null} disablePagination>
            <CTableBody loader={false} columnsCount={2} dataLength={1}>
              {actionPermissions?.map((item, index) => (
                <CTableRow>
                  <CTableCell width={250}>{item?.label}</CTableCell>
                  <CTableCell width={250}>
                    <Box sx={{ padding: "10px" }}>
                      <div className={styles.tableCells}>
                        <FRow style={{ marginBottom: "0px" }} label="Run" />{" "}
                        <HFCheckbox
                          control={control}
                          name={`table.action_permissions.${index}.permission`}
                          disabled={
                            isActionPermissionsMatched ||
                            getUserPermission?.current_user_permission
                          }
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