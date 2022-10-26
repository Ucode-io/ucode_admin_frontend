import { TextField } from "@mui/material"
import { Fragment } from "react"
import { useFieldArray } from "react-hook-form"
import { useTranslation } from "react-i18next"
import FormCard from "../../../../../components/FormCard"
import HFCheckbox from "../../../../../components/FormElements/HFCheckbox"
import HFTextField from "../../../../../components/FormElements/HFTextField"
import style from "./style.module.scss"

const ServicesList = ({ form, isUpdated }) => {
  const { t } = useTranslation()

  const { fields: services } = useFieldArray({
    control: form.control,
    name: "services",
    keyName: "key",
  })

  return (
    <FormCard title={t("list.of.services")} maxWidth="auto">
      <table className={style.table}>
        {services?.map((service, index) => (
          <Fragment key={service.id}>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>{t("service.name")}</th>
              <th>{t("doctor")}</th>
              <th style={{ width: 80 }}>{t("quantity.short")}</th>
              <th style={{ width: 150 }}>{t("service.amount")}</th>
            </tr>

            <tr>
              <td>
                <HFCheckbox
                  disabled={isUpdated}
                  name={`services[${index}].checked`}
                  control={form.control}
                />
              </td>

              <td>
                <HFTextField
                  name={`services[${index}].service_name`}
                  control={form.control}
                  fullWidth
                  disabledHelperText
                />
              </td>

              <td>
                <HFTextField
                  name={`services[${index}].doctor_name`}
                  control={form.control}
                  fullWidth
                  disabledHelperText
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </td>

              <td>
                <TextField fullWidth size="small" value={1} />
              </td>

              <td>
                <HFTextField
                  name={`services[${index}].service_price`}
                  control={form.control}
                  fullWidth
                  disabledHelperText
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </td>
            </tr>
          </Fragment>
        ))}
      </table>
    </FormCard>
  )
}

export default ServicesList
