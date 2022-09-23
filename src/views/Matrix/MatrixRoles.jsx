import { Delete } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import RectangleIconButton from "../../components/Buttons/RectangleIconButton"
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable"
import FormCard from "../../components/FormCard"
import FRow from "../../components/FormElements/FRow"
import HFTextField from "../../components/FormElements/HFTextField"
import constructorObjectService from "../../services/constructorObjectService"
import roleServiceV2 from "../../services/roleServiceV2"

const MatrixRoles = ({ infoForm }) => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])
  const params = useParams()

  const getRoles = () => {
    roleServiceV2
      .getList({ "client-type-id": infoForm.getValues().clientTypeId })
      .then((res) => {
        console.log("roles", res)
        setRoles(res?.data?.response || [])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const deleteLogins = (table_slug, id) => {
    constructorObjectService
      .delete(table_slug, id)
      .then(() => getRoles())
      .catch((e) => console.log("err - ", e))
  }

  useEffect(() => {
    getRoles()
  }, [])

  return (
    <div>
      <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
        <FRow label="Название">
          <HFTextField name="userType" control={infoForm.control} fullWidth />
        </FRow>
      </FormCard>
      <div style={{ marginTop: "10px" }}>
        <CTable removableHeight={null} disablePagination>
          <CTableHead>
            <CTableRow>
              <CTableCell style={{ padding: "12px 20px" }}>Название</CTableCell>
            </CTableRow>
          </CTableHead>
          <CTableBody loader={false} columnsCount={1} dataLength={1}>
            {roles.map((role) => (
              <CTableRow
                key={role.guid}
                onClick={() =>
                  navigate(
                    `/settings/auth/matrix_v2/role/${role?.guid}/${params?.typeId}`
                  )
                }
              >
                <CTableCell
                  style={{
                    padding: "8px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {console.log("ROLE --- ", role)}
                  <span>{role.name}</span>
                  <RectangleIconButton
                    color="error"
                    onClick={() => deleteLogins("role", role.guid)}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </div>
  )
}

export default MatrixRoles
