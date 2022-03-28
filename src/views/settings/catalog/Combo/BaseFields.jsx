import React from "react";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Select from "components/Select";
import { currencies } from "./api";
import genSelectOption from "helpers/genSelectOption";
import { useTranslation } from "react-i18next";
import genArticul from "helpers/genArticul";

export default function BaseFields({ formik, tags, lang }) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;

  const genCode = (e) => {
    var output = genArticul(3);
    setFieldValue("code", output);
  };

  return (
    <div className="grid grid-cols-12 gap-8 mt-4">
      <div className="col-span-12">
        {React.cloneElement(lang, {
          formik: formik,
        })}

        <div className="input-label">
          <span>{t("vendor_code")}</span>
        </div>
        <div className="">
          <div>
            <Form.Item formik={formik} name="code">
              <Input
                size="large"
                id="code"
                value={values.code}
                onChange={handleChange}
                suffix={
                  <button type="button" onClick={genCode}>
                    {t("generate")}
                  </button>
                }
              />
            </Form.Item>
          </div>
        </div>

        {/* Selects */}
        <div className="col-span-12">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="input-label">
                <span>{t("tags")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="tag_ids">
                    <Select
                      isMulti
                      height={40}
                      id="tag_ids"
                      options={tags}
                      value={values.tag_ids}
                      onChange={(val) => {
                        setFieldValue("tag_ids", val);
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
