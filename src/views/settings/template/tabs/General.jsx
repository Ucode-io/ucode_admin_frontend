import { Input } from "alisa-ui";
import Form from 'components/Form/Index'
import Card from 'components/Card'
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { getAggregator, postAggregator, updateAggregator } from "services";
import * as yup from "yup";
import { Add } from "@material-ui/icons";


export default function General() {

    const { t } = useTranslation();
    const history = useHistory();
    const params = useParams();
    const [saveLoading, setSaveLoading] = useState(false);

    const initialValues = useMemo(
        () => ({
          name: null,
          phone_number: null,
        }),
        [],
      );


      const onSubmit = (values) => {
        const data = {
          ...values,
        };
    
        setSaveLoading(true);
        const selectedAction = params.id
          ? updateAggregator(params.id, data)
          : postAggregator(data);
        selectedAction
          .then((res) => {
            history.goBack();
          })
          .finally(() => {
            setSaveLoading(false);
          });
      };

      const validationSchema = useMemo(() => {
        const defaultSchema = yup.mixed().required(t("required.field.error"));
        return yup.object().shape({
          name: defaultSchema,
          phone_number: defaultSchema,
        });
      }, []);



    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
      });
    
      const { values, handleChange, setFieldValue, setValues, handleSubmit } =
        formik;



        useEffect(() => {
            if (params.id) {
              getAggregator(params.id).then((res) => {
                setValues({
                  name: res.name,
                  phone_number: res.phone_number,
                });
              });
            }
          }, []);


    return(
    <div className="m-4">
    <div className="grid grid-cols-1 gap-5">
      <Card title={t("general.information")}>
        <div className="w-2/3 grid grid-cols-3 items-baseline">
          <div className="input-label">{t("template.name")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="template.name">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="template.name"
              />
            </Form.Item>
          </div>
        </div>
      </Card>

      <Card title={t("complaints")}>
        <div className="w-2/3 grid grid-cols-3 items-baseline">
          <div className="input-label">{t("complaints")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="complaints">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="complaints"
              />
            </Form.Item>
          </div>
        </div>
      </Card>

      <Card title={t("anamnesis")}>
        <div className="w-2/3 grid grid-cols-3 items-baseline">
          <div className="input-label">{t("medical.history")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="medical.history">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="medical.history"
              />
            </Form.Item>
          </div>

          <div className="input-label">{t("anamnesis.life")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="anamnesis.life">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="anamnesis.life"
              />
            </Form.Item>
          </div>
        </div>
      </Card>

      <Card title={t("objective.status")}>
        <div className="w-2/3 grid grid-cols-3 items-baseline">
          <div
            className="mt-4 cursor-pointer border border-dashed border-blue-800 text-secondary text-sm  p-2 rounded-md flex justify-center items-center gap-2.5"
            // onClick={() => setModal(true)}
            // ref={productRef}
          >
            <Add />
            <div className="text-black-1">Добавить продукт</div>
          </div>
        </div>
      </Card>

      <Card title={t("local.status")}>
        <div className="w-2/3 grid grid-cols-3 items-baseline">
          <div
            className="mt-4 cursor-pointer border border-dashed border-blue-800 text-secondary text-sm  p-2 rounded-md flex justify-center items-center gap-2.5"
            // onClick={() => setModal(true)}
            // ref={productRef}
          >
            <Add />
            <div className="text-black-1">Добавить продукт</div>
          </div>
        </div>
      </Card>

      <Card title={t("diagnosis")}>
        <div className="w-2/3 grid grid-cols-3 items-baseline">
          <div className="input-label">{t("MKB")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="MKB">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="MKB"
              />
            </Form.Item>
          </div>

          <div className="input-label">{t("clinical.diagnosis")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="clinical.diagnosis">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="clinical.diagnosis"
              />
            </Form.Item>
          </div>
        </div>
      </Card>

      <Card title={t("survey.plan")}>
        <div className="w-2/3 grid grid-cols-3 items-baseline">
          <div className="input-label">{t("diagnostics")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="diagnostics">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="diagnostics"
              />
            </Form.Item>
          </div>

          <div className="input-label">{t("consultation")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="consultation">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="consultation"
              />
            </Form.Item>
          </div>

          <div className="input-label">{t("analysis")}</div>
          <div className="col-span-2">
            <Form.Item formik={formik} name="analysis">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="analysis"
              />
            </Form.Item>
          </div>
        </div>
      </Card>
    </div>
  </div> 
    )
}