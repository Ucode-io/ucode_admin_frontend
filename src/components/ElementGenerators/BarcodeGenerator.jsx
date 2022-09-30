import React from 'react';
import Barcode from 'react-barcode';

function BarcodeGenerator(props) {
    return (
        <div>
        <Barcode value={9735940564824} width={2.5} height={50} format="EAN13" />
        </div>
    );
}

export default BarcodeGenerator;