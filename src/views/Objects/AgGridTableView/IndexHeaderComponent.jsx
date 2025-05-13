import React from "react";
import {Box, Image} from "@chakra-ui/react";
import {useState} from "react";
import {Checkbox} from "@mantine/core";
import {Button} from "@mui/material";

function IndexHeaderComponent(props) {
  const {column, api} = props;
  const [hover, setHover] = useState(false);

  const selectedNodes = api.getSelectedNodes();
  const totalRows = api.getDisplayedRowCount();
  const view = column?.colDef?.view;
  const allSelected = selectedNodes.length === totalRows && totalRows > 0;
  const someSelected =
    selectedNodes?.length < totalRows && selectedNodes?.length > 0;

  const toggleRowSelection = () => {
    if (!api) return;

    if (allSelected) {
      api.deselectAll();
    } else {
      api.selectAll();
    }
  };
  return (
    <>
      <Box
        w={"100%"}
        h={"100%"}
        bg={"#F6F6F6"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        onMouseEnter={() => (!allSelected || !someSelected) && setHover(true)}
        onMouseLeave={() => (!allSelected || !someSelected) && setHover(false)}>
        {!allSelected && !someSelected ? (
          !view?.attributes?.treeData && hover ? (
            <Checkbox
              size="xs"
              checked={allSelected}
              onChange={(e) => toggleRowSelection()}
              style={{
                border: "1.5px solid #637381",
                borderRadius: "2px",
              }}
            />
          ) : (
            <Box>
              <Image src="/img/hash.svg" alt="index" mx="auto" />
            </Box>
          )
        ) : (
          <Checkbox
            indeterminate={someSelected}
            checked={allSelected}
            onChange={(e) => toggleRowSelection()}
          />
        )}
      </Box>
    </>
  );
}

export default IndexHeaderComponent;
