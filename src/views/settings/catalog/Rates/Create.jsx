import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getRate, postRate, updateRate } from "services";
import CustomSkeleton from "components/Skeleton";
import genArticul from "helpers/genArticul";

export default function RatesCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const initialValues = useMemo(
    () => ({
      title: "",
      code: "",
      rate_amount: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    const rateSchema = yup
      .number()
      .min(0, t("range1to5"))
      .max(5, t("range1to5"))
      .required(t("required.field.error"));
    return yup.object().shape({
      title: defaultSchema,
      code: defaultSchema,
      rate_amount: rateSchema,
    });
  }, [t]);

  const genCode = (e) => {
    var output = genArticul(3);
    setFieldValue("code", output);
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateRate(params.id, data)
      : postRate(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  const routes = [
    {
      title: t(`rates`),
      link: true,
      route: `/home/catalog/rates`,
    },
    {
      title: params.id ? t("edit") : t("create"),
    },
  ];

  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
  ];

  useEffect(() => {
    if (params.id) {
      getRate(params.id)
        .then((res) => {
          setValues({
            title: res.title,
            code: res.code,
            rate_amount: res.rate_amount,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params.id, setValues]);

  return !isLoading ? (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <Card title={t("general.information")}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("name")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="title">
                  <Input
                    size="large"
                    value={values.title}
                    onChange={handleChange}
                    name="title"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("vendor_code")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="code">
                  <Input
                    size="large"
                    id="code"
                    value={values.code}
                    onChange={handleChange}
                    suffix={
                      <button type="button" onClick={genCode}>
                        {t("generate")}
                      </button>
                    }
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("evaluation")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="rate_amount">
                  <Input
                    size="large"
                    id="rate_amount"
                    value={values.rate_amount}
                    onChange={handleChange}
                    type="number"
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  ) : (
    <CustomSkeleton />
  );
}
