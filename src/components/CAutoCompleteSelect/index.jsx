import { Lock } from "@mui/icons-material";
import { Autocomplete, InputAdornment, TextField, Tooltip } from "@mui/material";
import { useMemo } from "react";

const CAutoCompleteSelect = ({ options, value, onChange, tabIndex, disabled }) => {
  const computedValue = useMemo(() => {
    return options?.find((option) => option?.value === value) ?? null;
  }, [options, value]);

  return (
    <div>
      <Autocomplete
        // disablePortal
        options={options}
        value={computedValue}
        onChange={(e, value) => onChange(value)}
        getOptionLabel={(option) => option.label}
        // onSelect={(e, val) => console.log("VAL ==>", e.target.value)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        // sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            // autoFocus={tabIndex === 1}
            // InputProps={{ inputProps: { tabIndex } }}
            size="small"
            InputProps={{
              style: disabled
                ? {
                    background: "#c0c0c039",
                    paddingRight: "0px",
                  }
                : {
                    background: "#fff",
                    color: "#fff",
                  },

              endAdornment: disabled && (
                <Tooltip title="This field is disabled for this role!">
                  <InputAdornment position="start">
                    <Lock style={{ fontSize: "20px" }} />
                  </InputAdornment>
                </Tooltip>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default CAutoCompleteSelect;
