import Card from "../../components/Card/index";
import Form from "../../components/Form/Index";
import Input from "../../components/Input/index";
import Textarea from "../../components/Textarea/index";
import { useTranslation } from "react-i18next";

export default function Content ({ formik }) {
  // **** USE-HOOKS ****
  const { t } = useTranslation();

  return (
    <div
      className="m-3 grid grid-cols-2 grid-rows-2 gap-4 box-border font-body"
      style={{ fontSize: "14px", lineHeight: "24px" }}
    >
      <Card title={t("general.information")} className="row-span-2">
        {/* name */}
        <div className="w-full flex items-baseline">
          <div className="w-1/3">{t("full.name")}</div>
          <div className="w-2/3">
            <Form.Item name="name" formik={formik}>
              <Input
                id="name"
                type="text"
                {...formik.getFieldProps("name")}
              />
            </Form.Item>
          </div>
        </div>
        {/* description */}
        <div className="w-full flex items-baseline">
          <div className="w-1/3">{t("description")}</div>
          <div className="w-2/3">
            <Form.Item name="description" formik={formik}>
              <Textarea
                id="description"
                {...formik.getFieldProps("description")}
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  )
}