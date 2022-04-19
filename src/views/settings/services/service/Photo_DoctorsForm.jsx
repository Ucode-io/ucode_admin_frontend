import Card from "components/Card";
import Gallery from "components/Gallery";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";

export default function PhotoAndDoctorsForm ({formik}) {

    const { t } = useTranslation();

    return (
      <>
        <Card title={t("photo")}>
          <Form.Item formik={formik} name="photos">
            <div className="w-full h-full flex mt-6  flex-col">
              <Gallery
                rounded={false}
                width={120}
                height={120}
                gallery={formik.values.photos.length ? [...formik.values.photos] : []}
                setGallery={(elm) => formik.setFieldValue("photos", [
                    ...formik.values.photos,
                    elm[elm.length - 1],
                  ])}
                  style={{ flexDirection: "row" }}
                  multiple={true}
              />
            </div>
          </Form.Item>
        </Card>
        <Card title={t("doctors")} className="mt-5"></Card>
      </>
    );
}