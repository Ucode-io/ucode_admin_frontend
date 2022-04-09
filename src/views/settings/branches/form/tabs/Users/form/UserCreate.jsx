import { makeStyles } from '@material-ui/core/styles'
import { Input } from 'alisa-ui'
import Card from 'components/Card'
import Form from 'components/Form/Index'
import { useFormik } from 'formik'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from "yup";

const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        width: "100%",
        fontSize: "1.5rem",
        padding: "0",
        borderColor: "#ecf4fe",
        backgroundColor: "#ecf4fe",
        color: "#4094f7",
      },
      "& > *:hover": {
        borderColor: "#ecf4fe",
        backgroundColor: "#ecf4fe",
      },
    },
  }));

export default function UserCreate() {


    // ======== const variables ====== //
    const { t } = useTranslation()
    const classes = useStyles()


    const columns = [
        // {
        //   title: t("time"),
        // },
        {
          title: t("monday"),
        },
        {
          title: t("tuesday"),
        },
        {
          title: t("wednesday"),
        },
        {
          title: t("thursday"),
        },
        {
          title: t("friday"),
        },
        {
          title: t("saturday"),
        },
        {
          title: t("sunday"),
        },
      ];


    // ====== < formik section > ===== //
    const initialValues = useMemo(
      () => ({
        name: null,
        base_price: null,
        type: null,
        base_distance: null,
        price_per_km: null,
      }),
      [],
    );

    const onSubmit = (values) => {
      console.log("submit submit");
    };

    const validationSchema = useMemo(() => {
      const defaultSchema = yup.mixed().required(t("required.field.error"));
      return yup.object().shape({
        base_price: defaultSchema,
        type: defaultSchema,
      });
    }, []);

    const formik = useFormik({
      initialValues,
      onSubmit,
      validationSchema,
    });

      const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

   // ====== < formik section /> ===== //


    return (
      <div className="m-4">
        <div className="flex gap-5">
          <div className="w-3/5">
            <Card
              title={t("general.information")}
              style={{ height: "fit-content" }}
            >
              {/* <div className="grid grid-cols-12 gap-8"> */}
                {/* <div className="col-span-9"> */}
                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("full_name")}</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="name">
                          <Input
                            size="large"
                            id="name"
                            value={values.first_name}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                
                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("phone")}</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="name">
                          <Input
                            size="large"
                            id="name"
                            value={values.first_name}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("user.type")}</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="name">
                          <Input
                            size="large"
                            id="name"
                            value={values.first_name}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                {/* </div> */}
              {/* </div> */}
            </Card>

           
          </div>
          
        </div>
      </div>
    );
}