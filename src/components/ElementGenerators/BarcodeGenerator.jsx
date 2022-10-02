import React, { useState } from 'react';
import Barcode from 'react-barcode';
import styles from './style.module.scss'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '@mui/material';
import BarcodeGenerateButton from './BarcodeGenerateButton'
import printJS from 'print-js';


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
    
    const printBarcode = () => {
      printJS({ printable: 'barcode', type: 'html', header: 'PrintJS - Form Element Selection' })
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
         <div className="" id='barcode'>
          <Barcode value={value} width={2} height={50} format="EAN13" />
         </div>
          <BarcodeGenerateButton printBarcode={printBarcode} onChange={onChange}/>
          </>
        )}}
      ></Controller>
      </div>
    )
  }
  
  export default BarcodeGenerator