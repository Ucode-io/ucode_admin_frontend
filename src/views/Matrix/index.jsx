import { useTranslation } from "react-i18next"
import HeaderSettings from "../../components/HeaderSettings"
import MatrixTable from "./Table"

const Matrix = () => {
  const { t } = useTranslation()
  return (
    <div>
      <HeaderSettings title={t("matrix")} />
      <MatrixTable />
    </div>
  )
}

export default Matrix
