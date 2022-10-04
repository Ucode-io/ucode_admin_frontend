import React, { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import styles from './style.module.scss'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '@mui/material';
import BarcodeGenerateButton from './BarcodeGenerateButton'
import printJS from 'print-js';
import wkhtmltopdf from 'wkhtmltopdf'


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
    // const printBarcode = () => {
    //   printJS({ printable: 'barcodes' , type: 'html', header: 'PrintJS - Form Element Selection' })
    // }
    function printBarcode(elem) { 
      var mywindow = window.open("", "PRINT", "height=0,width=0");
  
      mywindow.document.write(
        "<html><head><title>" + '' + "</title>"
      );
      mywindow.document.write("</head><body >");
      mywindow.document.write("<h1>" + '' + "</h1>");
      mywindow.document.write(document.getElementById(elem).innerHTML);
      mywindow.document.write("</body></html>");
  
      mywindow.document.close(); 
      mywindow.focus(); 
  
      mywindow.print();
      // mywindow.close();
  
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
          <TextField
            size="small"
            value={value}
            type='number'
            onChange={(e) => {
                const val = e.target.value

                if (!val) onChange("")
                else onChange(!isNaN(Number(val)) ? Number(val) : "")
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
         <div className="" id='barcodes'>
          <Barcode value={value} width={2} height={50} format="EAN13" />
         </div>
          <BarcodeGenerateButton printBarcode={() => printBarcode('barcodes')} onChange={onChange}/>
          </>
        )}}
      ></Controller>
      </div>
    )
  }
  
  export default BarcodeGenerator