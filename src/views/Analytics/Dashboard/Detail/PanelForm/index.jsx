import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import SaveButton from "../../../../../components/Buttons/SaveButton"
import Footer from "../../../../../components/Footer"
import Header from "../../../../../components/Header"
import PageFallback from "../../../../../components/PageFallback"
import panelService from "../../../../../services/analytics/panelService"
import variableService from "../../../../../services/analytics/variableService"
import VariablesBar from "../../../components/VariablesBar"
import PanelPreview from "./PanelPreview"
import QueryRedactor from "./QueryRedactor"
import SettingsPanel from "./SettingsPanel"
import styles from "./style.module.scss"

const PanelCreateForm = () => {
  const { id, panelId } = useParams()
  const navigate = useNavigate()
  const [variablesValue, setVariablesValue] = useState({})

  const form = useForm()

  const { isLoading } = useQuery(
    ["GET_PANEL_DATA", panelId],
    () => {
      if (!panelId)
        return {
          dashboard_id: id,
          attributes: {},
          coordinates: [0, 0, 5, 5],
          query: "",
          title: "",
        }
      return panelService.getById(panelId)
    },
    {
      onSuccess: (data) => {
        form.reset({
          ...data,
          attributes: {},
        })
      },
    }
  )

  const { data } = useQuery(["GET_VARIABLES_IN_DASHBOARD", id], () => {
    return variableService.getList({ dashboard_id: id })
  })

  const { mutate, isLoading: btnLoading } = useMutation(
    (data) => {
      if (panelId) return panelService.update(data)
      else return panelService.create(data)
    },
    {
      onSuccess: () => {
        navigate(`/analytics/dashboard/${id}`)
      },
    }
  )

  return (
    <div>
      <Header
        title="Дешборд / Панель"
        backButtonLink={`/analytics/dashboard/${id}`}
      />

      {isLoading ? (
        <PageFallback />
      ) : (
        <div className={styles.mainArea}>
          <div className={styles.mainSide}>
            <VariablesBar
              variables={data.variables}
              variablesValue={variablesValue}
              setVariablesValue={setVariablesValue}
            />
            <PanelPreview form={form} variablesValue={variablesValue} />

            <QueryRedactor form={form} />
          </div>

          <SettingsPanel form={form} />
        </div>
      )}

      <Footer
        extra={
          <SaveButton
            loading={btnLoading}
            onClick={form.handleSubmit(mutate)}
          />
        }
      />
    </div>
  )
}

export default PanelCreateForm
