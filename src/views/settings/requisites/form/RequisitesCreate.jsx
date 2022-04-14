import { Input } from 'alisa-ui'
import Card from 'components/Card'
import Form from 'components/Form/Index'
import { useTranslation } from 'react-i18next'
import Select from 'components/Select'
import { useParams } from 'react-router-dom'
import { getRequisiteById } from 'services/requisites'
import { useEffect } from 'react'


export default function RequisitesCreate({formik}) {

    // ======== const variables ====== //
    const { t } = useTranslation()
    const params = useParams()

    const addresses = [
      {
        value: 1,
        title: 'maksim grokiy'
      }
    ]


    console.log('formik values', formik.values)

   // ====== < GET Requisite /> ===== //

   const getRequsite = () => {
     if(params.id){
       getRequisiteById(params.id)
       .then((res) => {
         console.log("GET requisite by id => ", res)
         formik.setValues(res.data);
       })
     }
   }


   useEffect(() => {
    getRequsite()
   },[])

    return (
      <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <Card title={t("requisites")} style={{ height: "fit-content" }}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("naming")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="name">
                  <Input
                    size="large"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    name="name"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("code")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="code">
                  <Input
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    className="order-1"
                    size="large"
                    name="code"
                  />
                </Form.Item>
              </div>
              <div className="input-label">{t("addresses")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="address">
                  <Select
                    height={40}
                    name="address"
                    value={formik.values.address}
                    onChange={(value) =>
                      formik.setFieldValue("address", value.address)
                    }
                      // options={regions}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("contacts")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="contact">
                  <Select
                    height={40}
                    name="contact"
                    value={formik.values.contact}
                    onChange={(value) =>
                      formik.setFieldValue("contact", value.contact)
                    }
                    //   options={regions}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("inn")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="inn">
                  <Input
                    size="large"
                    value={formik.values.inn}
                    onChange={formik.handleChange}
                    name="inn"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("checking.account")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="account">
                  <Select
                    height={40}
                    name="account"
                    value={formik.values.account}
                    onChange={(value) =>
                      formik.setFieldValue("account", value.account)
                    }
                    //   options={regions}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("director")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="director">
                  <Input
                    size="large"
                    value={formik.values.director}
                    onChange={formik.handleChange}
                    name="director"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("mfo")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="mfo">
                  <Input
                    size="large"
                    value={formik.values.mfo}
                    onChange={formik.handleChange}
                    name="mfo"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("chief.accountant")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="accountant">
                  <Input
                    size="large"
                    value={formik.values.accountant}
                    onChange={formik.handleChange}
                    name="accountant"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("oked")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="oked">
                  <Input
                    size="large"
                    value={formik.values.oked}
                    onChange={formik.handleChange}
                    name="oked"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("code.okpo")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="code_okpo">
                  <Input
                    size="large"
                    value={formik.values.code_okpo}
                    onChange={formik.handleChange}
                    name="code_okpo"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("code.nds")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="code_nds">
                  <Input
                    size="large"
                    value={formik.values.code_nds}
                    onChange={formik.handleChange}
                    name="code_nds"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("region")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="region">
                  <Input
                    size="large"
                    value={formik.values.region}
                    onChange={formik.handleChange}
                    name="region"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("commentary")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="comments">
                  <Input
                    size="large"
                    value={formik.values.comments}
                    onChange={formik.handleChange}
                    name="comments"
                  />
                </Form.Item>
              </div>
            </div>
          </Card>

          <Card title={t("accounts")} style={{ height: "fit-content" }}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("name")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="account_name">
                  <Input
                    size="large"
                    value={formik.values.account_name}
                    onChange={formik.handleChange}
                    name="account_name"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("operation.type")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="type_operation">
                  <Input
                    className="order-1"
                    size="large"
                    style={{ flex: "1 1 80%" }}
                    name="type_operation"
                    value={formik.values.type_operation}
                    onChange={formik.handleChange}
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("checking.account")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="account">
                  <Select
                    isMulti
                    height={40}
                    name="account"
                    value={formik.values.account}
                    onChange={(value) =>
                      formik.setFieldValue("account", value.account)
                    }
                    //   options={regions}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
}