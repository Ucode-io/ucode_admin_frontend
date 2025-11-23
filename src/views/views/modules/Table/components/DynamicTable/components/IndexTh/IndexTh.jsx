import { Box, Image } from "@chakra-ui/react";
import { Checkbox } from "@mui/material";
import { useState } from "react";

export const IndexTh = ({ items, selectedItems, onSelectAll }) => {
  const [hover, setHover] = useState(false);
  const showCheckbox = hover || selectedItems?.length > 0;

  const [checked, setChecked] = useState(false);

  return (
    <Box
      minWidth="45px"
      textAlign="center"
      as="th"
      bg="#f6f6f6"
      py="2px"
      px="12px"
      borderRight="1px solid #EAECF0"
      position="sticky"
      left={0}
      zIndex={1}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {!showCheckbox && <Image src="/img/hash.svg" alt="index" mx="auto" />}
      {showCheckbox && (
        <Checkbox
          style={{ width: 10, height: 10 }}
          defaultChecked={
            items?.length === selectedItems?.length && items?.length > 0
          }
          checked={checked}
          onChange={(_, checked) => {
            onSelectAll(checked);
            setChecked(checked);
          }}
        />
      )}
    </Box>
  );
};
