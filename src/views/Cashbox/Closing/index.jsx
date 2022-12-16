import { DragHandle, Payments, Remove } from "@mui/icons-material"
import { Divider, TextField } from "@mui/material"
import { useForm } from "react-hook-form"
import FRow from "../../../components/FormElements/FRow"
import HFTextField from "../../../components/FormElements/HFTextField"
import TableCard from "../../../components/TableCard"
import styles from "../Opening/style.module.scss"
import { useMutation, useQuery } from "react-query"
import request from "../../../utils/request"
import PageFallback from "../../../components/PageFallback"
import PaymentTypeIconGenerator from "../components/PaymentTypeIconGenerator"
import { useMemo } from "react"
import { numberWithSpaces } from "../../../utils/formatNumbers"
import SaveButton from "../../../components/Buttons/SaveButton"
import CancelButton from "../../../components/Buttons/CancelButton"
import Footer from "../../../components/Footer"
import { useNavigate } from "react-router-dom"
import { cashboxActions } from "../../../store/cashbox/cashbox.slice"
import { useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"

const CashboxClosing = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
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

  const { mutate, isLoading: btnLoading } = useMutation(
    (data) => {
      return request.post("/cashbox_transaction", data)
    },
    {
      onSuccess: () => {
        dispatch(cashboxActions.setStatus("Закрыто"))
      },
    }
  )

  const onSubmit = (values) => {
    let amount = 0
    let summ = 0

    values?.overall_payments?.forEach((el) => {
      amount += Number(el.amount ?? 0)
      summ += Number(el.summ ?? 0)
    })

    const data = {
      comment: values.comment,
      status: "Закрыто",
      amount_of_money: summ - amount,
    }
    mutate(data)
  }

  if (isLoading) return <PageFallback />

  return (
    <>
      <div className={styles.page}>
        <TableCard>
          <div className={styles.row}>
            <div className={styles.section}>
              <p className={styles.label}>{t("total.sum")}</p>

              <div className={styles.value}>
                {numberWithSpaces(total.amount)}
              </div>
            </div>

            <div className={styles.section}>
              <p className={styles.label}>{t("consumption")}</p>

              <div className={styles.value}>
                {numberWithSpaces(total.summ - total.amount)}
              </div>
            </div>
          </div>
        </TableCard>

        <TableCard>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("type")}</th>
                <th>{t("fact")}</th>
                <th></th>
                <th>{t("plan")}</th>
                <th></th>
                <th>{t("difference")}</th>
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
                    <HFTextField
                      control={control}
                      name={`overall_payments.[${index}].summ`}
                      fullWidth
                    />
                  </td>
                  <td>
                    <div className={styles.iconBlock}>
                      <Remove color="primary" />
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
                      <DragHandle color="primary" />
                    </div>
                  </td>
                  <td>
                    <TextField
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={
                        Number(payment.summ ?? 0) - Number(payment.amount ?? 0)
                      }
                      fullWidth
                      type="number"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Divider className={styles.divider} />

          <FRow label={t("commentary")}>
            <HFTextField
              fullWidth
              control={control}
              name="comment"
              multiline
              rows={4}
              placeholder={t("enter.comment")}
            />
          </FRow>
        </TableCard>
      </div>
      <Footer
        extra={
          <>
            <CancelButton onClick={() => navigate(-1)} />
            <SaveButton loading={btnLoading} onClick={handleSubmit(onSubmit)} />
          </>
        }
      />
    </>
  )
}

export default CashboxClosing
