import { useMemo, useState, useEffect, useReducer } from "react";
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
import { getV2Property, postV2Property, updateV2Property } from "services";
import Select from "components/Select";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import MuiButton from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import genSelectOption from "helpers/genSelectOption";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "100%",
      border: "1px solid #ddd",
      color: "#0e73f6",
    },
    "& > *:hover": {
      border: "1px solid #0e73f6",
      background: "#fff",
    },
    icon: {
      color: "#0e73f6",
    },
  },
}));

var optionsReducer = function (state, { type, index, value }) {
  var [...items] = state;

  switch (type) {
    case "delete":
      items.splice(index, 1);
      return items;
    case "update":
      items[index] = { ...items[index], ...value };
      return items;
    case "add":
      items.push({ code: "", title: "" });
      return items;
    default:
      return state;
  }
};

var initialState = [{ code: "", title: "" }];

export default function AttributesCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const params = useParams();

  const [optionsState, dispatchOptions] = useReducer(
    optionsReducer,
    initialState,
  );

  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      getV2Property(params.id).then((res) => {
        setValues({
          title_ru: res.title.ru,
          description_ru: res.description.ru,
          options: res.options,
          order: res.order,
          type:
            res.type == "string"
              ? genSelectOption("text")
              : genSelectOption(res.type),
          value: res.value,
        });
      });
    }
  }, []);

  var optionsPreview = useMemo(() => {
    return optionsState.map((option) => ({
      label: option.title,
      value: option.code,
    }));
  }, [optionsState]);

  const initialValues = useMemo(
    () => ({
      title_ru: "",
      description_ru: "",
      options: [{ title: "", code: "" }],
      type: null,
      value: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      title_ru: defaultSchema,
      description_ru: defaultSchema,
      options: defaultSchema,
      type: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    var options = [];

    optionsState.forEach(({ code, title }) => {
      if (code && title) {
        options.push({
          code: +code,
          title: { en: title, ru: title, uz: title },
        });
      }
    });

    const data = {
      title: {
        ru: values.title_ru,
        uz: values.title_ru,
        en: values.title_ru,
      },
      description: {
        ru: values.description_ru,
        uz: values.description_ru,
        en: values.description_ru,
      },
      options,
      type: values.type.value == "text" ? "string" : values.type.value,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateV2Property(params.id, data)
      : postV2Property(data);
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
      title: t(`attributes`),
      link: true,
      route: `/home/catalog/attributes`,
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
              <div className="input-label">{t("name")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="title_ru">
                  <Input
                    size="large"
                    value={values.title_ru}
                    onChange={handleChange}
                    name="title_ru"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("attribute.type")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="type">
                  <Select
                    height={40}
                    id="type"
                    options={genSelectOption(["number", "text", "select"])}
                    value={values.type}
                    onChange={(val) => {
                      setFieldValue("type", val);
                      setFieldValue("value", "");
                    }}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("description.long")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="description_ru">
                  <Input
                    size="large"
                    value={values.description_ru}
                    onChange={handleChange}
                    name="description_ru"
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
          {values.type?.value && (
            <Card title={t("preview")}>
              {values.type?.value == "select" ? (
                <Form.Item formik={formik} name="value">
                  <Select
                    height={40}
                    id="value"
                    options={optionsPreview}
                    value={values.value}
                    onChange={(val) => {
                      setFieldValue("value", val);
                    }}
                  />
                </Form.Item>
              ) : (
                <Form.Item formik={formik} name="value">
                  <Input
                    type={values.type?.value == "text" ? "text" : "number"}
                    size="large"
                    value={values.value}
                    onChange={handleChange}
                    name="value"
                  />
                </Form.Item>
              )}
            </Card>
          )}
        </div>
        {values.type?.value == "select" && (
          <div className="mt-4 grid grid-cols-2 gap-5">
            <Card title={t("parameters")}>
              <div className="grid grid-cols-12 gap-4 items-center">
                {optionsState.map((option, index) => (
                  <>
                    <div className="col-span-5">
                      <div className="input-label">{t("name.option")}</div>
                      <div className="col-span-2">
                        <Form.Item formik={formik} name="title">
                          <Input
                            size="large"
                            value={optionsState[index].title}
                            onChange={(e) =>
                              dispatchOptions({
                                type: "update",
                                value: { title: e.target.value },
                                index,
                              })
                            }
                            name="title"
                          />
                        </Form.Item>
                      </div>
                    </div>

                    <div className="col-span-5">
                      <div className="input-label">{t("code_value")}</div>
                      <div className="col-span-2">
                        <Form.Item formik={formik} name="code">
                          <Input
                            size="large"
                            value={optionsState[index].code}
                            onChange={(e) =>
                              dispatchOptions({
                                type: "update",
                                value: { code: e.target.value },
                                index,
                              })
                            }
                            name="code"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="input-label"></div>
                      <span
                        className="cursor-pointer d-block border rounded-md p-2"
                        onClick={() =>
                          dispatchOptions({ type: "delete", index })
                        }
                      >
                        <DeleteIcon color="error" />
                      </span>
                    </div>
                  </>
                ))}
              </div>

              <div className={classes.root}>
                <MuiButton
                  variant="outlined"
                  startIcon={<AddIcon className={classes.icon} />}
                  onClick={() => dispatchOptions({ type: "add" })}
                >
                  {t("add")}
                </MuiButton>
              </div>
            </Card>
          </div>
        )}
      </div>
    </form>
  );
}
