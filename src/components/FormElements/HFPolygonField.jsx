import React, {useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {toNumber} from "lodash-es";
import {Controller} from "react-hook-form";
import {generateLink} from "../../utils/generateYandexLink";
import {Map, Polygon, YMaps, FullscreenControl} from "react-yandex-maps";

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
  width = "100%",
  height = "500px",
  defaultPolygon = [],
  polygons = [],
  ...props
}) => {
  console.log("fielddddddddd", field);
  const mapRef = useRef();
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: field?.attributes?.lat || "",
    long: field?.attributes?.long || "",
  });
  const [selectedPolygonIndex, setSelectedPolygonIndex] = useState(0);
  const [editingPolygon, setEditingPolygon] = useState(false);

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
    if (!editingPolygon) {
      setSelectedCoordinates({lat: clickedLat, long: clickedLng});
    } else {
      const updatedPolygon = polygons[selectedPolygonIndex].map(
        ([lat, lng], index) => {
          if (index === selectedVertexIndex) {
            return [clickedLat, clickedLng];
          }
          return [lat, lng];
        }
      );
      onChange(updatedPolygon);
      isNewTableView && updateObject();
      setEditingPolygon(false);
    }
  };

  const handlePolygonSwitch = (index) => {
    setSelectedPolygonIndex(index);
  };

  const [selectedVertexIndex, setSelectedVertexIndex] = useState(null);

  const handleVertexClick = (index) => {
    setSelectedVertexIndex(index);
    setEditingPolygon(true);
  };

  const handleDeleteVertex = () => {
    const updatedPolygon = polygons[selectedPolygonIndex].filter(
      (_, index) => index !== selectedVertexIndex
    );
    onChange(updatedPolygon);
    isNewTableView && updateObject();
    setSelectedVertexIndex(null);
  };
  const draw = (ref) => {
    ref.editor.startDrawing();
    console.log("refrefrefrefrefref", ref);
    ref.editor.events.add("vertexadd", (event) => {
      console.log(event);
    });
  };

  const mapState = {
    center: [selectedCoordinates?.lat, selectedCoordinates?.long],
    zoom: 10,
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
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}>
            <YMaps>
              <Map
                width={"300px"}
                defaultState={mapState}
                modules={["geoObject.addon.editor"]}>
                <FullscreenControl />
                <Polygon
                  instanceRef={(ref) => ref && draw(ref)}
                  geometry={[]}
                  options={{
                    editorDrawingCursor: "crosshair",
                    editorMaxPoints: 1000,
                    fillColor: "#00FF00",
                    strokeColor: "#0000FF",
                    strokeWidth: 5,
                  }}
                />
              </Map>
            </YMaps>
          </Box>
        );
      }}
    />
  );
};

export default HFPolygonField;
