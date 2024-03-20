import React, {useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {Map, Placemark, YMaps, Polygon} from "@pbe/react-yandex-maps";
import {toNumber} from "lodash-es";
import {Controller} from "react-hook-form";
import {generateLink} from "../../utils/generateYandexLink";

const HFPolygonField = ({
  control,
  name,
  tabIndex,
  required,
  updateObject,
  isNewTableView = false,
  rules,
  disabledHelperText = false,
  disabled,
  field,
  width = "265px",
  height = "200px",
  defaultPolygon = [], // Default polygon coordinates
  polygons = [], // Array of polygons to switch between
  ...props
}) => {
  const mapRef = useRef();
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: "",
    long: "",
  });
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(0);

  useEffect(() => {
    const handleGeolocationError = (error) => {
      console.error("Error getting current location:", error);
    };

    const handleGeolocationSuccess = (position) => {
      const {latitude, longitude} = position.coords;
      setSelectedCoordinates({lat: latitude, long: longitude});
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

  const handleClick = (clickedLat, clickedLng) => {
    setSelectedCoordinates({lat: clickedLat, long: clickedLng});
    const selectedPolygon = polygons[selectedPolygonIndex];
    const updatedPolygon = selectedPolygon
      .map(([lat, lng]) => `${lat},${lng}`)
      .join(" ");
    onChange(updatedPolygon);
    isNewTableView && updateObject();
  };

  const handlePolygonSwitch = (index) => {
    setSelectedPolygonIndex(index);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultPolygon.join(" ")} // Set the default value
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        const selectedPolygon = polygons[selectedPolygonIndex];
        let lat = selectedCoordinates.lat;
        let long = selectedCoordinates.long;

        return (
          <Box sx={{width: width, overflow: "hidden", position: "relative"}}>
            <YMaps
              query={{
                load: "package.full",
                apikey: "5e5a73bd-6e0a-40f1-ba8e-f0b98d95e75f",
              }}>
              <Map
                id={`map_${name}`}
                style={{
                  width: width,
                  height: height,
                  boxSizing: "border-box",
                }}
                defaultState={{
                  center: [lat, long],
                  zoom: 7,
                }}
                instanceRef={mapRef}
                onClick={(e) => {
                  const [clickedLat, clickedLng] = e.get("coords");
                  handleClick(clickedLat, clickedLng);
                }}
                options={{
                  suppressMapOpenBlock: true,
                }}>
                <Placemark geometry={[lat, long]} />
                <Polygon
                  geometry={selectedPolygon}
                  options={{
                    fillColor: "#00FF00",
                    strokeColor: "#0000FF",
                    strokeWidth: 4,
                  }}
                />
              </Map>
            </YMaps>
            <div>
              {polygons.map((polygon, index) => (
                <button key={index} onClick={() => handlePolygonSwitch(index)}>
                  Polygon {index + 1}
                </button>
              ))}
            </div>
            <a
              href={generateLink(lat, long)}
              target="_blank"
              rel="noopener noreferrer">
              Open in Yandex Maps
            </a>
          </Box>
        );
      }}
    />
  );
};

export default HFPolygonField;
