import React, {useState} from "react";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import TuneIcon from "@mui/icons-material/Tune";
import DoneIcon from "@mui/icons-material/Done";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ClearIcon from "@mui/icons-material/Clear";
import LayoutSections from "./LayoutSections";
import PageSettings from "./PageSettings";
import {useLocation, useParams} from "react-router-dom";
import {useQuery} from "react-query";
import layoutService from "../../../services/layoutService";

function LayoutSettings() {
  const location = useLocation();
  const {tableSlug, appId} = useParams();
  const [sectionIndex, setSectionIndex] = useState();
  const [selectedSection, setSelectedSection] = useState();
  const [sections, setSections] = useState();
  const selectedRow = location?.state;

  const {
    data: {layout} = {
      layout: [],
    },
  } = useQuery({
    queryKey: [
      "GET_LAYOUT",
      {
        tableSlug,
      },
    ],
    queryFn: () => {
      return layoutService.getLayout(tableSlug, appId);
    },
    select: (data) => {
      return {
        layout: data ?? {},
      };
    },
    onError: (error) => {
      console.error("Error", error);
    },
    onSuccess: (data) => {
      setSections(data?.layout?.tabs?.[0]?.sections);
    },
  });

  const updateSectionFields = (newFields) => {
    const updatedSection = sections.map((section, index) =>
      index === sectionIndex ? {...section, fields: newFields} : section
    );

    setSections(updatedSection);
  };

  const applyAllChanges = () => {
    console.log("layoutttttttttt");
  };

  return (
    <Box bg={"#F8F8F7"}>
      <Header />

      <Flex pl={24}>
        <Box
          boxShadow={"rgba(15, 15, 15, 0.1) 0px 9px 12px 0px"}
          h={"calc(100vh - 60px)"}
          w={"77%"}
          borderRadius={12}
          borderBottomRadius={0}
          bg={"#fff"}>
          <LayoutSections
            sections={sections}
            setSections={setSections}
            selectedRow={selectedRow}
            sectionIndex={sectionIndex}
            setSectionIndex={setSectionIndex}
            setSelectedSection={setSelectedSection}
          />
        </Box>

        <Box width={"290px"}>
          <PageSettings
            updateSectionFields={updateSectionFields}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </Box>
      </Flex>
    </Box>
  );
}

const Header = () => {
  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} h={60} px={20}>
      <Button
        border={"none"}
        bg={"none"}
        _hover={{
          background: "rgba(55, 53, 47, 0.09)",
        }}
        px={6}
        py={3}
        borderRadius={6}
        cursor={"pointer"}>
        <Flex gap={6} alignItems={"center"}>
          <TuneIcon style={{color: "#54524D", height: "18px", width: "18px"}} />
          <Text fontSize={14}>Page settings</Text>
        </Flex>
      </Button>

      <Box>
        <Flex justifyContent={"center"} gap={6} alignItems={"center"}>
          <TextSnippetIcon style={{color: "#787774"}} />
          <Text fontSize={16}>Ucode</Text>
        </Flex>
        <Button
          border={"none"}
          bg={"none"}
          _hover={{
            background: "rgba(55, 53, 47, 0.06)",
          }}
          px={6}
          py={3}
          borderRadius={6}
          cursor={"pointer"}>
          <Text fontSize={12} color={"#787774"}>
            Preview: (Layout) Input fields need to be disabled{" "}
          </Text>
        </Button>
      </Box>

      <Flex gap={8}>
        <Button
          cursor={"pointer"}
          borderRadius={6}
          border={"none"}
          h={32}
          p={"0 12px 0 10px"}
          fontSize={14}>
          <Flex mr={6}>
            <ClearIcon />
          </Flex>
          Cancel
        </Button>
        <Button
          borderRadius={6}
          border={"none"}
          bg={"#2383e2"}
          h={32}
          px={"8px"}
          color={"#fff"}
          cursor={"pointer"}
          fontSize={14}>
          <Flex mr={6}>
            <DoneIcon style={{width: "14px", height: "14px"}} />
          </Flex>
          Apply to all changes
        </Button>
      </Flex>
    </Flex>
  );
};

export default LayoutSettings;
