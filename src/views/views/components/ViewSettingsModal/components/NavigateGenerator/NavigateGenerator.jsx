import {Box} from "@mui/material";
import {useFieldArray} from "react-hook-form";
import cls from "./styles.module.scss";
import HFTextField from "@/components/FormElements/HFTextField";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";

function NavigateGenerator({form}) {
  const {
    fields: values,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "attributes.navigate.params",
  });

  const addField = () => {
    append({
      key: "",
      value: "",
    });
  };

  const deleteField = (index) => {
    remove(index);
  };

  return (
    <Box mt={3}>
      <div>
        <p style={{ marginBottom: "6px" }}>Object URL</p>
        {values?.map((elements, index) => (
          <div key={elements?.key} className={cls.navigateWrap}>
            <HFTextField
              fullWidth
              control={form.control}
              name={`attributes.navigate.params[${index}].key`}
              placeholder={"key"}
            />
            <HFTextField
              fullWidth
              control={form.control}
              name={`attributes.navigate.params[${index}].value`}
              placeholder={"value"}
            />
            <RectangleIconButton onClick={() => deleteField(index)} color="error">
              <Delete color="error" />
            </RectangleIconButton>
          </div>
        ))}
      </div>
      <button className={cls.addBtn} onClick={addField}>
        Add
      </button>
    </Box>
  );
}

export default NavigateGenerator;
