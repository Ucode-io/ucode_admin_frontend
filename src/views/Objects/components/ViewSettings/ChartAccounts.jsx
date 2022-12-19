import { Checkbox } from "@mui/material"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import style from './style.module.scss'
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableRow,
} from "../../../../components/CTable"
import FRow from "../../../../components/FormElements/FRow"

const ChartAccounts = () => {
  
  return (
    <div className={style.chartAccounts}>
        <div className={style.sectionHeader}>
            <div className={style.sectionTitle}>Treeview</div>
        </div>

        <CTable
        removableHeight={false}
        disablePagination
        tableStyle={{ border: "none" }}
      >
        <CTableBody dataLength={1}>
          
            <CTableRow>
              <CTableCell>

              </CTableCell>

              <CTableCell style={{ width: 160 }}>
                Тип
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
              Таблица
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
              Цифровое поля 
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
                Дата поля
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
              Филтр
              </CTableCell>
            </CTableRow>

            <CTableRow>
              <CTableCell>
                
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
                Тип
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
              Таблица
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
              Цифровое поля 
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
                Дата поля
              </CTableCell>

              <CTableCell style={{ width: 160 }}>
              Филтр
              </CTableCell>
            </CTableRow>

        </CTableBody>
      </CTable>
    </div>
  )
}

export default ChartAccounts
