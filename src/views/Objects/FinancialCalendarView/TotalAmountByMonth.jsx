import React from 'react'
import styles from './style.module.scss'
import { CTableRow, CTableCell } from '../../../components/CTable'

export default function TotalAmountByMonth({totalBalance}) {

    return (
        <>
            <CTableRow>
                <CTableCell>Общий</CTableCell>
                {totalBalance.total && totalBalance.total.length > 0 && totalBalance.total.map((el, index) => 
                <>
                    <CTableCell className={styles.joinedPriceBlockChild} key={`total-amount-${index}`}>
                        {el.amount}
                    </CTableCell>
                </>
                )}
            </CTableRow>
            
            {totalBalance.items && totalBalance.items.length > 0 && totalBalance.items.map((el, index) => 
            <CTableRow className={styles.recursiveBlock} key={`items-${el.id}`}>
                <CTableCell className={styles.title} style={{paddingLeft: '30px'}}>{el.name}</CTableCell>
                {el.amounts.length && el?.amounts?.map((el, index) => 
                    <>
                        <CTableCell className={styles.joinedPriceBlockChild} key={`total-amount-${index}`}>
                            {el.amount}
                        </CTableCell>
                    </>
                )}
            </CTableRow>)}
        </>
    )
}
      