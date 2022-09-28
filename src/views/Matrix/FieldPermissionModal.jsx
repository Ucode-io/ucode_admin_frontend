import { Clear } from "@mui/icons-material"
import { Modal } from "@mui/material"
import { useQuery } from "react-query"
import { useState } from "react"

import constructorFieldService from "../../services/constructorFieldService"
import PermissionYesOrNoPopup from "./PermissionYesOrNoPopup"
import DataTable from "../../components/DataTable"
import { TwoUserIcon } from "../../assets/icons/icon"
import styles from "./styles.module.scss"

const FieldPermissionModal = ({ isOpen, handleClose, table_slug }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [popupId, setPopupId] = useState("")
  //   const [final]

  const handleOpenPopup = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopup = () => {
    setAnchorEl(null)
  }

  const columns = [
    {
      id: 1,
      label: "Field name",
      slug: "label",
      type: "SINGLE_LINE",
    },
    {
      id: 2,
      label: "View permission",
      slug: "is_visible",
      type: "SINGLE_LINE",
      render: (val, row) => (
        <div
          onClick={(e) => {
            anchorEl ? handleClosePopup() : handleOpenPopup(e)
            setPopupId(row.id)
          }}
        >
          <div style={{ textAlign: "center" }}>
            <TwoUserIcon />
          </div>
          {popupId === row.id && (
            <PermissionYesOrNoPopup
              anchorEl={anchorEl}
              handleClose={handleClosePopup}
            />
          )}
        </div>
      ),
    },
    {
      id: 3,
      label: "Edit permission",
      slug: "slug",
      type: "SINGLE_LINE",
      render: (val) => (
        <div style={{ textAlign: "center" }}>
          <TwoUserIcon />
        </div>
      ),
    },
  ]

  const { data: fields, isLoading } = useQuery(
    ["GET_FIELDS_BY_TABLE_SLUG", table_slug],
    () => constructorFieldService.getList({ table_slug }),
    { enabled: !!table_slug }
  )

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.fieldPermissionBox}>
          <div className={styles.head}>
            <p>View settings</p>
            <Clear />
          </div>
          <div className={styles.body}>
            <DataTable
              removableHeight={"auto"}
              columns={columns}
              data={fields?.fields ?? []}
              loader={isLoading}
              disablePagination
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FieldPermissionModal
