import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input, Select } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getBranchesCount } from "../../../../services";
import { getOnePayme, postPayme, updatePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";

export default function PaymeCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    getItems();
    fetchData();
  }, []);
  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          login: res.login,
          key: res.key,
          branch_id: res.branch_id,
          merchant_id: res.merchant_id,
        });
      });
    }
  }, []);

  const fetchData = () => {
    if (params.id) {
      setLoader(true);
      getOnePayme(params.id)
        .then((res) => {
          formik.setValues({
            login: res.login,
            key: res.key,
            branch_id: res.branch_id,
            merchant_id: res.merchant_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  };

  const getItems = (page) => {
    getBranchesCount({ limit: 10, page }).then((res) => {
      setItems(res.branches);
    });
  };
  const branches = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));

  const initialValues = useMemo(
    () => ({
      login: "Paycom",
      key: null,
      branch_id: null,
      merchant_id: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch_id: defaultSchema,
      key: defaultSchema,
      login: defaultSchema,
      merchant_id: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updatePayme(data, params.id)
      : postPayme(data);
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
      title: t(`aggregator`),
      link: true,
      route: `/home/settings/aggregator`,
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

  console.log("values", values);

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <Card title={t("general.information")}>
            <div className="grid grid-cols-4 gap-5 items-baseline">
              <div className="col-span-2">
                <Form.Item formik={formik} name="branch_id">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span> {t("name.branch")}
                  </div>
                  <Select
                    height={40}
                    name="branch_id"
                    options={branches}
                    value={values.branch_id}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>

              <div className="col-span-2">
                <Form.Item formik={formik} name="key">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span> {t("key")}
                  </div>
                  <Input
                    size="large"
                    value={values.key}
                    onChange={handleChange}
                    name="key"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-5 items-baseline">
              <div className="col-span-2">
                <Form.Item formik={formik} name="login">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span> {t("login")}
                  </div>
                  <Input
                    size="large"
                    value={values.login}
                    onChange={handleChange}
                    name="login"
                    disabled
                  />
                </Form.Item>
              </div>

              <div className="col-span-2">
                <Form.Item formik={formik} name="merchant_id">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span> {t("id.merchant")}
                  </div>
                  <Input
                    size="large"
                    value={values.merchant_id}
                    onChange={handleChange}
                    name="merchant_id"
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
