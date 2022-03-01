import { useState, useMemo, useEffect } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import Gallery from "components/Gallery";
import Select from "components/Select";
import { useFormik } from "formik";
import { getOneBranchUser, postBranchUser, updateBranchUser } from "services";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { showAlert } from "redux/actions/alertActions";
import FullScreenLoader from "components/FullScreenLoader";
import * as yup from "yup";

export default function Cashiers() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, cashier_id } = useParams();

  const [buttonLoader, setButtonLoader] = useState(false);
  const [loader, setLoader] = useState(true);

  const fetchData = () => {
    setLoader(true);
    if (!cashier_id) return setLoader(false);
    getOneBranchUser(cashier_id, {})
      .then((res) => {
        console.log(res);
        formik.setValues({
          name: res.name,
          phone: res.phone.slice(4),
          logo: res.logo,
          login: res.login,
          branch: res.branch,
          status: res.status,
        });
      })
      .finally(() => setLoader(false));
  };

  const saveChanges = (data) => {
    setButtonLoader(true);
    if (cashier_id) {
      updateBranchUser(cashier_id, data)
        .then(() => history.push("/home/personal/clients"))
        .catch((err) =>
          console.log(
            dispatch(showAlert(t(err.data.Error?.Message ?? err.data.Error))),
          ),
        )
        .finally(() => setButtonLoader(false));
    } else {
      postBranchUser(data)
        .then(() => history.push("/home/personal/clients"))
        .catch((err) =>
          console.log(
            dispatch(showAlert(t(err.data.Error?.Message ?? err.data.Error))),
          ),
        )
        .finally(() => setButtonLoader(false));
    }
  };

  const onSubmit = (values) => {
    const data = {
      name: values.first_name + " " + values.last_name ?? "",
      phone: "+998" + values.phone,
      logo: values.logo
        ? process.env.REACT_APP_MINIO_URL + "/" + values.logo
        : undefined,
      status: values.status.value,
      ...values,
    };
    saveChanges(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = useMemo(
    () => ({
      name: null,
      phone: null,
      logo: "",
      login: null,
      branch: null,
      status: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));

    return yup.object().shape({
      name: defaultSchema,
      phone: yup
        .number()
        .typeError(t("required.field.error"))
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point")
        .required(t("required.field.error")),
    });
  }, []);

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, handleSubmit } = formik;

  const routes = [
    {
      title: <div>{t("cashiers")}</div>,
      link: true,
      route: `/home/settings/company/branches/${id}`,
    },
    {
      title: cashier_id ? formik?.values.first_name : t("create"),
    },
  ];

  return (
    <>
      {loader ? (
        <FullScreenLoader />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <Header
              startAdornment={[<Breadcrumb routes={routes} />]}
              endAdornment={[
                <Button
                  icon={CancelIcon}
                  size="large"
                  shape="outlined"
                  color="red"
                  iconClassName="red"
                  borderColor="bordercolor"
                  onClick={() => history.goBack()}
                >
                  {t("cancel")}
                </Button>,
                <Button
                  icon={SaveIcon}
                  size="large"
                  type="submit"
                  loading={buttonLoader}
                >
                  {t(cashier_id ? "save" : "create")}
                </Button>,
              ]}
            />
            <div className="grid grid-cols-2">
              <Card className="m-4 mr-2" title={t("general.information")}>
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-3">
                    <Form.Item formik={formik} name="logo">
                      <div className="w-full h-full flex mt-6 items-center flex-col">
                        <Gallery
                          rounded
                          width={120}
                          height={120}
                          gallery={values.logo ? [values.logo] : []}
                          setGallery={(elm) => setFieldValue("logo", elm[0])}
                          multiple={false}
                        />
                        {
                          <span className="mt-2 text-primary text-base">
                            {values.logo ? t("change.photo") : t("add.photo")}
                          </span>
                        }
                      </div>
                    </Form.Item>
                  </div>

                  <div className="col-span-9">
                    <div className="w-full flex items-baseline">
                      <div className="w-1/4 input-label">
                        <span>{t("full_name")}</span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="name">
                            <Input
                              size="large"
                              id="name"
                              value={values.name}
                              onChange={handleChange}
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex items-baseline">
                      <div className="w-1/4 input-label">
                        <span>{t("phone")}</span>
                      </div>
                      <div className="w-3/4">
                        <div>
                          <Form.Item formik={formik} name="phone">
                            <Input
                              size="large"
                              prefix="+998"
                              id="phone"
                              value={values.phone}
                              onChange={handleChange}
                              type="number"
                              min="1"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full items-baseline">
                      <div className="w-1/4 input-label">
                        <label>{t("login")}</label>
                      </div>
                      <div className="w-3/4">
                        <Form.Item formik={formik} name="login">
                          <Input
                            size="large"
                            id="login"
                            value={values.login}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="flex w-full items-baseline">
                      <div className="w-1/4 input-label">
                        <label>{t("branch")}</label>
                      </div>
                      <div className="w-3/4">
                        <Form.Item formik={formik} name="branch">
                          <Input
                            size="large"
                            id="branch"
                            value={values.branch}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="flex w-full items-baseline">
                      <div className="w-1/4 input-label">
                        <label>{t("status")}</label>
                      </div>
                      <div className="w-3/4">
                        <Form.Item formik={formik} name="status">
                          <Select
                            height={40}
                            options={[
                              { label: t("active"), value: "active" },
                              { label: t("inactive"), value: "inactive" },
                            ]}
                            value={values.status}
                            onChange={(val) => {
                              setFieldValue("status", val);
                            }}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </form>
        </>
      )}
    </>
  );
}
