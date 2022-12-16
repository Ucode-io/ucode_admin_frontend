import { useTranslation } from "react-i18next"
import FRow from "../../../../../../components/FormElements/FRow"
import HFNumberField from "../../../../../../components/FormElements/HFNumberField"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import styles from "./style.module.scss"

const IncrementIDAttributes = ({ control }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>{t("settings")}</h2>
      </div>
      <div className="p-2">
        <FRow label={t("prefix")}>
          <HFTextField name="attributes.prefix" control={control} fullWidth />
        </FRow>

        <FRow label={t("digit.number")}>
          <HFNumberField
            name="attributes.digit_number"
            control={control}
            fullWidth
          />
        </FRow>
      </div>
    </>
  )
}

export default IncrementIDAttributes
