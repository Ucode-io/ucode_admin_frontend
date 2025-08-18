import { Box } from "@mui/material"
import { useExamplesProps } from "./useExamplesProps"
import { ExampleHeader } from "./ExampleParts"

export const Examples = ({ item }) => {
  const { examples } = useExamplesProps({ item });
  const entry = examples[(item?.type || item?.key)?.toUpperCase()] || {};
  return (
    <Box padding="8px">
      <ExampleHeader item={item} name={entry.name} />
      {entry.content}
    </Box>
  );
}
