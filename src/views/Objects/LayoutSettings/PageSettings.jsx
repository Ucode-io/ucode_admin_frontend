import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import "./style.scss";
import chakraUITheme from "@/theme/chakraUITheme";
import {Container, Draggable} from "react-smooth-dnd";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {applyDrag} from "../../../utils/applyDrag";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {getColumnIcon} from "../../table-redesign/icons";

function PageSettings({selectedSection, updateSectionFields = () => {}}) {
  return (
    <ChakraProvider theme={chakraUITheme}>
      <Box px={"20px"} pt={5}>
        <Text fontSize={16} fontWeight={500}>
          Property group
        </Text>
        <SearchInput />
      </Box>

      <SettingFields
        updateSectionFields={updateSectionFields}
        selectedSection={selectedSection}
      />
    </ChakraProvider>
  );
}

const SearchInput = () => {
  return (
    <InputGroup mt="10px">
      <InputLeftElement pointerEvents="none">
        <Image src="/img/search-lg.svg" alt="search" boxSize="16px" />
      </InputLeftElement>
      <Input
        placeholder="Search"
        pl="35px"
        bg={"#fff"}
        borderColor="gray.300"
        focusBorderColor="blue.500"
      />
    </InputGroup>
  );
};

const SettingFields = ({selectedSection, updateSectionFields = () => {}}) => {
  const [sectionFields, setSectionFields] = useState(selectedSection?.fields);
  const [dragAction, setDragAction] = useState(false);
  const onDrop = (dropResult) => {
    const result = applyDrag(sectionFields, dropResult);
    updateSectionFields(result);
    setSectionFields(result);
  };

  useEffect(() => {
    setSectionFields(selectedSection?.fields);
  }, [selectedSection]);

  return (
    <Box mt={"25px"} px={5}>
      <Container
        behaviour="contain"
        onDrop={onDrop}
        onDragStart={() => setDragAction(true)}
        onDragEnd={() => setDragAction(false)}
        dragClass="field-drag">
        {sectionFields?.map((item) => (
          <Draggable>
            <Flex
              cursor={"pointer"}
              alignItems={"center"}
              justifyContent={"space-between"}>
              <Flex
                className={dragAction ? "fieldRowDrag" : "fieldRow"}
                _hover={{
                  background: "rgba(55, 53, 47, 0.09)",
                }}
                w={"230px"}
                gap={"5px"}
                my={"3px"}
                px={"6px"}
                h={"33px"}
                alignItems={"center"}
                borderRadius={"4px"}>
                <Flex className={"fieldIcon"}>
                  {getColumnIcon({
                    column: {
                      type: item?.type ?? item?.relation_type,
                      table_slug: "regulart",
                    },
                  })}
                </Flex>
                <Flex
                  className="fieldDragIcon"
                  w={"20px"}
                  h={"20px"}
                  alignItems={"center"}>
                  <DragIndicatorIcon
                    style={{fontSize: "16px", color: "#9A9A96"}}
                  />
                </Flex>
                <Text color={"#1b1d16"} fontSize={14}>
                  {item?.label}
                </Text>
              </Flex>
              <Button
                _hover={{
                  background: "rgba(55, 53, 47, 0.09)",
                }}
                bg={"none"}
                w={"24px"}
                h={"24px"}
                border={"none"}>
                <RemoveRedEyeIcon
                  style={{color: "#53524C", width: "16px", height: "16px"}}
                />
              </Button>
            </Flex>
          </Draggable>
        ))}
      </Container>

      <Button
        mt={"5px"}
        h={"34px"}
        bg={"none"}
        border={"none"}
        color="#787774"
        fontSize={"14px"}
        _hover={{
          background: "rgba(55, 53, 47, 0.09)",
        }}>
        <AddIcon style={{width: "20px", height: "20px", marginRight: "4px"}} />
        <Text fontWeight={400}>Add Property</Text>
      </Button>
    </Box>
  );
};

export default PageSettings;
