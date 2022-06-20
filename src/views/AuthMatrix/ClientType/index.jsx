import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../../components/Header"
import clientTypeService from "../../../services/auth/clientTypeService"
import InfoFieldsSection from "./InfoFieldsSection"
import RelationsSection from "./RelationsSection"
import "./style.scss"

const ClientType = () => {
  const { typeId, projectId } = useParams()

  const [loader, setLoader] = useState(true)
  const [rolesList, setRolesList] = useState([])
  const [fieldsList, setFieldsList] = useState([])
  const [relationsList, setRelationsList] = useState([])

  const getData = () => {
    setLoader(true)

    clientTypeService.getById(typeId)
      .then(res => {
        setRolesList(res.roles ?? [])
        setFieldsList(res.user_info_fields ?? [])
        setRelationsList(res.relations ?? [])
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <div className="ClientType">
      <Header title="Client-type" backButtonLink={`/settings/auth-matrix/${projectId}`} />
      <div className="main-area">
        {/* <RolesBlock rolesList={rolesList} setRolesList={setRolesList} /> */}
        <InfoFieldsSection fieldsList={fieldsList} setFieldsList={setFieldsList} />
        <RelationsSection relationsList={relationsList} setRelationsList={setRelationsList} />
      </div>
    </div>
  )
}

export default ClientType
