import {makeStyles} from "@mui/styles";
import {useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import styles from "./style.module.scss";
import {useParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {Close, Lock} from "@mui/icons-material";
import {generateGUID} from "../../../../utils/generateID";
import FRow from "../../../../components/FormElements/FRow";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import RippleLoader from "../../../../components/Loaders/RippleLoader";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import HFTextField from "../../../../components/FormElements/HFTextField";
import HFIconPicker from "../../../../components/FormElements/HFIconPicker";
import HFColorPicker from "../../../../components/FormElements/HFColorPicker";
import constructorFieldService from "../../../../services/constructorFieldService";
import {
  Box,
  Dialog,
  Tooltip,
  TextField,
  InputLabel,
  FormControl,
  Autocomplete,
  FormHelperText,
  InputAdornment,
  createFilterOptions,
} from "@mui/material";
import RowClickButton from "../RowClickButton";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFAggridMultiselect = (props) => {
  const classes = useStyles();

  const {value, setValue = () => {}, field, width = "100%", colDef} = props;
  const options = colDef?.cellEditorParams?.field?.attributes?.options;
  const hasColor = colDef?.cellEditorParams?.field.attributes?.has_color;
  const hasIcon = colDef?.cellEditorParams?.field.attributes?.has_icon;
  const isMultiSelect =
    colDef?.cellEditorParams?.field.attributes?.is_multiselect;

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
      }}>
      <AutoCompleteElement
        value={value}
        width={width}
        field={field}
        classes={classes}
        options={options}
        hasIcon={hasIcon}
        hasColor={hasColor}
        className="hf-select"
        onFormChange={setValue}
        required={field?.required}
        disabled={field?.disabled}
        isMultiSelect={isMultiSelect}
        props={props}
      />
    </Box>
  );
};

const AutoCompleteElement = ({
  props,
  value,
  field,
  options,
  hasIcon,
  hasColor,
  width = 0,
  label = "",
  error = {},
  classes = {},
  isMultiSelect,
  disabled = false,
  placeholder = "",
  isBlackBg = false,
  disabledHelperText = "",
  onFormChange = () => {},
}) => {
  const [dialogState, setDialogState] = useState(null);
  const {appId} = useParams();

  const editPermission = field?.attributes?.field_permission?.edit_permission;

  const handleClose = () => {
    setDialogState(null);
  };
  const [localOptions, setLocalOptions] = useState(options || []);

  const computedValue = useMemo(() => {
    if (!value?.length) return [];

    if (isMultiSelect)
      if (Array.isArray(value)) {
        return (
          value?.map((el) =>
            localOptions?.find((option) => option.value === el)
          ) ?? []
        );
      } else {
        return localOptions?.find((item) => {
          item?.value === value;
        });
      }
    else return [localOptions?.find((option) => option.value === value?.[0])];
  }, [value, localOptions, isMultiSelect]);

  const addNewOption = (newOption) => {
    setLocalOptions((prev) => [...prev, newOption]);
    changeHandler(null, [...computedValue, newOption]);
  };
  const changeHandler = (_, values) => {
    if (isMultiSelect) onFormChange(values?.map((el) => el.value));
    else onFormChange([values[values?.length - 1]?.value] || []);
  };

  return (
    <>
      {" "}
      <FormControl
        id="multiSelectForm"
        className={styles.aggridMultiSelect}
        sx={{width}}>
        <InputLabel size="small">{label}</InputLabel>
        <Autocomplete
          multiple
          id={`multiselect`}
          value={computedValue}
          options={localOptions}
          popupIcon={
            isBlackBg ? (
              <ArrowDropDownIcon style={{color: "#fff"}} />
            ) : (
              <ArrowDropDownIcon />
            )
          }
          disableCloseOnSelect
          getOptionLabel={(option) => option?.label ?? option?.value}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          onChange={changeHandler}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (params.inputValue !== "" && field?.attributes?.creatable) {
              filtered.push({
                value: "NEW",
                inputValue: params.inputValue,
                label: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={computedValue?.length ? "" : placeholder}
              sx={{
                "&.MuiInputAdornment-root": {
                  position: "absolute",
                  right: 0,
                },
              }}
              InputProps={{
                ...params.InputProps,
                classes: {
                  input: isBlackBg ? classes.input : "",
                },

                endAdornment: Boolean(
                  appId === "fadc103a-b411-4a1a-b47c-e794c33f85f6" || disabled
                ) && (
                  <Tooltip
                    title="This field is disabled for this role!"
                    style={{
                      position: "absolute",
                      right: 0,
                    }}>
                    <InputAdornment position="start">
                      <Lock style={{fontSize: "20px"}} />
                    </InputAdornment>
                  </Tooltip>
                ),
              }}
              className={`multiselectAggrid multiSelectInput`}
              size="small"
            />
          )}
          noOptionsText={"No options"}
          disabled={
            appId === "fadc103a-b411-4a1a-b47c-e794c33f85f6" ? true : disabled
          }
          renderTags={(values, getTagProps) => (
            <div className={styles.valuesWrapper}>
              {values?.map((el, index) => (
                <div
                  key={el?.value}
                  className={styles.multipleAutocompleteTags}
                  style={
                    hasColor
                      ? {color: el?.color, background: `${el?.color}30`}
                      : {}
                  }>
                  {hasIcon && <IconGenerator icon={el?.icon} />}
                  <p className={styles.value}>{el?.label ?? el?.value}</p>
                  {field?.attributes?.disabled === false && editPermission && (
                    <Close
                      fontSize="10"
                      style={{cursor: "pointer"}}
                      onClick={() => {
                        getTagProps({index})?.onDelete();
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        />
        {!disabledHelperText && error?.message && (
          <FormHelperText error>{error?.message}</FormHelperText>
        )}

        <Dialog open={!!dialogState} onClose={handleClose}>
          <AddOptionBlock
            field={field}
            dialogState={dialogState}
            handleClose={handleClose}
            addNewOption={addNewOption}
          />
        </Dialog>
      </FormControl>
      {props?.colDef?.colIndex === 0 && <RowClickButton right="5px" />}
    </>
  );
};

const AddOptionBlock = ({field, dialogState, handleClose, addNewOption}) => {
  const hasColor = field.attributes?.has_color;
  const hasIcon = field.attributes?.has_icon;
  const [loader, setLoader] = useState(false);
  const {control, handleSubmit} = useForm({
    defaultValues: {
      label: dialogState,
      value: dialogState,
      id: generateGUID(),
    },
  });
  const onSubmit = (newOption) => {
    setLoader(true);
    const data = {
      ...field,
      attributes: {
        ...field?.attributes,
        options: [...field.attributes.options, newOption],
      },
    };

    constructorFieldService
      .update({...data})
      .then((res) => {
        handleClose(false);
        addNewOption(newOption);
      })
      .catch((err) => {
        setLoader(false);
      });
  };
  return (
    <div className={`${styles.dialog}`}>
      <h2>Add option</h2>
      <div className={styles.dialog_content}>
        <div className={styles.color_picker}>
          {hasColor && (
            <HFColorPicker
              control={control}
              name="color"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            />
          )}
          <h4>Color</h4>
        </div>
        <div className={styles.icon_picker}>
          {hasIcon && (
            <HFIconPicker shape="rectangle" control={control} name="icon" />
          )}
          <h4>Icon</h4>
        </div>
      </div>
      <form action="" className={styles.form_control}>
        <div className={styles.input_control}>
          <FRow label="Label">
            <HFTextField defaultValue="" control={control} name="label" />
          </FRow>
        </div>
        <div className={styles.input_control}>
          <FRow label="Value">
            <HFTextField defaultValue="" control={control} name="value" />
          </FRow>
        </div>
      </form>
      <div className={styles.submit_btn}>
        <PrimaryButton onClick={handleSubmit(onSubmit)}>
          Add
          {loader ? (
            <span className={styles.btn_loader}>
              <RippleLoader size="btn_size" height="20px" />
            </span>
          ) : (
            <AddIcon />
          )}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default HFAggridMultiselect;
