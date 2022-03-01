import { useState, useMemo, useEffect } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import Gallery from "components/Gallery";
import { useFormik } from "formik";
import { getBranchById } from "services";
import { useParams } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import Map from "./Map";

export default function AboutCompany() {
  const { t } = useTranslation();
  const params = useParams();

  const [mapChange, setMapChange] = useState(false);
  const [loader, setLoader] = useState(true);
  const [placemarkGeometry, setPlacemarkGeometry] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

  const fetchData = () => {
    setLoader(true);
    if (!params.id) {
      setLoader(false);
      setMapChange(true);
    }
    getBranchById({}, params.id)
      .then((res) => {
        console.log(res);
        formik.setValues({
          name: res.name,
          phone: res.phone[0].slice(4),
          address: res.address,
          logo: res.logo,
          location: res.location,
          work_hour_start: res.work_hour_start,
          work_hour_end: res.work_hour_end,
        });
        setPlacemarkGeometry([res.location?.lat, res.location?.long]);
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = useMemo(
    () => ({
      name: null,
      phone: null,
      address: null, //not
      logo: "",
      location: null,
      work_hour_start: null,
      work_hour_end: null,
    }),
    [],
  );

  const formik = useFormik({
    initialValues,
  });

  const { values, handleChange, setFieldValue } = formik;

  return (
    <>
      {loader ? (
        <FullScreenLoader />
      ) : (
        <>
          <div className="grid grid-cols-2">
            <div>
              <Card className="m-4 mr-2" title={t("general.information")}>
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-3">
                    <Form.Item formik={formik} name="logo">
                      <div className="w-full h-full flex mt-6 items-center flex-col">
                        <Gallery
                          rounded
                          width={120}
                          height={120}
                          gallery={values.logo ? [values.logo] : []}
                          setGallery={(elm) => setFieldValue("logo", elm[0])}
                          multiple={false}
                        />
                        {
                          <span className="mt-2 text-primary text-base">
                            {values.logo ? t("change.photo") : t("add.photo")}
                          </span>
                        }
                      </div>
                    </Form.Item>
                  </div>

                  <div className="col-span-9">
                    <div className="w-full flex items-baseline">
                      <div className="w-1/4 input-label">
                        <span>{t("name")}</span>
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
                        <span>{t("phone")}</span>
                      </div>
                      <div className="w-3/4">
                        <div>
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
                      </div>
                    </div>

                    <div className="flex w-full items-baseline">
                      <div className="w-1/4 input-label">
                        <label>{t("address")}</label>
                      </div>
                      <div className="w-3/4">
                        <Form.Item formik={formik} name="address">
                          <Input
                            size="large"
                            id="address"
                            value={values.address}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="m-4 mr-2" title={t("location")}>
                <Map
                  placemarkGeometry={placemarkGeometry}
                  setPlacemarkGeometry={setPlacemarkGeometry}
                  formik={formik}
                  setMapChange={setMapChange}
                  params={params}
                  mapLoading={mapLoading}
                />
              </Card>
            </div>
            <Card className="m-4" title={t("schedule")}>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                  <div className="flex w-full items-baseline">
                    <div className="w-1/4 input-label">
                      <label>{t("work_hour_start")}</label>
                    </div>
                    <div className="w-3/4">
                      <Form.Item formik={formik} name="work_hour_start">
                        <Input
                          size="large"
                          id="work_hour_start"
                          value={values.work_hour_start}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex w-full items-baseline">
                    <div className="w-1/4 input-label">
                      <label>{t("work_hour_end")}</label>
                    </div>
                    <div className="w-3/4">
                      <Form.Item formik={formik} name="work_hour_end">
                        <Input
                          size="large"
                          id="work_hour_end"
                          value={values.work_hour_end}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
