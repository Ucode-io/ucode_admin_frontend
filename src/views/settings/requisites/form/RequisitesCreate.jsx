import { Input } from 'alisa-ui'
import Card from 'components/Card'
import Form from 'components/Form/Index'
import { useFormik } from 'formik'
import { isNumber } from 'helpers/inputHelpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from "yup";
import Select from 'components/Select'


export default function RequisitesCreate() {


    // ======== const variables ====== //
    const { t } = useTranslation()
 
    // ====== < formik section > ===== //
    const initialValues = useMemo(
      () => ({
        name: null,
        base_price: null,
        type: null,
        base_distance: null,
        price_per_km: null,
      }),
      [],
    );

    const onSubmit = (values) => {
      console.log("submit submit");
    };

    const validationSchema = useMemo(() => {
      const defaultSchema = yup.mixed().required(t("required.field.error"));
      return yup.object().shape({
        base_price: defaultSchema,
        type: defaultSchema,
      });
    }, []);

    const formik = useFormik({
      initialValues,
      onSubmit,
      validationSchema,
    });

      const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

   // ====== < formik section /> ===== //


    return (
      <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <Card title={t("requisites")} style={{ height: "fit-content" }}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("naming")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="naming">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="naming"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("code")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="code">
                  <Input className="order-1" size="large" />
                </Form.Item>
              </div>
              <div className="input-label">{t("addresses")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="addresses">
                  <Select
                    id="addresses"
                    isMulti
                    height={40}
                    name="addresses"
                    value={values.region_ids}
                    onChange={(value) => setFieldValue("region_ids", value)}
                    //   options={regions}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("contacts")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="contacts">
                  <Select
                    id="contacts"
                    isMulti
                    height={40}
                    name="contacts"
                    value={values.region_ids}
                    onChange={(value) => setFieldValue("region_ids", value)}
                    //   options={regions}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("inn")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="inn">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="inn"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("checking.account")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="checking_account">
                  <Select
                    id="checking_account"
                    isMulti
                    height={40}
                    name="checking_account"
                    value={values.region_ids}
                    onChange={(value) => setFieldValue("checking_account", value)}
                    //   options={regions}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("Директор")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="Директор">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="Директор"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("mfo")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="mfo">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="mfo"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("chief.accountant")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="naming">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="naming"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("oked")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="naming">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="naming"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("code.okpo")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="naming">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="naming"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("code.nds")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="naming">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="naming"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("region")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="naming">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="naming"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("commentary")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="naming">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="naming"
                  />
                </Form.Item>
              </div>
            </div>
          </Card>

          <Card
            title={t("accounts")}
            style={{ height: "fit-content" }}
          >
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("name")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="name">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("operation.type")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="name">
                  <Input
                    className="order-1"
                    size="large"
                    style={{ flex: "1 1 80%" }}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("checking.account")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="account">
                  <Select
                    id="checking_account"
                    isMulti
                    height={40}
                    name="checking_account"
                    value={values.region_ids}
                    onChange={(value) => setFieldValue("checking_account", value)}
                    //   options={regions}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
}