import {NumericFormat} from "react-number-format";
import styles from "./style.module.scss";

const HFFloatField = ({
  isBlackBg = false,
  isFormEdit = false,
  isTransparent = false,
  fullWidth = false,
  disabled,
  decimalScale = 50,
  row,
  handleChange = () => {},
  ...props
}) => {
  const style = isTransparent
    ? { background: "transparent", border: "none" }
    : disabled
      ? { background: "#c0c0c039" }
      : {
          background: isBlackBg ? "#2A2D34" : "",
          color: isBlackBg ? "#fff" : "",
        };

  const value = row?.value;

  const onChange = (value) => {
    handleChange({
      value,
      rowId: row?.guid,
      name: row?.slug,
    });
  };

  return (
    <NumericFormat
      id="float-field"
      thousandsGroupStyle="thousand"
      thousandSeparator=" "
      decimalScale={decimalScale}
      displayType="input"
      isNumericString={true}
      autoComplete="off"
      allowNegative={true}
      fullWidth={fullWidth}
      value={value ?? ""}
      // onChange={(e) => {
      //   const val = e.target.value;
      //   const valueWithoutSpaces = val.replaceAll(" ", "");
      //   if (!valueWithoutSpaces) onChange(null);
      //   else {
      //     if (valueWithoutSpaces.at(-1) === ".")
      //       onChange(parseFloat(valueWithoutSpaces));
      //     else
      //       onChange(
      //         !isNaN(valueWithoutSpaces)
      //           ? parseFloat(valueWithoutSpaces)
      //           : valueWithoutSpaces,
      //       );
      //   }
      // }}
      className={`${isFormEdit ? "custom_textfield" : ""} ${
        styles.numberField
      }`}
      readOnly={disabled}
      style={{ ...style, padding: "4px", paddingLeft: "0", outline: "none" }}
      {...props}
    />
  );
};

export default HFFloatField;
