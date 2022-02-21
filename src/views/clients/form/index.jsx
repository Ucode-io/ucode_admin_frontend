import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import numberToPrice from "helpers/numberToPrice";
import ClientCreateCard from "components/ClientCard/Create";
import AttachMoneyOutlinedIcon from "@material-ui/icons/AttachMoneyOutlined";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MoneyOffIcon from "@material-ui/icons/MoneyOff";
import FunctionsIcon from "@material-ui/icons/Functions";
import Gallery from "components/Gallery";
import Select from "components/Select";
import { useParams } from "react-router-dom";

export default function Client({ formik, customerTypeOption }) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;
  const params = useParams();

  return (
    <>
      {params.id && (
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
              title: t("average.check"),
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
      )}

      <Card className="m-4" title={t("client")}>
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
                {
                  <span className="mt-2 text-primary text-base">
                    {values.image ? t("change.photo") : t("add.photo")}
                  </span>
                }
              </div>
            </Form.Item>
          </div>
          <div className="col-span-9">
            <div className="w-full flex items-baseline">
              <div className="w-1/4 input-label">
                <span>{t("first.name")}</span>
              </div>
              <div className="w-3/4">
                <div>
                  <Form.Item formik={formik} name="first_name">
                    <Input
                      size="large"
                      id="first_name"
                      value={values.first_name}
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
                  <Form.Item formik={formik} name="last_name">
                    <Input
                      size="large"
                      id="last_name"
                      value={values.last_name}
                      onChange={handleChange}
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
                      value={values.phone}
                      onChange={handleChange}
                      type="number"
                      min="1"
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
                <Form.Item formik={formik} name="client_type">
                  <Select
                    height={40}
                    options={customerTypeOption}
                    // value={values.region}
                    onChange={(val) => {
                      setFieldValue("client_type", val);
                      console.log(val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
