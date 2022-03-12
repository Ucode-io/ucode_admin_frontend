import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Select from "components/Select";
import TextArea from "components/Textarea";
import { divisibility, currencies } from "../api";
import genSelectOption from "helpers/genSelectOption";
import { useTranslation } from "react-i18next";

export default function En({
  formik,
  values,
  handleChange,
  categories,
  setFieldValue,
  brands,
  tags,
  units,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-12 gap-8 mt-4">
      <div className="col-span-12">
        <div className="input-label">
          <span>{t("name")}</span>
        </div>
        <div className="">
          <div>
            <Form.Item formik={formik} name="title_en">
              <Input
                size="large"
                id="title_en"
                value={values.title_en}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>

        <div className="input-label">
          <span>{t("vendor_code")}</span>
        </div>
        <div className="">
          <div>
            <Form.Item formik={formik} name="order_no">
              <Input
                size="large"
                id="order_no"
                value={values.order_no}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>

        <div className="input-label">
          <span>{t("description")}</span>
        </div>
        <div className="">
          <div>
            <Form.Item formik={formik} name="description_en">
              <TextArea
                id="description_en"
                {...formik.getFieldProps("description_en")}
              />
            </Form.Item>
          </div>
        </div>

        {/* Selects */}
        <div className="col-span-12">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="input-label">
                <span>{t("categories")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="categories">
                    <Select
                      isMulti
                      height={40}
                      id="categories"
                      options={categories}
                      value={values.categories}
                      onChange={(val) => {
                        setFieldValue("categories", val);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <div className="input-label">
                <span>{t("brand")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="brand">
                    <Select
                      height={40}
                      id="brand"
                      options={brands}
                      value={values.brand}
                      onChange={(val) => {
                        setFieldValue("brand", val);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <div className="input-label">
                <span>{t("divisible.indivisible")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="is_divisible">
                    <Select
                      height={40}
                      id="is_divisible"
                      options={genSelectOption(divisibility)}
                      value={values.is_divisible}
                      onChange={(val) => {
                        var bool = val.value == "divisible" ? true : false;
                        setFieldValue("is_divisible", {
                          label: val.label,
                          value: bool,
                        });
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <div className="input-label">
                <span>{t("tag")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="tags">
                    <Select
                      isMulti
                      height={40}
                      id="tags"
                      options={tags}
                      value={values.tags}
                      onChange={(val) => {
                        setFieldValue("tags", val);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div>
              <div className="input-label">
                <span>{t("unit")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="unit">
                    <Select
                      height={40}
                      id="unit"
                      options={units.map((unit) => ({
                        label: unit.title,
                        value: unit.id,
                      }))}
                      value={values.unit}
                      onChange={(val) => {
                        var unit = units.find((el) => el.id == val.value);
                        setFieldValue("unit", val);
                        setFieldValue("unit_short", {
                          label: unit.short_name,
                          value: "",
                        });
                        setFieldValue("accuracy", unit.accuracy);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <span className="input-label">{t("currency")}</span>
              <div>
                <Form.Item formik={formik} name="currency">
                  <Select
                    height={40}
                    id="currency"
                    options={genSelectOption(currencies)}
                    value={values.currency}
                    onChange={(val) => {
                      setFieldValue("currency", val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>

            <div>
              <div className="input-label">
                <span>{t("income.price")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="in_price">
                    <Input
                      type="number"
                      size="large"
                      id="in_price"
                      value={values.in_price}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <div className="input-label">
                <span>{t("sales.price")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="out_price">
                    <Input
                      type="number"
                      size="large"
                      id="out_price"
                      value={values.out_price}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
