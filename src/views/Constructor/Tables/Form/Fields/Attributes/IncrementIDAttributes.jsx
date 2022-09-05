import FRow from "../../../../../../components/FormElements/FRow"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import styles from "./style.module.scss"

const IncrementIDAttributes = ({ control }) => {
  return (
    <>
      <div className={styles.settingsBlockHeader}>
        <h2>Settings</h2>
      </div>

      <div className="p-2">
        <FRow label="Prefix">
          <HFTextField
            name="attributes.prefix"
            control={control}
            fullWidth
          />
        </FRow>

        <FRow label="Digit number">
          <HFTextField
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
