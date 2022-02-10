import { useRef, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { YMaps, Map, Placemark } from "react-yandex-maps"
import { apikey } from "../../../../../../constants/mapDefaults"
//components
import Form from "../../../../../../components/Form/Index"
import Card from "../../../../../../components/Card"
import Gallery from "../../../../../../components/Gallery"
import { Input } from "alisa-ui"

//constants
import { mapDefaults } from "../../../../../../constants/mapDefaults"

export default function LeftContent({ formik }) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik
  const mapRef = useRef(null)
  const [geometry, seteGeometry] = useState(null)
  const yandexMap = useRef(null)
  const setMapRef = useCallback((ref, opt) => {
    if (ref) {
      mapRef.current = ref
      ref.events.add("click", (e) => {
        const coords = e.get("coords")
        console.log(coords)
        getAddress(yandexMap.current.ymaps, e)
        setFieldValue("location", { lat: coords[0], long: coords[1] })
        // seteGeometry({ lat: coords[0], long: coords[1] })
      })
    }
  }, [])

  function getAddress(ymap, e) {
    ymap.api.geocode(e.get("coords")).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0)
      setFieldValue("destination", firstGeoObject.getAddressLine())
      setFieldValue("address", firstGeoObject.getAddressLine())
    })
  }

  return (
    <div className="col-span-6">
      <Card className="mb-4" title={t("general.information")}>
        <div className="flex w-full items-baseline">
          <div className="w-1/4 input-label">
            <label htmlFor="name">{t("name")}</label>
          </div>
          <div className="w-3/4">
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

        <div className="flex w-full items-baseline">
          <div className="w-1/4 input-label">
            <label htmlFor="phone">{t("phone.number")}</label>
          </div>
          <div className="w-3/4">
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
        </div>

        <div className="flex w-full items-baseline">
          <div className="w-1/4 input-label">
            <label htmlFor="address">{t("address")}</label>
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

        <div className="flex w-full my-4">
          <div className="w-1/4 input-label">
            <span>{t("logo")}</span>
          </div>
          <div className="w-3/4">
            <Gallery
              height={140}
              gallery={values.image ? [values.image] : []}
              setGallery={(elm) => setFieldValue("image", elm[0])}
              multiple={false}
            />
          </div>
        </div>
      </Card>

      <Card title={t("geofence")}>
        <div style={{ width: "100%", height: "400px" }}>
          <YMaps
            ref={yandexMap}
            query={{ apikey, lang: "ru_RU", load: "package.full" }}
          >
            <Map
              instanceRef={setMapRef}
              width="100%"
              height="100%"
              defaultState={
                values.location
                  ? {
                      ...mapDefaults,
                      center: [values.location.lat, values.location.long],
                    }
                  : mapDefaults
              }
              // onGeometryChange={e => console.log(e)}
            >
              {values.location ? (
                <Placemark
                  geometry={
                    values.location
                      ? [values.location.lat, values.location.long]
                      : []
                  }
                />
              ) : (
                <></>
              )}
            </Map>
          </YMaps>
        </div>

        <div className="mt-2">
          <Form.Item
            formik={formik}
            name="destination"
            label={t("destination")}
          >
            <Input
              size="large"
              id="destination"
              value={values.destination}
              onChange={handleChange}
            />
          </Form.Item>
        </div>
      </Card>
    </div>
  )
}
