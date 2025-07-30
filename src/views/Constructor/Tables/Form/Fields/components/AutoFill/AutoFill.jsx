import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import HFSelect from "@/components/FormElements/HFSelect";
import { FieldCheckbox } from "../FieldCheckbox";
import { useAutoFillProps } from "./useAutoFillProps";

export const AutoFill = ({
  control,
  register,
  watch,
  setValue,
  mainForm,
}) => {

  const { computedRelationFields, computedRelationTables } = useAutoFillProps({ control, mainForm })

  return <Box>
    <Box display="flex" flexDirection="column" rowGap="8px" marginBottom="8px">
      <HFSelect
        disabledHelperText
        name="autofill_table"
        control={control}
        options={computedRelationTables}
        placeholder="Autofill table"
        className={cls.input}
      />
      <HFSelect
        disabledHelperText
        name="autofill_field"
        control={control}
        options={computedRelationFields}
        placeholder="Type"
        className={cls.input}
      />
    </Box>
    <FieldCheckbox
      register={register}
      label="Automatic"
      name="automatic"
      watch={watch}
      setValue={setValue}
    />
  </Box>
}
