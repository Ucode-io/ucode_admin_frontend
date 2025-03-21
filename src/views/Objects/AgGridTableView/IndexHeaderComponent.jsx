import React from "react";
import AddIcon from "@mui/icons-material/Add";
import style from "./style.module.scss";
import {generateGUID} from "../../../utils/generateID";
import {Box, Flex, Image} from "@chakra-ui/react";
import {useState} from "react";
import {Checkbox} from "@mui/material";

function IndexHeaderComponent(props) {
  const {column} = props;
  const treeData = column?.colDef?.view?.attributes?.treeData;
  const [hover, setHover] = useState(false);

  return (
    <Box
      w={"100%"}
      h={"100%"}
      bg={"#F6F6F6"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      {hover ? (
        <Box>
          <Checkbox style={{width: 10, height: 10}} />
        </Box>
      ) : (
        <Box>
          <Image src="/img/hash.svg" alt="index" mx="auto" />
        </Box>
      )}
    </Box>
  );
}

// onClick={() => {
//   treeData
//     ? column?.colDef?.addRow({
//         guid: generateGUID(),
//       })
//     : column?.colDef?.appendNewRow();

//   column?.colDef?.appendNewRow();
// }}

export default IndexHeaderComponent;
