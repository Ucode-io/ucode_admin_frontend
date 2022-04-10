
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import Gallery from "components/Gallery/v2";
import { useTranslation } from "react-i18next";




export default function CategoryForm({formik, lang}) {

const {t} = useTranslation()



    return (
      <>
       <div className="grid grid-cols-4 gap-5 items-baseline mt-4">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`language_data.${lang}.name`}>
              <div className="input-label"> {t("picture")}</div>
              <Gallery />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-baseline">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`language_data.${lang}.name`}>
                
              <div className="input-label"> <span>*</span>  {t("name")}</div>
              <Input
                size="large"
                //   value={formik?.values.language_data[lang].name}
                //   onChange={handleChange}
                name={`language_data.${lang}.name`}
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-baseline">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`language_data.${lang}.name`}>
              <div className="input-label">{t("name")} (URL)</div>
              <Input
                size="large"
                //   value={formik?.values.language_data[lang].name}
                //   onChange={handleChange}
                name={`language_data.${lang}.name`}
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-baseline">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`language_data.${lang}.name`}>
              <div className="input-label">{t("description")}</div>
              <Input
                size="large"
                //   value={formik?.values.language_data[lang].name}
                //   onChange={handleChange}
                name={`language_data.${lang}.name`}
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-baseline">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`language_data.${lang}.name`}>
              <div className="input-label">{t("branch")}</div>
              <Input
                size="large"
                //   value={formik?.values.language_data[lang].name}
                //   onChange={handleChange}
                name={`language_data.${lang}.name`}
              />
            </Form.Item>
          </div>
        </div>
      </>
    );
}