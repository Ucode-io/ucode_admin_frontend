import { useTranslation } from "react-i18next"
import FRow from "../../../../../../components/FormElements/FRow"
import HFSwitch from "../../../../../../components/FormElements/HFSwitch"
import SelectOptionsCreator from "../../../../../../components/SelectOptionsCreator"
import styles from "./style.module.scss"

const PickListAttributes = ({ control, onClose, onSaveButtonClick }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>{t("settings")}</h2>
      </div>
      <div className="p-2">
        <HFSwitch control={control} name="attributes.has_icon" label="Icon" />

        <HFSwitch control={control} name="attributes.has_color" label="Color" />

        <HFSwitch
          control={control}
          name="attributes.is_multiselect"
          label="Multiselect"
        />

        <FRow label={t("pick.list.option")}>
          <SelectOptionsCreator control={control} name="attributes.options" />
        </FRow>
      </div>
    </>
  )
}

export default PickListAttributes
