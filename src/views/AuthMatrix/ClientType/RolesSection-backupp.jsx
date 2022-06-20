import { useState } from "react"
import RowLinearLoader from "../../../components/RowLinearLoader"
import CreateRowButton from "../../../components/CreateRowButton"
import { useNavigate, useParams } from "react-router-dom"
import { CircularProgress, MenuItem } from "@mui/material"
import ButtonsPopover from "../../../components/ButtonsPopover"
import roleService from "../../../services/roleService"

const RolesBlock = () => {
  const { projectId, typeId } = useParams()
  const navigate = useNavigate()

  const [loader, setLoader] = useState(false)
  const [deleteLoader, setDeleteLoader] = useState(null)
  const [rolesList, setRolesList] = useState([
    {
      client_type_id: typeId,
      id: "asdasd312312",
      name: "Test role 1",
    },
    {
      client_type_id: typeId,
      id: "fsdfsdfgfew23",
      name: "Test test role",
    },
    {
      client_type_id: typeId,
      id: "gfsdsad123",
      name: "For test role",
    },
  ])

  const deleteRole = (e, id) => {
    setLoader(id)
    roleService
      .delete(id)
      .then((res) => {
        setRolesList((prev) => prev.filter((el) => el.id !== id))
      })
      .catch(() => setLoader(null))
  }

  return (
    <>
      <div className="card silver-right-border" style={{ flex: 1 }}>
        <div className="card-header silver-bottom-border">
          <div className="card-title">ROLES</div>
          <div className="card-extra">
            <CreateRowButton
              onClick={() =>
                navigate(
                  `/settings/auth-matrix/${projectId}/client-type/${typeId}/role/create`
                )
              }
            />
          </div>
          <RowLinearLoader visible={loader} />
        </div>

        {rolesList?.map((role, index) => (
          <MenuItem className={`row silver-bottom-border pointer`}>
            <div className="row-index">{index + 1}</div>
            <div className="row-label">{role?.name}</div>
            <div className="row-btns">
              {deleteLoader === role.id ? (
                <div style={{ padding: "12px" }}>
                  <CircularProgress disableShrink size={20} />
                </div>
              ) : (
                <ButtonsPopover
                  onDeleteClick={deleteRole}
                  onEditClick={() =>
                    navigate(
                      `/settings/auth-matrix/${projectId}/client-type/${typeId}/role/${role.id}`
                    )
                  }
                />
              )}
            </div>
          </MenuItem>
        ))}
      </div>
    </>
  )
}

export default RolesBlock
