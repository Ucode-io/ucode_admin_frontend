import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import styles from "./style.module.scss";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import BarcodeGenerateButton from "./BarcodeGenerateButton";
import PrintIcon from "@mui/icons-material/Print";
import Dialog from "@mui/material/Dialog";
import FRow from "../FormElements/FRow";
import ClearIcon from "@mui/icons-material/Clear";
import PrimaryButton from "../../components/Buttons/PrimaryButton";

const BarcodeGenerator = ({
  control,
  name = "",
  disabledHelperText = false,
  required = false,
  fullWidth = false,
  withTrim = false,
  rules = {},
  defaultValue = "",
  disabled,
  ...props
}) => {
  const [count, setCount] = useState(1);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  function printBarcode() {
    let divContents = document.getElementById("barcodes").innerHTML;
    let a = window.open("", "", "height800, width=700");
    a.document.write("<html>");
    for (let i = 0; i < count; i++) {
      <p>{a.document.write(divContents)}</p>;
    }
    a.document.write("</body></html>");
    a.document.close();
    a.print();
    handleClose();
    return true;
  }
  return (
    <div className={styles.barcode_layer}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{
          required: required ? "This is required field" : false,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <div className={styles.input_control}>
                <TextField
                  size="small"
                  value={value}
                  type="number"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) onChange("");
                    else onChange(!isNaN(Number(val)) ? Number(val) : "");
                  }}
                  name={name}
                  error={error}
                  fullWidth={fullWidth}
                  InputProps={{
                    readOnly: disabled,
                    max: 13,
                    style: disabled
                      ? {
                          background: "#c0c0c039",
                        }
                      : {},
                  }}
                  helperText={!disabledHelperText && error?.message}
                  {...props}
                />
                <button className={styles.barcode_print} onClick={handleOpen}>
                  <PrintIcon />
                </button>
                <Dialog open={open} onClose={handleClose}>
                  <div className={styles.barcode_count}>
                    <button className={styles.cancel_btn}>
                      <ClearIcon />
                    </button>
                    <div className={styles.barcode_input_layer}>
                      <FRow label="Print Count">
                        <input
                          type="number"
                          value={count}
                          placeholder="Count"
                          className={styles.count_control}
                          onChange={(e) => setCount(e.target.value)}
                        />
                      </FRow>
                      <PrimaryButton
                        className={styles.barcode_print}
                        onClick={() => printBarcode("barcodes")}
                      >
                        Print
                      </PrimaryButton>
                    </div>
                  </div>
                </Dialog>
              </div>
              <div className="" id="barcodes">
                {value && (
                  <Barcode value={value} width={2} height={50} format="EAN13" />
                )}
              </div>
              <BarcodeGenerateButton
                printBarcode={() => printBarcode("barcodes")}
                onChange={onChange}
              />
            </>
          );
        }}
      ></Controller>
    </div>
  );
};

export default BarcodeGenerator;
