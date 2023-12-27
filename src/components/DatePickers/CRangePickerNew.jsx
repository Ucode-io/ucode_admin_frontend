import {Today, Clear} from "@mui/icons-material";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import DatePicker from "react-multi-date-picker";
import CustomNavButton from "./Plugins/CustomNavButton";
import weekends from "react-multi-date-picker/plugins/highlight_weekends";
import {locale} from "./Plugins/locale";

const CRangePickerNew = ({onChange, value, placeholder}) => {
  const changeHander = (val) => {
    const from = new Date(val[0]);
    const to = new Date(val[1]);
    from.setHours(5);
    from.setMinutes(0);
    from.setSeconds(0);
    to.setHours(28);
    to.setMinutes(59);
    to.setSeconds(59);
    if (!val?.length) onChange([]);
    else if (val?.[0] && val?.[1]) {
      onChange({
        $gte: from,
        $lt: to,
      });
    }
  };

  const clearHandler = () => {
    onChange([]);
  };

  return (
    <DatePicker
      render={(value, openCalendar, handleChange) => {
        return (
          <TextField
            value={value}
            onClick={openCalendar}
            onChange={handleChange}
            size="small"
            fullWidth
            autoComplete="off"
            placeholder={placeholder}
            InputProps={{
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <Today />
                  </InputAdornment>
                  {value?.length > 0 && (
                    <span
                      onClick={clearHandler}
                      style={{margin: "5px 0 0 5px", cursor: "pointer"}}
                    >
                      <Clear />
                    </span>
                  )}
                </>
              ),
            }}
          />
        );
      }}
      range
      // renderButton={<CustomNavButton />}
      // animations={[opacity()]}
      plugins={[weekends()]}
      weekStartDayIndex={1}
      portal
      locale={locale}
      className="datePicker"
      format="DD.MM.YYYY"
      numberOfMonths={2}
      onChange={changeHander}
      value={Object.values(value ?? {})}
      // onChange={(val) => onChange(val ? new Date(val) : "")}
    />
  );
};

export default CRangePickerNew;
