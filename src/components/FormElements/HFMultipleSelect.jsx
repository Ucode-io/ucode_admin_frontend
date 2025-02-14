import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import {useMemo} from "react";
import {Controller} from "react-hook-form";
import {listToMap} from "../../utils/listToMap";
import styles from "./style.module.scss";
import ClearIcon from "@mui/icons-material/Clear";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const HFMultipleSelect = ({
  control,
  name,
  label,
  width = "100%",
  options = [],
  disabledHelperText,
  placeholder,
  required = false,
  rules = {},
  id = "",
  ...props
}) => {
  const optionsMap = useMemo(() => listToMap(options, "value"), [options]);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <FormControl style={{width}}>
          <InputLabel size="small">{label}</InputLabel>
          <Select
            labelId={`multiselect${id}`}
            id={`multiselect${id}`}
            multiple
            displayEmpty
            value={Array.isArray(value) ? value : []}
            onChange={(e) => onChange(e.target.value)}
            input={
              <OutlinedInput
                error={!!error}
                size="small"
                id={`multiselect-${id}`}
              />
            }
            renderValue={(selected) => {
              if (!selected?.length) {
                return (
                  <span className={styles.placeholder}>{placeholder}</span>
                );
              }

              return (
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Box
                    sx={{display: "flex", flexWrap: "wrap", gap: 0.5, flex: 1}}>
                    {selected?.map((value) => (
                      <div key={value} className={styles.tag}>
                        {optionsMap[value]?.label ?? value}
                      </div>
                    ))}
                  </Box>
                  <IconButton
                    size="small"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onChange([]);
                    }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            }}
            MenuProps={MenuProps}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>

          {error?.message && (
            <FormHelperText error>{error?.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default HFMultipleSelect;
