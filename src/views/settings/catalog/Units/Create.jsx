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
import {
  getMeasurements,
  postV2Measurement,
  updateV2Measurement,
} from "services";
import Select from "components/Select";
import {
  units,
  accuracies,
  mappedReductions as reductions,
} from "constants/units";

export default function UnitsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      getMeasurements(params.id).then((res) => {
        setValues({
          unit: res?.data?.name,
          reduction: res?.data?.short_name,
          accuracy: res?.data?.accuracy,
        });
      });
    }
  }, []);

  const initialValues = useMemo(
    () => ({
      unit: null,
      reduction: null,
      accuracy: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      unit: defaultSchema,
      reduction: defaultSchema,
      accuracy: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      title: values.unit.value,
      short_name: values.reduction,
      accuracy: +values.accuracy.value,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateV2Measurement(params.id, data)
      : postV2Measurement(data);
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
      title: t(`unit`),
      link: true,
      route: `/home/catalog/units`,
    },
    {
      title: t("create"),
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

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <Card title={t("general.information")}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("unit")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="unit">
                  <Select
                    height={40}
                    placeholder={t("enter.unit")}
                    options={units}
                    // value={values.region}
                    onChange={(val) => {
                      setFieldValue("unit", val);
                      setFieldValue("reduction", reductions.get(val.label));
                    }}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("reduction")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="reduction">
                  <Input
                    size="large"
                    disabled
                    value={values.reduction}
                    onChange={handleChange}
                    name="reduction"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("accuracy")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="accuracy">
                  <Select
                    height={40}
                    placeholder={t("enter.accuracy")}
                    options={accuracies}
                    // value={values.region}
                    onChange={(val) => {
                      setFieldValue("accuracy", val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
