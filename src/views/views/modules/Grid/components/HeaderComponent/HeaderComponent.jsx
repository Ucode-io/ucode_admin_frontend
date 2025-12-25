import { useRef } from "react";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import { Flex, Text, Button as ChakraButton } from "@chakra-ui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const HeaderComponent = (props) => {
  const buttonRef = useRef(null);
  const { column } = props;
  const field = column?.colDef?.fieldObj;

  const openFilterMenu = () => {
    if (props.api && props.column && buttonRef.current) {
      props.showColumnMenu(buttonRef.current);
    }
  };

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"}>
      <Flex alignItems={"center"} gap={"10px"}>
        {getColumnIcon({
          column: {
            type: field?.type ?? field?.relation_type,
            table_slug: field?.table_slug ?? field?.slug,
          },
        })}
        <Text>{column?.colDef?.headerName}</Text>
      </Flex>
      <ChakraButton
        ref={buttonRef}
        onClick={openFilterMenu}
        _hover={{ background: "#EDF2F6" }}
        w={"20px"}
        h={"20px"}
        bg={"none"}
      >
        <ExpandMoreIcon
          style={{ fontSize: "24px", color: "#667085", pointerEvents: "none" }}
        />
      </ChakraButton>
    </Flex>
  );
};