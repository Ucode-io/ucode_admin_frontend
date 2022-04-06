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
import Gallery from "components/Gallery";

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
      title: t(`services`),
      link: true,
      route: `/home/settings/services`,
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

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="w-2/3 grid gap-5">
          <Card title={t("general.information")}>
          <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <Form.Item formik={formik} name="image">
              <div className="w-full h-full flex mt-6 items-center flex-col">
                <Gallery
                  rounded
                  width={120}
                  height={120}
                  gallery={values.image ? [values.image] : []}
                  setGallery={(elm) => setFieldValue("image", elm[0])}
                  multiple={false}
                />
              </div>
            </Form.Item>
          </div>
          <div className="col-span-9">
            <div className="w-full items-baseline">
              <div className="w-1/4 input-label">
                {/* <span style={{ color: "red" }}>*</span>{" "} */}
                <span>{t("name")}</span>
              </div>
              <div className="w-full">
                <div>
                  <Form.Item formik={formik} name="name">
                    <Input
                      size="large"
                      id="name"
                      value={values.first_name}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="w-full items-baseline">
              <div className="w-1/4 input-label">
                {/* <span style={{ color: "red" }}>*</span>{" "} */}
                <span>{t("price")}</span>
              </div>
              <div className="w-full">
                <div>
                  <Form.Item formik={formik} name="price">
                    <Input
                      size="large"
                      id="price"
                      value={values.last_name}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="w-full items-baseline">
              <div className="w-1/4 input-label">
                {/* <span style={{ color: "red" }}>*</span>{" "} */}
                <label>{t("categories")}</label>
              </div>
              <div className="w-full">
                <Form.Item formik={formik} name="category">
                  <Select
                    id="category"
                    height={40}
                    // options={customerTypeOption}
                    value={values.customer_type_id}
                    onChange={(val) => {
                      setFieldValue("customer_type_id", val.value);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
