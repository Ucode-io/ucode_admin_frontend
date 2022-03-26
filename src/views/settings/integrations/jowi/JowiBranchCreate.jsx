import { useMemo, useState, useEffect, useCallback } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getBranches, putBranches } from "../../../../services";
import { getOnePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import Async from "components/Select/Async";
import Input from "components/Input";

export default function JowiAddProduct() {
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

  const fetchData = () => {
    if (params.id) {
      setLoader(true);
      getOnePayme(params.id)
        .then((res) => {
          formik.setValues({
            login: res.login,
            key: res.key,
            branch_id: res.branch_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  };

  const getItems = (page) => {
    getBranches({ limit: 10, page }).then((res) => {
      setItems(res.branches);
    });
  };
  const branches = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));

  const loadBranch = useCallback(
    (input, cb) => {
      getBranches({ limit: 10, search: input })
        .then((res) => {
          var branches = res.branches?.map((elm) => ({
            label: elm?.name,
            value: elm?.id,
            ...elm,
          }));
          branches = branches.filter((elm) => elm.value !== params.id);
          cb(branches);
        })
        .catch((err) => console.log(err));
    },
    [params.id],
  );

  const initialValues = useMemo(
    () => ({
      id: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      branch: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    delete values.branch.label;
    // delete values.branch.value;
    delete values.branch.id;
    delete values.branch.jowi_id;
    const data = {
      ...values.branch,
      value: undefined,
      id: values.branch.value,
      jowi_id: values.jowi_id,
    };

    setSaveLoading(true);
    putBranches(data.id, data)
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

  console.log("values", values);
  console.log("formik", formik);

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

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="grid grid-cols-1 gap-5">
          <Card title={t("general.information")}>
            <div className="grid grid-cols-4 gap-5 items-baseline">
              <div className="col-span-2">
                <Form.Item formik={formik} name="branch">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span>{" "}
                    {t("Пожалуйста, выберите филиал")}
                  </div>
                  <Async
                    isSearchable
                    isClearable
                    cacheOptions
                    name="branch"
                    options={branches}
                    loadOptions={loadBranch}
                    defaultOptions={true}
                    value={values.branch}
                    onChange={(val) => {
                      formik.setFieldValue("branch", val);
                    }}
                  />
                </Form.Item>
              </div>

              <div className="col-span-2">
                <Form.Item formik={formik} name="jowi_id">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span>{" "}
                    {t("Пожалуйста, добавьте соответствующий JOWI филиал")}
                  </div>
                  <Input
                    size="large"
                    style={{ height: "40px" }}
                    value={values.jowi_id}
                    onChange={handleChange}
                    name="jowi_id"
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
