import {useEffect} from "react";
import {makeStyles} from "@mui/styles";
import styles from "./style.module.scss";
import {useLocation} from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import {InputAdornment, TextField} from "@mui/material";
import RowClickButton from "../RowClickButton";

const useStyles = makeStyles((theme) => ({
  input: {
    padding: "0px",
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFLinkFieldEditor = (props) => {
  const {
    value,
    setValue,
    isNewTableView = false,
    disabled = false,
    colDef,
    data,
  } = props;
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname?.includes("create") &&
      location?.state?.isTreeView === true
    ) {
      setValue("");
    }
  }, []);

  const navigateToNewPage = (url, target = "_blank") => {
    if (!url) return;
    window.open(url, target);
  };

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  return (
    <>
      <TextField
        size="small"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        fullWidth
        sx={{
          backgroundColor: "transparent",
          "& .MuiInputBase-root": {
            backgroundColor: "transparent",
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        }}
        InputProps={{
          readOnly: disabled,
          inputProps: {style: {height: "32px"}},

          endAdornment: (
            <InputAdornment position="start">
              <button
                style={{marginRight: "10px"}}
                disabled={Boolean(!value)}
                className={styles.linkBtn}
                onClick={() => navigateToNewPage(value)}
                sx={{cursor: "pointer"}}>
                <LaunchIcon style={{fontSize: "20px"}} />
              </button>
            </InputAdornment>
          ),
        }}
        className={"custom_textfield_new"}
        {...props}
      />
      {colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
};

export default HFLinkFieldEditor;
