import { useWatch } from "react-hook-form"
import FRow from "../../../../../../components/FormElements/FRow"
import HFCheckbox from "../../../../../../components/FormElements/HFCheckbox"
import HFTextField from "../../../../../../components/FormElements/HFTextField"
import ModalCard from "../../../../../../components/ModalCard"
import SelectOptionsCreator from "../../../../../../components/SelectOptionsCreator"

const PickListAttributes = ({ control, onClose, onSaveButtonClick }) => {
  
  const showTooltip = useWatch({
    control,
    name: "attributes.showTooltip",
  })

  return (
    <>
      <FRow label="Placeholder">
        <HFTextField autoFocus fullWidth name="attributes.placeholder" control={control} />
      </FRow>
      <FRow label="Pick list option">
        <SelectOptionsCreator control={control} name="attributes.options" />
        {/* <HFTextField
          fullWidth
          name="attributes.maxLength"
          control={control}
          type="number"
          min={0}
        /> */}
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
    </>
  )
}

export default PickListAttributes
