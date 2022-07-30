import { DragHandle, Payments, Remove } from "@mui/icons-material"
import { Divider, TextField } from "@mui/material"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import FRow from "../../../components/FormElements/FRow"
import HFTextField from "../../../components/FormElements/HFTextField"
import PageFallback from "../../../components/PageFallback"
import TableCard from "../../../components/TableCard"
import request from "../../../utils/request"
import PaymentTypeIconGenerator from "../components/PaymentTypeIconGenerator"
import styles from "./style.module.scss"

const CashboxOpening = () => {
  const { control, reset, watch, handleSubmit } = useForm({
    mode: 'all'
  })

  const { isLoading } = useQuery(
    ["GET_CASHBOX_OPENING_DATA"],
    () => {
      return request.get("/open-cashbox")
    },
    {
      onSuccess: (res) => {
        reset({
          overall_payments: res?.overall_payments?.map(el => ({...el, amount: el.amount ?? 0}))
        })
      },
    }
  )

  const data = watch()

  const onSubmit = (val) => {
    console.log("VALll ---->", val)
  }
  
  if (isLoading) return <PageFallback />

  return (
    <div>
      <TableCard>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Тип</th>
              <th>План</th>
              <th></th>
              <th>Факт</th>
              <th></th>
              <th>Разница</th>
            </tr>
          </thead>

          <tbody>
            {data?.overall_payments?.map((payment, index) => (
              <tr key={payment.type}>
                <td>
                  <div className={styles.iconBlock}>
                    <PaymentTypeIconGenerator type={payment.type} />
                  </div>
                </td>
                <td>
                  <TextField
                    size="small"
                    readOnly
                    value={payment.amount ?? 0}
                    fullWidth
                    type="number"
                  />
                </td>
                <td>
                  <div className={styles.iconBlock}>
                    <Remove color="primary" />
                  </div>
                </td>
                <td>
                  <HFTextField control={control} name={`overall_payments.[${index}].summ`} fullWidth />
                </td>
                <td>
                  <div className={styles.iconBlock}>
                    <DragHandle color="primary" />
                  </div>
                </td>
                <td>
                  <TextField
                    size="small"
                    disabled
                    value={payment.amount - payment.summ}
                    fullWidth
                    type="number"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Divider className={styles.divider} />

        <FRow label="Комментария">
          <HFTextField
            fullWidth
            control={control}
            name="4"
            multiline
            rows={4}
            placeholder="Enter a comment"
            readOnly
          />
        </FRow>
      </TableCard>
    </div>
  )
}

export default CashboxOpening
