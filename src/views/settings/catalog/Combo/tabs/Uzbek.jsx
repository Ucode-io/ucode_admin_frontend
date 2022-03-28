import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import TextArea from "components/Textarea";
import { useTranslation } from "react-i18next";

export default function Uzbek({ formik }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <>
      <div className="input-label">
        <span>{t("name")}</span>
      </div>
      <div className="">
        <div>
          <Form.Item formik={formik} name="title_uz">
            <Input
              size="large"
              id="title_uz"
              value={values.title_uz}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
      </div>

      <div className="input-label">
        <span>{t("description")}</span>
      </div>
      <div className="">
        <div>
          <Form.Item formik={formik} name="description_uz">
            <TextArea
              id="description_uz"
              {...formik.getFieldProps("description_uz")}
            />
          </Form.Item>
        </div>
      </div>
    </>
  );
}
