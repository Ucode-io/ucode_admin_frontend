import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import Select from "components/Select/index";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


export default function ServiceForm ({formik, lang, categoriesList, branchesList, handleSelect}) {

    const {t} = useTranslation()
   
      const tags = [
        {
          label: 'tag1',
          values: 1
        },
        {
          label: 'tag2',
          values: 2
        },
        {
          label: 'tag3',
          values: 3
        },
      ]

    return (
      <>
        {/* <div className="col-span-9 mt-5"> */}
        <div className="w-full items-baseline mt-5">
          <div className="w-1/4 input-label">
            {/* <span style={{ color: "red" }}>*</span>{" "} */}
            <span> * {t("name")} </span>
          </div>
          <div className="w-full">
            <div>
              <Form.Item formik={formik} name={`name.${lang}`}>
                <Input
                  size="large"
                  id={`name.${lang}`}
                  value={formik.values.name[lang]}
                  onChange={formik.handleChange}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="w-full items-baseline">
          <div className="w-1/4 input-label">
            {/* <span style={{ color: "red" }}>*</span>{" "} */}
            <span>{t("description")}</span>
          </div>
          <div className="w-full">
            <div>
              <Form.Item formik={formik} name={`description.${lang}`}>
                <Input
                  size="large"
                  id={`description.${lang}`}
                  value={formik.values.description[lang]}
                  onChange={formik.handleChange}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5">
          <div className="w-full  items-baseline">
            <div className="input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <label>{t("categories")}</label>
            </div>
            <div className="w-full">
              <Form.Item formik={formik} name={`category`}>
                <Select
                  name={`category`}
                  height={40}
                  options={categoriesList}
                  value={categoriesList?.find(
                    (item) => item?.value === formik.values.category,
                  )}
                  onChange={(value) => {
                    formik.setFieldValue("category", value.value);
                    // handleSelect(value)

                  }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="w-full items-baseline">
            <div className="input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <label>{t("tag")}</label>
            </div>
            <div className="w-full">
              <Form.Item formik={formik} name="category">
                <Select
                  id="category"
                  height={40}
                  // options={tags}
                  //   value={formik.values.customer_type_id}
                  //   onChange={(val) => {
                  //     setFieldValue("customer_type_id", val.value);
                  //   }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="w-full items-baseline">
            <div className="w-full input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <label>{t("branch")}</label>
            </div>
            <div className="w-full">
              <Form.Item formik={formik} name="branch">
                <Select
                  id="branch"
                  height={40}
                  options={branchesList}
                  value={branchesList?.find(
                    (item) => item?.value === formik.values.branch,
                  )}
                  onChange={(value) => {
                    formik.setFieldValue("branch", value.value);
                  }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="w-full items-baseline">
            <div className="input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <label>{t("currency")}</label>
            </div>
            <div className="w-full">
              <Form.Item formik={formik} name="category">
                <Select
                  id="category"
                  height={40}
                  // options={customerTypeOption}
                  //   value={values.customer_type_id}
                  //   onChange={(val) => {
                  //     setFieldValue("customer_type_id", val.value);
                  //   }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="w-full items-baseline">
            <div className="input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <span>{t("income.price")}</span>
            </div>
            <div className="w-full">
              <div>
                <Form.Item formik={formik} name="price_arrival">
                  <Input
                    size="large"
                    id="price_arrival"
                    type="number"
                    min="1"
                    value={formik.values.price_arrival}
                    onChange={formik.handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-full items-baseline">
            <div className=" input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <span>{t("selling.price")}</span>
            </div>
            <div className="w-full">
              <div>
                <Form.Item formik={formik} name="price_sale">
                  <Input
                    size="large"
                    type="number"
                    id="price_sale"
                    value={formik.values.price_sale}
                    onChange={formik.handleChange}
                    min="1"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-full items-baseline">
            <div className="input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <span>{t("doctors.percent")}</span>
            </div>
            <div className="w-full">
              <div>
                <Form.Item formik={formik} name="percent_doctor">
                  <Input
                    size="large"
                    id="percent_doctor"
                    value={formik.values.percent_doctor}
                    onChange={formik.handleChange}
                    type="number"
                    min="1"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-full items-baseline">
            <div className="input-label">
              {/* <span style={{ color: "red" }}>*</span>{" "} */}
              <span>{t("consumables")}</span>
            </div>
            <div className="w-full">
              <div>
                <Form.Item formik={formik} name="expendature">
                  <Input
                    size="large"
                    type="number"
                    id="expendature"
                    value={formik.values.expendature}
                    onChange={formik.handleChange}
                    min="1"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </>
    );
}