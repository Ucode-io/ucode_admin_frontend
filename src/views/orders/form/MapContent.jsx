import { CircularProgress } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { mapDefaults, apikey } from "constants/mapDefaults";
import { getNearestBranch } from "services";
import axios from "../../../utils/axios";

export default function MapContent({
  placemarkGeometry,
  setPlacemarkGeometry,
  formik,
  branches,
  setMapChange,
  params,
  mapLoading,
  setBranch,
}) {
  const yandexMap = useRef(null);

  function getAddress(ymap, e) {
    ymap.api.geocode(e.get("coords")).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);
      formik.setFieldValue("to_address", firstGeoObject.getAddressLine());
    });
  }

  const setMapRef = (e) => {
    if (params.id) {
      setMapChange(true);
    }
    setPlacemarkGeometry(e.get("coords"));
    getAddress(yandexMap.current.ymaps, e);
    getBranch(e);
  };
  const getBranch = (e) => {
    console.log("first", e);
    axios
      .get(`${process.env.REACT_APP_AUTH_URL}/nearest-branch`, {
        lat: e.get("coords")[0],
        long: e.get("coords")[1],
      })
      .then((res) => {
        setBranch(res);
      });
  };

  return (
    <div style={{ width: "100%", height: 300, position: "relative" }}>
      {mapLoading && (
        <div className="map-loader">
          <CircularProgress
            size={40}
            style={{ color: "var(--color-primary)" }}
          />
        </div>
      )}
      <YMaps
        ref={yandexMap}
        query={{ apikey, lang: "ru_RU", load: "package.full" }}
      >
        <Map
          onClick={setMapRef}
          width="100%"
          height="100%"
          defaultState={mapDefaults}
        >
          {placemarkGeometry.length ? (
            <Placemark geometry={placemarkGeometry} />
          ) : (
            <></>
          )}
          {branches && branches.length ? (
            branches?.map(({ elm, label }, id) => (
              <Placemark
                key={id}
                properties={{
                  iconContent: `${label}`,
                }}
                options={{
                  preset: "islands#redStretchyIcon",
                }}
                geometry={[elm?.location.lat, elm?.location.long]}
              />
            ))
          ) : (
            <></>
          )}
        </Map>
      </YMaps>
    </div>
  );
}
