import { useWatch } from "react-hook-form"
import FRow from "../../../../../../components/FormElements-backup/FRow"
import HFCheckbox from "../../../../../../components/FormElements/HFCheckbox"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import ModalCard from "../../../../../../components/ModalCard"

const NumberAttributes = ({ control, onClose, onSaveButtonClick }) => {
  
  const showTooltip = useWatch({
    control,
    name: "attributes.showTooltip",
  })

  return (
    <ModalCard title="Number properties" onClose={onClose} onSaveButtonClick={onSaveButtonClick}  >
      <FRow label="Field label" required>
        <HFTextField autoFocus fullWidth name="label" control={control} />
      </FRow>
      <FRow label="Placeholder">
        <HFTextField autoFocus fullWidth name="attributes.placeholder" control={control} />
      </FRow>
      <FRow label="Allowed number of characters">
        <HFTextField
          fullWidth
          name="attributes.maxLength"
          control={control}
          type="number"
          min={0}
        />
      </FRow>

      <HFCheckbox control={control} name="required" label="Required" />
      <HFCheckbox
        control={control}
        name="unique"
        label="Avoid duplicate values"
      />
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

export default NumberAttributes
