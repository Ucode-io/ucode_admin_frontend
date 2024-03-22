import React, {useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {Controller} from "react-hook-form";
import {FullscreenControl, Map, Polygon, YMaps} from "@pbe/react-yandex-maps";

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
  defaultPolygon = [],
  polygons = [],
  ...props
}) => {
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

  const handlePolygonSwitch = (index) => {
    setSelectedPolygonIndex(index);
  };

  const [selectedVertexIndex, setSelectedVertexIndex] = useState(null);

  const handleVertexClick = (index) => {
    setSelectedVertexIndex(index);
    setEditingPolygon(true);
  };

  const draw = (ref) => {
    ref.editor.startDrawing();
    ref.editor.events.add("vertexadd", (event) => {
      console.log(event);
    });
  };

  const mapState = {
    center: [selectedCoordinates?.lat ?? "", selectedCoordinates?.long ?? ""],
    zoom: 10,
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultPolygon}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        let parsedValue = [];
        try {
          if (value) {
            parsedValue = JSON.parse(value);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }

        return (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              position: "relative",
            }}>
            <YMaps key={""}>
              <Map
                width={"300px"}
                defaultState={mapState}
                modules={["geoObject.addon.editor"]}>
                <FullscreenControl />
                <Polygon
                  onGeometryChange={(event) => {
                    const coordinates =
                      event?.originalEvent?.target?.geometry?._coordPath
                        ?._coordinates;

                    if (coordinates) {
                      const coordinatesJson = JSON.stringify(coordinates);

                      onChange(coordinatesJson);
                    }
                  }}
                  instanceRef={(ref) =>
                    !window.location.pathname?.includes("constructor/apps") &&
                    ref &&
                    draw(ref)
                  }
                  geometry={parsedValue}
                  options={{
                    editorDrawingCursor: "crosshair",
                    editorMaxPoints: 25,
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
