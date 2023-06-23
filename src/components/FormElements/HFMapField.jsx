import { Box } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { toNumber } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import styles from "./style.module.scss";

const HFMapField = ({
  control,
  name,
  tabIndex,
  required,
  rules,
  disabledHelperText = false,
  disabled,
  field,
  ...props
}) => {
  const mapRef = useRef();
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: "",
    long: "",
  });

  useEffect(() => {
    const handleGeolocationError = (error) => {
      console.error("Error getting current location:", error);
    };

    const handleGeolocationSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setSelectedCoordinates({ lat: latitude, long: longitude });
    };

    const getCurrentLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          handleGeolocationSuccess,
          handleGeolocationError
        );
      } else {
        console.error("Geolocation is not supported in this browser.");
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        let lat = value ? value.split(",")[0] : selectedCoordinates.lat;
        let long = value ? value.split(",")[1] : selectedCoordinates.long;
        if (!lat && !long) {
          const attributesLat = toNumber(field?.attributes?.lat);
          const attributesLong = toNumber(field?.attributes?.long);
          if (attributesLat && attributesLong) {
            lat = attributesLat;
            long = attributesLong;
          }
        }

        const handleClick = (clickedLat, clickedLng) => {
          setSelectedCoordinates({ lat: clickedLat, long: clickedLng });
          onChange(`${clickedLat},${clickedLng}`);
        };

        return (
          <Box sx={{ width: "265px", overflow: "hidden", position: "relative" }}>
            <YMaps query={{ load: "package.full", apikey: "a5d9ae45-31f8-4178-81a4-15ddca3ddc51" }}>
              <Map
                style={{ width: "265px", height: "200px", boxSizing: "border-box" }}
                defaultState={{
                  center: [lat, long],
                  zoom: 7,
                }}
                instanceRef={mapRef}
                onClick={(e) => {
                  const [clickedLat, clickedLng] = e.get("coords");
                  handleClick(clickedLat, clickedLng);
                  setSelectedCoordinates({ lat: clickedLat, long: clickedLng });
                }}
                options={{
                  suppressMapOpenBlock: true,
                }}
              >
                <Placemark geometry={[lat, long]} />
              </Map>
            </YMaps>
          </Box>
        );
      }}
    />
  );
};

export default HFMapField;
