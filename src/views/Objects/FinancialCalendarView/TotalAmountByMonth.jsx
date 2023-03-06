import React from 'react'
import styles from './style.module.scss'
import { CTableRow, CTableCell } from '../../../components/CTable'

export default function TotalAmountByMonth({totalBalance}) {

    return (
        <>
            <CTableRow>
                <CTableCell style={{fontWeight: 700, fontSize: '14px'}}>Общий</CTableCell>
                {totalBalance.total && totalBalance.total.length > 0 && totalBalance.total.map((el, index) => 
                <>
                    <CTableCell key={`total-amount-${index}`}>
                        {el.amount}
                    </CTableCell>
                </>
                )}
            </CTableRow>
            
            {totalBalance.items && totalBalance.items.length > 0 && totalBalance.items.map((el, index) => 
                <CTableRow key={`items-${el.id}`}>
                    <CTableCell style={{paddingLeft: '30px'}}>{el.name}</CTableCell>
                    {el.amounts.length && el?.amounts?.map((el, index) => 
                        <CTableCell key={`total-amount-${index}`}>
                            {el.amount}
                        </CTableCell>
                    )}
                </CTableRow>
            )}
        </>
    )
}
      