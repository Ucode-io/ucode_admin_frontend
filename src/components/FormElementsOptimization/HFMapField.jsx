import React, {useEffect, useRef, useState} from "react";
import {Box} from "@mui/material";
import {Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import {toNumber} from "lodash-es";
import {generateLink} from "../../utils/generateYandexLink";

const HFMapField = ({
  width = "265px",
  height = "200px",
  row,
  handleChange,
}) => {
  const mapRef = useRef();
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    lat: "",
    long: "",
  });

  const value = row?.value;

  const onChange = (value) => {
    handleChange({
      value,
      name: row?.slug,
      rowId: row?.guid,
    });
  };

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
          handleGeolocationError,
        );
      } else {
        console.error("Geolocation is not supported in this browser.");
      }
    };

    getCurrentLocation();
  }, []);

  let lat = value ? value.split(",")[0] : selectedCoordinates.lat;
  let long = value ? value.split(",")[1] : selectedCoordinates.long;
  if (!lat && !long) {
    const attributesLat = toNumber(row?.attributes?.lat);
    const attributesLong = toNumber(row?.attributes?.long);
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
    <Box sx={{ width: width, overflow: "hidden", position: "relative" }}>
      <YMaps
        query={{
          load: "package.full",
          apikey: "5e5a73bd-6e0a-40f1-ba8e-f0b98d95e75f",
        }}
      >
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
            setSelectedCoordinates({ lat: clickedLat, long: clickedLng });
          }}
          options={{
            suppressMapOpenBlock: true,
          }}
        >
          <Placemark geometry={[lat, long]} />
        </Map>
      </YMaps>
      <a
        href={generateLink(lat, long)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Yandex Maps
      </a>
    </Box>
  );
};

export default HFMapField;
