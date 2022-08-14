import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
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
import roleServiceV2 from "../../services/roleServiceV2"

const MatrixRoles = ({ infoForm }) => {
  const navigate = useNavigate()
  const [roles, setRoles] = useState([])

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

  useEffect(() => {
    getRoles()
  }, [])

  return (
    <div>
      <FormCard title="Инфо" icon="address-card.svg" maxWidth="100%">
        <FRow label="Название">
          <HFTextField
            label="Название"
            name="userType"
            control={infoForm.control}
            fullWidth
          />
        </FRow>
      </FormCard>
      <div style={{ marginTop: "10px" }}>
        <CTable removableHeight={null} disablePagination>
          <CTableHead>
            <CTableRow>
              <CTableCell>Название</CTableCell>
            </CTableRow>
          </CTableHead>
          <CTableBody loader={false} columnsCount={1} dataLength={1}>
            {roles.map((role) => (
              <CTableRow key={role.guid} onClick={() => navigate(`/settings/auth/matrix_v2/role/${role?.guid}`)}>
                <CTableCell>{role.name}</CTableCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </div>
  )
}

export default MatrixRoles
