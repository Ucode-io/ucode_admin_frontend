import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import Header from "../../../../../components/Header"
import integrationService from "../../../../../services/auth/integrationService"
import SessionCreateForm from "./Form"
import "./style.scss"
import SessionsTable from "./Table"

const SessionsPage = () => {
  const { integrationId } = useParams()
  const { t } = useTranslation()

  const [tableData, setTableData] = useState(null)
  const [loader, setLoader] = useState(true)

  const fetchTableData = () => {
    setLoader(true)
    integrationService
      .getSessionsList(integrationId)
      .then((res) => {
        setTableData(res.sessions)
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    fetchTableData()
  }, [])

  return (
    <div className="SessionsPage">
      <Header title={t("sessions")} backButtonLink={-1} />

      <div className="main-block p-2">
        <SessionCreateForm />

        <SessionsTable tableData={tableData} loader={loader} />
      </div>
    </div>
  )
}

export default SessionsPage
