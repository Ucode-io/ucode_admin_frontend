import React, { useEffect, useMemo, useRef, useState } from "react"
import { FieldArray, useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"
import AddIcon from "@material-ui/icons/Add"
//components and functions
import IconButton from "../../../../components/Button/IconButton"
import Form from "../../../../components/Form/Index"
import Breadcrumb from "../../../../components/Breadcrumb"
import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import { YMaps, Map, Polygon } from "react-yandex-maps"
import CustomSkeleton from "../../../../components/Skeleton"
import {
  getOneGeozone,
  postGeozone,
  updateGeozone,
} from "../../../../services/geozones"
import {
  getOneRegion,
  postRegion,
  updateRegion,
} from "../../../../services/region"
import Button from "../../../../components/Button"

import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import DeleteIcon from "@material-ui/icons/Delete"
import "./style.scss"

export default function CreateGeofence() {
  const history = useHistory()
  const { geozone_id, region_id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const mapRef = useRef(null)
  const polygonRef = useRef(null)
  const [geometry, setGeometry] = useState([])

  const getItem = () => {
    if (!geozone_id) return setLoader(false)
    setLoader(true)
    getOneRegion(region_id)
      .then((res) => {
        formik.setFieldValue("waves", res.wave_info)
      })
      .finally(() => setLoader(false))
    getOneGeozone(geozone_id)
      .then((res) => {
        formik.setFieldValue("name", res.name)
        const polygon =
          res.points &&
          res.points &&
          res.points.map((elm) => [elm.lat, elm.lon])
        setGeometry([polygon])
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getItem()
  }, [])

  // **************** DRAW POLYGON ******************
  const draw = (ref) => {
    ref.editor.startDrawing()
    polygonRef.current = ref
  }

  // ************** GET DATA FROM MAP *************
  const makeData = () => {
    let geometry = polygonRef.current.geometry.getCoordinates()
    let center = findEverage(geometry[0])

    const data = {
      defaultState: {
        center,
        zoom: mapRef.current.getZoom(),
        controls: [
          "zoomControl",
          "fullscreenControl",
          "geolocationControl",
          "rulerControl",
          "trafficControl",
          "typeSelector",
        ],
      },
      geometry,
    }

    return { geometry, data }
  }

  // ************ FIND CENTER OF SELECTED POLYGON **************
  const findEverage = (arr) => {
    let sum = arr.reduce((prev, cur) => [prev[0] + cur[0], prev[1] + cur[1]])
    let res = [sum[0] / arr.length, sum[1] / arr.length]

    return res
  }
  // *********** SET SELECTED POLYGON GEOMETRY ***********
  const changeGeometry = () => {
    setGeometry(polygonRef.current.geometry.getCoordinates())
  }

  // ************** INITIAL MAP STATE **************
  const defaultState = {
    center: [41.311151, 69.279737],
    zoom: 12,
  }
  // ************* INITIAL MAP OPTIONS *************
  const options = {
    editorDrawingCursor: "crosshair",
    draggable: true,
    fillColor: "rgba(255, 99, 71, 0.6)",
    stokeColor: "#255985",
    editorMaxPoints: 1000,
    strokeWidth: 4,
    opacity: 0.8,
  }

  const initialValues = useMemo(
    () => ({
      name: "",
      waves: [
        {
          wave_radius: "",
          wave_duration: "",
        },
      ],
    }),
    []
  )

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      name: defaultSchema,
      waves: yup
        .array()
        .of(
          yup.object().shape({
            wave_radius: yup.number().required(t("required.field")),
            wave_duration: yup.number().required(t("required.field")),
          })
        )
        .required(t("required.field")),
    })
  }, [])

  const saveChanges = async (values, waves) => {
    setSaveLoading(true)
    console.log(waves)
    try {
      if (region_id && geozone_id) {
        await updateRegion(region_id, {
          geozone_id: geozone_id,
          name: values.name,
          wave_info: waves,
        })
        await updateGeozone(geozone_id, {
          name: values.name,
          points: values.points,
        })
        history.push("/home/settings/geofence")
      } else {
        const { id } = await postGeozone(values)
        const regionData = {
          geozone_id: id,
          name: values.name,
          wave_info: waves,
        }
        await postRegion(regionData)
        history.push("/home/settings/geofence")
      }
    } catch (e) {
      console.log(e)
    } finally {
      setSaveLoading(false)
    }
  }

  const onSubmit = (data) => {
    const coordinates = makeData()
    const polygon = coordinates.geometry[0].map((elm, _) => ({
      lat: elm[0],
      lon: elm[1],
    }))
    const geozoneData = {
      name: data.name,
      points: polygon,
    }
    saveChanges(geozoneData, data.waves)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t(`geofence`),
      link: true,
      route: `/home/settings/geofence`,
    },
    {
      title: t("create"),
    },
  ]

  const { values, handleChange, handleSubmit, errors, touched } = formik

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={[
            <Button
              icon={CancelIcon}
              size="large"
              shape="outlined"
              color="red"
              borderColor="bordercolor"
              onClick={(e) => history.go(-1)}
            >
              {t("cancel")}
            </Button>,
            <Button
              icon={SaveIcon}
              size="large"
              type="submit"
              loading={saveLoading}
              onClick={() => console.log()}
            >
              {t("save")}
            </Button>,
          ]}
        />
        <div className="grid grid-cols-2 p-4 gap-4">
          <div>
            <Card title={t(`general.information`)} className="mb-4">
              <div className="flex items-baseline">
                <div className="w-1/4">
                  <span className="input-label">{t("name")}</span>
                </div>
                <div className="w-3/4">
                  <Form.Item formik={formik} name="name">
                    <Input
                      id="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>
            <Card title={t("map.geofence")}>
              <div>
                <YMaps query={{ lang: "ru_RU", load: "package.full" }}>
                  <Map
                    instanceRef={(ref) => {
                      if (ref) mapRef.current = ref
                    }}
                    style={{
                      width: "100%",
                      height: "60vh",
                    }}
                    defaultState={defaultState}
                  >
                    <Polygon
                      defaultGeometry={[]}
                      geometry={geometry}
                      options={options}
                      instanceRef={(ref) => ref && draw(ref)}
                      onGeometryChange={changeGeometry}
                    />
                  </Map>
                </YMaps>
              </div>
            </Card>
          </div>
          <div>
            <Card title="Wave">
              <div>
                <div className="flex mb-4">
                  <div className="grid grid-cols-2 w-11/12">
                    <div className="input-label">Radius</div>
                    <div className="input-label">Duration</div>
                  </div>
                  <div className="w-1/12">
                    <IconButton
                      color="blue"
                      type="button"
                      icon={<AddIcon />}
                      onClick={() => {
                        formik.setFieldValue("waves", [
                          ...formik.values.waves,
                          {
                            wave_radius: "",
                            wave_duration: "",
                          },
                        ])
                      }}
                    />
                  </div>
                </div>
                <FieldArray
                  name="waves"
                  validateOnChange={false}
                  render={() => (
                    <>
                      {values?.waves?.map((item, index) => (
                        <div className="flex">
                          <div className="w-11/12">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="w-full">
                                <Input
                                  id={`radius${index}`}
                                  placeholder={"radius" + "..."}
                                  type="number"
                                  onChange={handleChange}
                                  value={item.wave_radius}
                                  name={`waves[${index}].wave_radius`}
                                />
                                <div
                                  className="min-h-6 w-full"
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: 1.5715,
                                    color: "#ff4d4f",
                                  }}
                                >
                                  {errors?.waves?.[index] &&
                                  touched?.waves?.[index]?.wave_radius
                                    ? errors?.waves?.[index]?.wave_radius
                                    : ""}
                                </div>
                              </div>
                              <div className="w-full">
                                <Input
                                  id={`duration${index}`}
                                  placeholder={"duration" + "..."}
                                  type="number"
                                  onChange={handleChange}
                                  value={item.wave_duration}
                                  name={`waves[${index}].wave_duration`}
                                />
                                <div
                                  className="min-h-6 w-full"
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: 1.5715,
                                    color: "#ff4d4f",
                                  }}
                                >
                                  {errors?.waves?.[index] &&
                                  touched?.waves?.[index]?.wave_duration
                                    ? errors?.waves?.[index]?.wave_duration
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </div>
                          {formik.values.waves.length > 1 && (
                            <div className="w-1/12 ml-2">
                              <IconButton
                                color="red"
                                icon={<DeleteIcon />}
                                onClick={() => {
                                  const newArrays = formik.values.waves.filter(
                                    (_, number) => number !== index
                                  )
                                  formik.setFieldValue("waves", newArrays)
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                />
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
