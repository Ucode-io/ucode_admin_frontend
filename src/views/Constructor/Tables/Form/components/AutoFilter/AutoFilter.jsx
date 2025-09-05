import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { useAutoFilterProps } from "./useAutoFilterProps";
import HFSelect from "../../../../../../components/FormElements/HFSelect";
import RectangleIconButton from "../../../../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import DefaultValueBlock from "../../Relations/DefaultValueBlock";

export const AutoFilter = ({ watch, control, register, setValue }) => {
  const { fields, attributeFields, deleteAutoFilter, addNewAutoFilter } =
    useAutoFilterProps({ control, watch });

  const values = watch();

  return (
    <Box>
      <Box>
        <DefaultValueBlock
          control={control}
          watch={watch}
          columnsList={values.columnsList}
          register={register}
          setValue={setValue}
        />
      </Box>
      <Box display="flex" flexDirection="column" rowGap="8px">
        {fields.map((field, index) => (
          <Box display="flex" columnGap="8px">
            <Box display="flex" columnGap="6px" flexGrow={1}>
              {attributeFields.map((item, fieldIndex) => (
                <HFSelect
                  key={fieldIndex}
                  control={control}
                  options={item.options}
                  loading={item.isLoading}
                  placeholder={item.placeholder}
                  name={`auto_filters.${index}.${item.slug}`}
                />
              ))}
            </Box>
            <RectangleIconButton
              color="error"
              onClick={() => deleteAutoFilter(index)}
            >
              <Delete color="error" />
            </RectangleIconButton>
          </Box>
        ))}
      </Box>
      <div className={cls.summaryButton}>
        <button
          className={cls.addBtn}
          onClick={addNewAutoFilter}
          variant="contained"
          style={{ fontSize: "14px" }}
        >
          Add
        </button>
      </div>
    </Box>
  );
};
