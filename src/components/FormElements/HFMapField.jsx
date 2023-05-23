import { Box } from "@mui/material";
import { Map, Placemark, YMaps } from "@pbe/react-yandex-maps";
import { toNumber } from "lodash-es";
import { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

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
  const mapRef = useRef()

  useEffect(() => {
    mapRef?.current?.panTo(
      [
        parseFloat(field?.attributes?.lat),
        parseFloat(field?.attributes?.long),
      ],
      { flying: 1 }
    )
  }, [])
  
  
  return (
    <Controller
    control={control}
    name={name}
    defaultValue=""
    rules={{
      required: required ? "This is required field" : false,
      ...rules,
    }}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <Box sx={{ width: '250px', overflow: 'hidden' }}>
      <YMaps query={{ load: "package.full" }}>
        <Map style={{ width: '250px', height: '200px'}} defaultState={{
          center: [toNumber(field?.attributes?.lat), toNumber(field?.attributes?.long)],
          zoom: toNumber(7),
          
        }}
          instanceRef={mapRef}
        >
          <Placemark geometry={[toNumber(field?.attributes?.lat), toNumber(field?.attributes?.long)]} />
        </Map>
      </YMaps>
      </Box>
      )}
    ></Controller>
  );
};

export default HFMapField;
