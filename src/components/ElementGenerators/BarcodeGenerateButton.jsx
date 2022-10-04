import printJS from 'print-js';
import React from 'react';
import styles from './style.module.scss'
import PrintIcon from '@mui/icons-material/Print';


function BarcodeGenerateButton({ onChange, printBarcode }) {
    const generateBarcode = () => {
        console.log('dasdsad', onChange(321321323123))
    }
    
    return (
        <>
         <button className={styles.barcode_generate} onClick={generateBarcode}>Generate</button>
         <button className={styles.barcode_print} onClick={printBarcode}><PrintIcon/></button>
        </>
    );
}

export default BarcodeGenerateButton;