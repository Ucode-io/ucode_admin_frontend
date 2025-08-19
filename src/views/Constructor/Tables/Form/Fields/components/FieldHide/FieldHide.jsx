import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import HFSelect from "@/components/FormElements/HFSelect";
import { useFieldHideProps } from "./useFieldHideProps";

export const FieldHide = ({ control }) => {
  
  const {getHideField, getOnchangeField, computedFilteredFields, selectedField } = useFieldHideProps({ control });

  return <Box>
    <Box display="flex" flexDirection="column" rowGap="8px">
      <HFSelect
        id="hide_fields"
        disabledHelperText
        name="attributes.hide_path_field"
        control={control}
        options={computedFilteredFields}
        className={cls.input}
        getOnchangeField={getOnchangeField}
        placeholder="Hide Field from"
      />
      {
        getHideField(selectedField?.type)
      }
    </Box>
  </Box>
}
