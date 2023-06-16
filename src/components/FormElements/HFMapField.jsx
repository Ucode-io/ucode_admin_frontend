import { Box } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { toNumber } from "lodash-es";
import { useEffect, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";

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
    lat: 55.76,
    long: 37.64
  });

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is a required field" : false,
        ...rules
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const lat = selectedCoordinates.lat || value?.split(",")?.[0];
        const long = selectedCoordinates.long || value?.split(",")?.[1];

        if (!lat && !long) {
          const attributesLat = toNumber(field?.attributes?.lat);
          const attributesLong = toNumber(field?.attributes?.long);
          if (attributesLat && attributesLong) {
            setSelectedCoordinates({
              lat: attributesLat,
              long: attributesLong
            });
          }
        }

        return (
          <Box sx={{ width: "275px", overflow: "hidden" }}>
            <YMaps query={{ load: "package.full" }}>
              <Map
                style={{ width: "275px", height: "200px" }}
                defaultState={{
                  center: [lat, long],
                  zoom: 7
                }}
                instanceRef={mapRef}
                onClick={(e) => {
                  const [clickedLat, clickedLng] = e.get("coords");
                  setSelectedCoordinates({ lat: clickedLat, long: clickedLng });
                  onChange(`${clickedLat},${clickedLng}`);
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
