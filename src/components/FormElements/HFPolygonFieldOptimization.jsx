import React, {useEffect, useState} from "react";
import {Box} from "@mui/material"
import { Map, Polygon, YMaps} from "@pbe/react-yandex-maps";
import {isJSONParsable} from "../../utils/isJsonValid";

const HFPolygonField = ({
  field,
  width = 0,
  height = 0,
  setValue = () => {},
  polygonValue = [],
  value
}) => {

  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: field?.attributes?.lat || "41.2995",
    long: field?.attributes?.long || "69.2401",
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

  const draw = (ref) => {
    ref?.editor?.startDrawing();
    ref?.editor?.events?.add("vertexadd", () => {});
  };

  const mapState = {
    center: [selectedCoordinates?.lat, selectedCoordinates?.long],
    zoom: 9,
  };

  const parsedPolygon = isJSONParsable(value) ? JSON.parse(value) : [];

  return (
    <Box
    id="polygon_field"
    sx={{
      width: "100%",
      height: "100%",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <YMaps
      query={{
        load: "package.full",
        apikey: "a152ff76-8337-42f9-a5c1-be25f9008dd0",
      }}
    >
      <Map
        id="map_polygon_field"
        width={width !== 0 ? width : "265px"}
        height={height !== 0 ? height : "200px"}
        defaultState={mapState}
        modules={["geoObject.addon.editor"]}
      >
        <Polygon
          id="polygon"
          editingPolygon={true}
          onGeometryChange={(event) => {
            const coordinates =
              event?.originalEvent?.target?.geometry?._coordPath
                ?._coordinates;
            if (coordinates) {
              const coordinatesJson = JSON.stringify(coordinates);
              setValue(coordinatesJson);
            }
          }}
          instanceRef={(ref) =>
            !window?.location.pathname?.includes("constructor/apps")
              ? ref && draw(ref)
              : draw({})
          }
          geometry={
            parsedPolygon?.length > 0 ? parsedPolygon : polygonValue
          }
          options={{
            editorDrawingCursor: "crosshair",
            editorMaxPoints: 8,
            fillColor: "rgba(222,109,110, 0.5)",
            strokeColor: "rgb(69,130,250)",
            strokeWidth: 3,
            editable: true,
          }}
        />
      </Map>
    </YMaps>
  </Box>
  )
};

export default HFPolygonField;
