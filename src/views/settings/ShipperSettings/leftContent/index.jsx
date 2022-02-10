import { useState } from "react"
import { useTranslation } from "react-i18next"

//components
import Form from "../../../../components/Form/Index"
import Card from "../../../../components/Card"
import Gallery from "../../../../components/Gallery"
import { Input } from "alisa-ui"

export default function LeftContent({ formik }) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik

  return (
    <div className="col-span-6">
      <Card title={t("general.information")}>
        <div className="flex w-full items-baseline">
          <div className="w-1/4 input-label">{t("name")}</div>
          <div className="w-3/4">
            <Form.Item formik={formik} name="name">
              <Input
                size="large"
                id="name"
                value={values.name}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-1/4 input-label">{t("phone.number")}</div>
          <div className="w-3/4">
            <Form.Item formik={formik} name="phone">
              <Input
                size="large"
                prefix="+998"
                id="phone"
                type="number"
                value={values.phone}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-1/4 input-label">{t("Комиссия")}</div>
          <div className="w-3/4">
            <Form.Item formik={formik} name="settlement_rate">
              <Input
                size="large"
                type="number"
                id="settlement_rate"
                onChange={handleChange}
                value={values.settlement_rate}
              />
            </Form.Item>
          </div>
        </div>
      </Card>

      <Card title={t("photo")} className="mt-4">
        <div className="flex w-full">
          <div className="w-1/4 input-label">{t("logo")}</div>
          <div className="w-3/4">
            <Gallery
              height={96}
              width={96}
              gallery={values.logo ? [values.logo] : []}
              setGallery={(elm) => setFieldValue("logo", elm[0])}
              multiple={false}
            />
          </div>
        </div>

        <div className="flex w-full mt-4">
          <div className="w-1/4 input-label">{t("background")}</div>
          <div className="w-3/4">
            <Gallery
              width={187}
              height={96}
              aspectRatio=""
              gallery={values.menu_image ? [values.menu_image] : []}
              setGallery={(elm) => {
                setFieldValue("menu_image", elm[0])
              }}
              multiple={false}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
