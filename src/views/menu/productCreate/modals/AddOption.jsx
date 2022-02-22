import React, { useEffect, useState } from "react";
import Form from "components/Form/Index";
import Modal from "components/Modal";
import Button from "components/Button";
import AddIcon from "@material-ui/icons/Add";
import * as yup from "yup";
import EditIcon from "@material-ui/icons/Edit";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import RusFlag from "assets/icons/Ellipse 8.png";
import EngFlag from "assets/icons/Ellipse 9.png";
import FlagUz from "assets/icons/Ellipse 7.png";
import Filters from "components/Filters";
import CloseIcon from "@material-ui/icons/Close";

export default function AddOptionModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  ...props
}) {
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState("ru");

  const tabLabel = (text) => {
    return <span className="px-1">{text}</span>;
  };

  const onFieldChange = (name, e) => {
    setFieldValue(`${name}.${selectedTab}`, e.target.value);
  };

  useEffect(() => {
    if (initialValues) {
      formik.setValues(initialValues);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues: {
      name: { ru: "", uz: "", en: "" },
      price: "",
    },
    validationSchema: yup.object().shape({
      price: yup.mixed().required(t("required.field.error")),
      name: yup.object({
        uz: yup.mixed().required(t("required.field.error")),
        ru: yup.mixed().required(t("required.field.error")),
        en: yup.mixed().required(t("required.field.error")),
      }),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      handleClose();
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm();
  };
  const { values, handleChange, setFieldValue } = formik;

  // const { values, handleChange } = formik

  return (
    <Modal
      title={null}
      footer={null}
      open={open}
      onClose={handleClose}
      {...props}
      style={{ padding: "0" }}
      header={
        <div className="flex justify-between items-center px-4 py-3 text-md font-medium">
          Добавить опцию
          <span className="cursor-pointer" onClick={handleClose}>
            <CloseIcon />
          </span>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <Filters className="mb-4" style={{ backgroundColor: "white" }}>
          <StyledTabs
            value={selectedTab}
            onChange={(_, value) => {
              setSelectedTab(value);
              console.log(value);
            }}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab
              label={
                <div className="flex items-center">
                  <img className="mr-2" src={RusFlag} width={16} alt="" />
                  {tabLabel(t("russian"))}
                </div>
              }
              value="ru"
            />
            <StyledTab
              label={
                <div className="flex items-center">
                  <img className="mr-2" src={EngFlag} width={16} alt="" />
                  {tabLabel(t("english"))}
                </div>
              }
              value="en"
            />
            <StyledTab
              label={
                <div className="flex items-center">
                  <img className="mr-2" src={FlagUz} width={16} alt="" />
                  {tabLabel(t("uzbek"))}
                </div>
              }
              value="uz"
            />
          </StyledTabs>
        </Filters>
        <div className="px-4 pt-0">
          <div>
            {/*<Form.Item formik={formik} name="name.uz" label={t("name.in.uz")}>*/}
            {/*  <Input id="name.uz" value={values.name?.uz} onChange={handleChange} />*/}
            {/*</Form.Item>*/}
            <Form.Item
              formik={formik}
              name={`name.${selectedTab}`}
              label={t(`name.in.${selectedTab}`)}
            >
              <Input
                size="large"
                value={values.name?.[selectedTab]}
                onChange={(e) => onFieldChange("name", e)}
              />
            </Form.Item>
          </div>
          {/*<div>*/}
          {/*  <Form.Item formik={formik} name="name.ru" label={t("name.in.ru")}>*/}
          {/*    <Input id="name.ru" value={values.name?.ru} onChange={handleChange} />*/}
          {/*  </Form.Item>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <Form.Item formik={formik} name="name.en" label={t("name.in.en")}>*/}
          {/*    <Input id="name.en" value={values.name?.en} onChange={handleChange} />*/}
          {/*  </Form.Item>*/}
          {/*</div>*/}
          <div>
            <Form.Item formik={formik} name="price" label={t("price")}>
              <Input
                size="large"
                id="price"
                value={values.price}
                onChange={handleChange}
                type="number"
              />
            </Form.Item>
          </div>
        </div>
      </form>
    </Modal>
  );
}
