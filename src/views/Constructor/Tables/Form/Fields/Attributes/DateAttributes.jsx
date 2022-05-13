import { useWatch } from "react-hook-form"
import FRow from "../../../../../../components/FormElements/FRow"
import HFCheckbox from "../../../../../../components/FormElements/HFCheckbox"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import ModalCard from "../../../../../../components/ModalCard"

const DateAttributes = ({ control, onClose, onSaveButtonClick }) => {
  
  const showTooltip = useWatch({
    control,
    name: "attributes.showTooltip",
  })

  return (
    <ModalCard title="Date properties" onClose={onClose} onSaveButtonClick={onSaveButtonClick}  >
      <FRow label="Field label" required>
        <HFTextField autoFocus fullWidth name="label" control={control} />
      </FRow>
      <FRow label="Placeholder">
        <HFTextField autoFocus fullWidth name="attributes.placeholder" control={control} />
      </FRow>

      <HFCheckbox control={control} name="required" label="Required" />

      <HFCheckbox
        control={control}
        name="attributes.showTooltip"
        label="Show tooltip"
        className="mb-1"
      />

      {showTooltip && (
        <FRow label="Tooltip text">
          <HFTextField fullWidth name="attributes.tooltipText" control={control} />
        </FRow>
      )}
    </ModalCard>
  )
}

export default DateAttributes
