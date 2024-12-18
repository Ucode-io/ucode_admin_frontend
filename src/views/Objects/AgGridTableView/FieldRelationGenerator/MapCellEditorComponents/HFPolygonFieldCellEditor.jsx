import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import {Map, Polygon, YMaps} from "@pbe/react-yandex-maps";
import {isJSONParsable} from "../../../../../utils/isJsonValid";

const HFPolygonFieldCellEditor = ({
  field = {},
  width = 0,
  height = 0,
  onChange = () => {},
  value,
}) => {
  const defaultCoordinates = [[]];

  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: parseFloat(field?.attributes?.lat || "41.2995"),
    long: parseFloat(field?.attributes?.long || "69.2401"),
  });

  const [polygonCoordinates, setPolygonCoordinates] = useState(
    isJSONParsable(value) && JSON.parse(value)?.length > 0
      ? JSON.parse(value)
      : defaultCoordinates
  );

  const draw = (ref) => {
    ref.editor.startDrawing();

    ref.editor.events.add("vertexadd", (event) => {
      const coordinates =
        event?.originalEvent?.target?.geometry?.getCoordinates();
      onChange(coordinates);
    });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          setSelectedCoordinates({lat: latitude, long: longitude});
        },
        (error) => console.error("Error getting current location:", error)
      );
    } else {
      console.error("Geolocation is not supported in this browser.");
    }
  }, []);

  const handleGeometryChange = (event) => {
    try {
      const coordinates =
        event?.originalEvent?.target?.geometry?.getCoordinates();

      if (coordinates && coordinates.length > 0) {
        setPolygonCoordinates(coordinates);
        onChange(JSON.stringify(coordinates));
      }
    } catch (error) {
      console.error("Error updating geometry:", error);
    }
  };

  const mapState = {
    center: [selectedCoordinates.lat, selectedCoordinates.long],
    zoom: 9,
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}>
      <YMaps
        query={{
          load: "package.full",
          apikey: "5e5a73bd-6e0a-40f1-ba8e-f0b98d95e75f",
        }}>
        <Map
          width={width !== 0 ? width : "265px"}
          height={height !== 0 ? height : "200px"}
          defaultState={mapState}
          modules={["geoObject.addon.editor"]}>
          <Polygon
            instanceRef={(ref) => ref && draw(ref)}
            onGeometryChange={handleGeometryChange}
            geometry={polygonCoordinates}
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
  );
};

export default HFPolygonFieldCellEditor;
