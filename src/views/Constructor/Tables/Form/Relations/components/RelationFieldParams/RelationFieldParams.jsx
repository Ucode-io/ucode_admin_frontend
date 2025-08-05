import { Box, Button } from "@mui/material"
import { ParamsHeader } from "../../../components/ParamsHeader"
import { useRelationFieldParamsProps } from "./useRelationFieldParamsProps"
import HFTextField from "@/components/FormElements/HFTextField";
import HFSelect from "@/components/FormElements/HFSelect";
import HFMultipleSelect from "@/components/FormElements/HFMultipleSelect";
import { FieldCheckbox } from "../../../components/FieldCheckbox/FieldCheckbox";
import { FieldMenuItem } from "../../../components/FieldMenuItem";

export const RelationFieldParams = ({
  onClose,
  formType,
  handleSelectSetting,
  SETTING_TYPES,
  watch,
  control,
  register,
  setValue,
  handleSubmit,
  submitHandler,
}) => {

  const {
    languages,
    i18n,
    computedTablesList,
    values,
    isRecursiveRelation,
    computedRelationsTypesList,
    computedFieldsListOptions,
  } = useRelationFieldParamsProps({
    control,
    setValue,
    watch,
    register,
  });

  return <Box>
    <ParamsHeader onClose={onClose} formType={formType} />
    <Box display="flex" flexDirection="column" rowGap="16px" >
      <Box display="flex" gap="6px">
        <Box display="flex" flexDirection="column" gap="6px">
          {
            languages?.map((lang) => (
              <HFTextField
                key={`${lang?.slug}_from`}
                name={`attributes.label_${lang?.slug}`}
                control={control}
                placeholder={`Label From (${lang?.slug})`}
                fullWidth
                id={`relation_label_from_${i18n?.language}`}
              />
            ))
          }
        </Box>
        <Box display="flex" flexDirection="column" gap="6px">
          {
            languages?.map((lang) => (
              <HFTextField
                key={`${lang?.slug}_to`}
                name={`attributes.label_to_${lang?.slug}`}
                control={control}
                placeholder={`Label To (${lang?.slug})`}
                fullWidth
                id={`relation_label_to_${i18n?.language}`}
              />
            ))
          }
        </Box>
      </Box>
      <HFSelect
        name="table_from"
        control={control}
        placeholder="Table from"
        options={computedTablesList}
        autoFocus
        required
      />
      {!isRecursiveRelation && values.type !== "Many2Dynamic" && (
        <HFSelect
          name="table_to"
          control={control}
          placeholder="Table to"
          options={computedTablesList}
          required
        />
      )}
      <HFSelect
        name="type"
        control={control}
        placeholder="Relation type"
        options={computedRelationsTypesList}
        required
      />
      <HFMultipleSelect
        name="view_fields"
        control={control}
        options={computedFieldsListOptions}
        placeholder="View fields"
      />
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <FieldCheckbox
          watch={watch}
          register={register}
          setValue={setValue}
          control={control}
          name="attributes.table_editable"
          label={"Disable Edit table"}
        />
        <FieldCheckbox
          watch={watch}
          register={register}
          setValue={setValue}
          control={control}
          name="attributes.enable_multi_language"
          label={"Enable multi language"}
        />
      </Box>
      <Box>
        <FieldMenuItem
          onClick={() => handleSelectSetting(SETTING_TYPES.ADDITIONAL)}
          title="Additional"
        />
        <FieldMenuItem
          onClick={() => handleSelectSetting(SETTING_TYPES.AUTO_FILTER)}
          title="Auto Filter"
        />
      </Box>
    </Box>
    <Button
      fullWidth
      sx={{ marginTop: "8px", lineHeight: "20px", height: "36px" }}
      size="medium"
      variant="contained"
      onClick={handleSubmit(submitHandler)}
    >
      Save
    </Button>
  </Box>

}
