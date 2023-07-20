import { Box } from '@mui/material';
import React from 'react';
import { CTable, CTableBody, CTableCell, CTableHead, CTableHeadCell, CTableRow } from '../../../components/CTable';
import FRow from '../../../components/FormElements/FRow';
import HFCheckbox from '../../../components/FormElements/HFCheckbox';
import styles from './styles.module.scss'

function TablePermission({control}) {
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
                    <FRow style={{marginBottom: '0px'}} label="View" />{" "}
                    <HFCheckbox
                      control={control}
                      name="table.record_permissions.view"
                    />
                  </div>
                  <div className={styles.tableCells}>
                    <FRow style={{marginBottom: '0px'}} label="Create" />{" "}
                    <HFCheckbox
                      control={control}
                      name="table.record_permissions.create"
                    />
                  </div>
                  <div className={styles.tableCells}>
                    <FRow style={{marginBottom: '0px'}} label="Edit" />{" "}
                    <HFCheckbox
                      control={control}
                      name="table.record_permissions.edit"
                    />
                  </div>
                  <div className={styles.tableCells}>
                    <FRow style={{marginBottom: '0px'}} label="Delete" />{" "}
                    <HFCheckbox
                      control={control}
                      name="table.record_permissions.delete"
                    />
                  </div>
                  <div className={styles.tableCells}>
                    <FRow style={{marginBottom: '0px'}} label="Owner" />{" "}
                    <HFCheckbox
                      control={control}
                      name="table.record_permissions.is_public"
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