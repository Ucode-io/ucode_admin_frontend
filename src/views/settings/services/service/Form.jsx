import { Input, Select } from "alisa-ui";
import Form from "components/Form/Index";
import Gallery from "components/Gallery";
import { useTranslation } from "react-i18next";

export default function ServiceForm ({lang, formik}) {


    const {t} = useTranslation()

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
              <Form.Item formik={formik} name="name">
                <Input
                  size="large"
                  id="name"
                  // value={values.first_name}
                  // onChange={handleChange}
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
              <Form.Item formik={formik} name="price">
                <Input
                  size="large"
                  id="price"
                  // value={values.last_name}
                  // onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5">

        <div className="w-full  items-baseline">
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
                //   value={values.customer_type_id}
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
            <label>{t("tag")}</label>
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
          <div className="w-full input-label">
            {/* <span style={{ color: "red" }}>*</span>{" "} */}
            <label>{t("branch")}</label>
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
          <div className="w-full input-label">
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
          <div className="w-1/4 input-label">
            {/* <span style={{ color: "red" }}>*</span>{" "} */}
            <span>{t("income.price")}</span>
          </div>
          <div className="w-full">
            <div>
              <Form.Item formik={formik} name="price">
                <Input
                  size="large"
                  id="price"
                  // value={values.last_name}
                  // onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
        </div>


        <div className="w-full items-baseline">
          <div className="w-1/4 input-label">
            {/* <span style={{ color: "red" }}>*</span>{" "} */}
            <span>{t("selling.price")}</span>
          </div>
          <div className="w-full">
            <div>
              <Form.Item formik={formik} name="price">
                <Input
                  size="large"
                  id="price"
                  // value={values.last_name}
                  // onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="w-full items-baseline">
          <div className="w-1/4 input-label">
            {/* <span style={{ color: "red" }}>*</span>{" "} */}
            <span>{t("doctors.percent")}</span>
          </div>
          <div className="w-full">
            <div>
              <Form.Item formik={formik} name="price">
                <Input
                  size="large"
                  id="price"
                  // value={values.last_name}
                  // onChange={handleChange}
                />
              </Form.Item>
            </div>
          </div>
        </div>


        <div className="w-full items-baseline">
          <div className="w-1/4 input-label">
            {/* <span style={{ color: "red" }}>*</span>{" "} */}
            <span>{t("consumables")}</span>
          </div>
          <div className="w-full">
            <div>
              <Form.Item formik={formik} name="price">
                <Input
                  size="large"
                  id="price"
                  // value={values.last_name}
                  // onChange={handleChange}
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