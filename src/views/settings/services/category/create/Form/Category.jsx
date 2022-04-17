import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import Gallery from "components/Gallery";
import { useTranslation } from "react-i18next";


export default function CategoryForm({formik, lang}) {

const {t} = useTranslation()

    return (
      <>
       <div className="grid grid-cols-4 gap-5 items-baseline mt-4">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`category.photo`}>
              <div className="input-label"> {t("picture")}</div>
              <Gallery 
                gallery={formik.values.category.photo ? [formik.values.category.photo] : []}
                setGallery={(elm) => formik.setFieldValue("category.photo", elm[0])}
                multiple={false}
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-baseline">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`category.name.${lang}`}>
              <div className="input-label"> <span>*</span>  {t("name")}</div>
              <Input
                size="large"
                value={formik?.values?.category?.name[lang]}
                onChange={formik.handleChange}
                name={`category.name.${lang}`}
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-baseline">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`category.name_url`}>
              <div className="input-label">{t("name")} (URL)</div>
              <Input
                size="large"
                  value={formik?.values.category.name_url}
                  onChange={formik.handleChange}
                 name={`category.name_url`}
              />
            </Form.Item>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 items-baseline">
          <div className="col-span-4">
            <Form.Item formik={formik} name={`category.description.${lang}`}>
              <div className="input-label">{t("description")}</div>
              <Input
                size="large"
                  value={formik?.values.category.description[lang]}
                  onChange={formik.handleChange}
                  name={`category.description.${lang}`}
              />
            </Form.Item>
          </div>
        </div>
      </>
    );
}