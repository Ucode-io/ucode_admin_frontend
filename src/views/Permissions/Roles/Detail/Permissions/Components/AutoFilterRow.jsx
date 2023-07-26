import HFSelect from "../../../../../../components/FormElements/HFSelect";
import { Box } from "@mui/material";
import RectangleIconButton from "../../../../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";

const AutoFilterRow = ({
  control,
  basePath,
  index,
  relations,
  connections,
  remove,
}) => {
  const filterBasePath = `${basePath}.${index}`;

  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "5px",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <Box flex={1}>
        <HFSelect
          control={control}
          name={`${filterBasePath}.object_field`}
          placeholder="Object field"
          options={relations}
        />
      </Box>
      <Box flex={1}>
        <HFSelect
          control={control}
          name={`${filterBasePath}.custom_field`}
          placeholder="Custom field"
          options={connections}
        />
      </Box>
      <RectangleIconButton
        colorScheme="red"
        variant="outline"
        onClick={() => remove(index)}
      >
        <Delete color="error" />
      </RectangleIconButton>
    </Box>
  );
};

export default AutoFilterRow;
