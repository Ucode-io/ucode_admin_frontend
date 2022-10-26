import { useTranslation } from "react-i18next"
import FRow from "../../../../../components/FormElements/FRow"
import HFSelect from "../../../../../components/FormElements/HFSelect"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import { dashboardPanelTypes } from "../../../../../utils/constants/dashboardPanelTypes"
import PanelAttributes from "./PanelAttributes"
import styles from "./style.module.scss"

const PanelSettings = ({ form, columns }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.panelSettings}>
      <div className={styles.form}>
        <div className={styles.settingsSectionHeader}>{t("main.info")}</div>

        <div className="p-2">
          <FRow label={t("title")}>
            <HFTextField control={form.control} name="title" fullWidth />
          </FRow>

          <FRow label={t("type")}>
            <HFSelect
              control={form.control}
              name="attributes.type"
              options={dashboardPanelTypes}
              optionType="GROUP"
            />
          </FRow>
        </div>

        <PanelAttributes form={form} columns={columns} />
      </div>
    </div>
  )
}

export default PanelSettings
