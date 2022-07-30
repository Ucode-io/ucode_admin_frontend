import { DragHandle, Payments, Remove } from "@mui/icons-material"
import { Divider, TextField } from "@mui/material"
import { useForm } from "react-hook-form"
import FRow from "../../../components/FormElements/FRow"
import HFTextField from "../../../components/FormElements/HFTextField"
import TableCard from "../../../components/TableCard"
import styles from "../Opening/style.module.scss"
import { useQuery } from "react-query"
import request from "../../../utils/request"
import PageFallback from "../../../components/PageFallback"
import PaymentTypeIconGenerator from "../components/PaymentTypeIconGenerator"
import { useMemo } from "react"
import { numberWithSpaces } from "../../../utils/formatNumbers"

const CashboxClosing = () => {
  const { control, reset, watch, handleSubmit } = useForm({
    mode: "all",
  })

  const { isLoading } = useQuery(
    ["GET_CASHBOX_OPENING_DATA"],
    () => {
      return request.get("/close-cashbox")
    },
    {
      onSuccess: (res) => {
        reset({
          overall_payments: res?.overall_payments?.map((el) => ({
            ...el,
            amount: el.amount ?? 0,
          })),
        })
      },
    }
  )

  const data = watch()

  const total = useMemo(() => {
    let amount = 0
    let summ = 0

    data?.overall_payments?.forEach((el) => {
      amount += Number(el.amount ?? 0)
      summ += Number(el.summ ?? 0)
    })

    return {
      amount,
      summ,
    }
  }, [data])

  if (isLoading) return <PageFallback />

  return (
    <div>
      <TableCard>
        <div className={styles.row}>
          <div className={styles.section}>
            <p className={styles.label}>Общая сумма</p>

            <div className={styles.value}>{ numberWithSpaces(total.amount) }</div>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>Расход</p>

            <div className={styles.value}>{ numberWithSpaces(total.amount - total.summ) }</div>
          </div>
        </div>
      </TableCard>

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
                    InputProps={{
                      readOnly: true,
                    }}
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
                  <HFTextField
                    control={control}
                    name={`overall_payments.[${index}].summ`}
                    fullWidth
                  />
                </td>
                <td>
                  <div className={styles.iconBlock}>
                    <DragHandle color="primary" />
                  </div>
                </td>
                <td>
                  <TextField
                    size="small"
                    InputProps={{
                      readOnly: true,
                    }}
                    value={Number(payment.amount ?? 0) - Number(payment.summ ?? 0)}
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
          />
        </FRow>
      </TableCard>
    </div>
  )
}

export default CashboxClosing
