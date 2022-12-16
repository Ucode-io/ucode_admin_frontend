import { Divider } from "@mui/material"
import { useMemo, useTransition } from "react"
import FRow from "../../../../../../components/FormElements/FRow"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import styles from "./style.module.scss"

const FrontendFormulaAttributes = ({ control, mainForm }) => {
  const { t } = useTransition()
  const fieldsList = useMemo(() => {
    return mainForm.getValues("fields") ?? []
  }, [])

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>
      <div className="p-2">
        <FRow label={t("formula")}>
          <HFTextField
            control={control}
            name="attributes.formula"
            fullWidth
            multiline
            rows={4}
            placeholder={`${t("formula")}...`}
          />
        </FRow>

        <Divider className="my-1" />

        <h2>{t("fields.list")}:</h2>

        {fieldsList.map((field) => (
          <div>
            {field.label} - <strong>{field.slug}</strong>{" "}
          </div>
        ))}
      </div>
    </>
  )
}

export default FrontendFormulaAttributes
