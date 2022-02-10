import Card from "../../../components/Card";
import Form from "../../../components/Form/Index";
import { Input } from "alisa-ui";
import React from "react";
import { useTranslation } from "react-i18next";
import numberToPrice from "../../../helpers/numberToPrice";
import ClientCreateCard from "../../../components/ClientCard/Create";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import FunctionsIcon from "@material-ui/icons/Functions";
import Gallery from "../../../components/Gallery";
import Select from "../../../components/Select";

export default function Client({ formik, customerTypeOption }) {
  const { t } = useTranslation();
  const { values, handleChange } = formik;

  return (
    <div>
      <ClientCreateCard
        cards={[
          {
            icon: <FunctionsIcon fontSize="large" />,
            count: numberToPrice(420000, "сум"),
            title: t("all.sum.order"),
          },
          {
            icon: <AttachMoneyOutlinedIcon fontSize="large" />,
            count: numberToPrice(27500, "сум"),
            title: t("clients"),
          },
          {
            icon: <ShoppingCartIcon fontSize="large" />,
            count: 16,
            title: t("count.orders"),
          },
          {
            icon: <MoneyOffIcon fontSize="large" />,
            count: numberToPrice(23500, "сум"),
            title: t("LTV"),
          },
        ]}
      />

      <Card className="m-4" title={t("client")}>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3 ">
            <div className="w-full h-full flex mt-6 items-center flex-col">
              <Gallery
                rounded
                width={120}
                height={120}
                gallery={values.logo ? [values.logo] : []}
                setGallery={(elm) => console.log(elm)}
                multiple={false}
              />
              <span className="mt-2 text-primary text-base cursor-pointer hover:underline">
                Изменить фото
              </span>
            </div>
          </div>
          <div className="col-span-9">
            <div className="w-full flex items-baseline">
              <div className="w-1/4 input-label">
                <span>{t("first.name")}</span>
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
                <span>{t("last.name")}</span>
              </div>
              <div className="w-3/4">
                <div>
                  <Form.Item formik={formik}>
                    <Input
                      size="large"
                      // id="lastname"
                      // value={values.lastname}
                      // onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="w-full flex items-baseline">
              <div className="w-1/4 input-label">
                <span>{t("phone.number")}</span>
              </div>
              <div className="w-3/4 flex">
                <div className="w-full">
                  <Form.Item formik={formik} name="phone">
                    <Input
                      size="large"
                      prefix="+998"
                      id="phone"
                      type="number"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
                {/* <IconButton icon={<AddIcon />} /> */}
              </div>
            </div>

            <div className="flex w-full items-baseline">
              <div className="w-1/4 input-label">
                <label>{t("client.type")}</label>
              </div>
              <div className="w-3/4">
                <Form.Item formik={formik}>
                  <Select
                    height={40}
                    options={customerTypeOption}
                    // value={values.region}
                    onChange={(val) => {
                      // setFieldValue("customer_type", val)
                      console.log(val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
