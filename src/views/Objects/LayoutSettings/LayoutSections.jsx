import {Box, Button, Flex, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import {Container, Draggable} from "react-smooth-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Dialog, Menu} from "@mui/material";
import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import FieldGenerator from "./FieldGenerator";
import {applyDrag} from "../../../utils/applyDrag";
import AddIcon from "@mui/icons-material/Add";
import {generateID} from "../../../utils/generateID";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function LayoutSections({
  selectedTab,
  selectedRow,
  sections,
  sectionIndex,
  setSections = () => {},
  setSectionIndex = () => {},
  setSelectedSection = () => {},
}) {
  const onDrop = (dropResult) => {
    const newSections = applyDrag(sections, dropResult);
    setSections(newSections);
  };

  const addSections = () => {
    const updatedSections = [...sections, {id: generateID(), fields: []}];
    setSections(updatedSections);
  };

  return (
    <Flex>
      <Box
        pb={20}
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
        w={"65%"}
        h={"calc(100vh - 60px)"}
        overflow={"auto"}
        borderRight={"1px solid #E2EDFB"}>
        <Box pt={24} px={20}>
          <LayoutHeading
            selectedTab={selectedTab}
            selectedRow={selectedRow}
            sectionIndex={sectionIndex}
            setSectionIndex={setSectionIndex}
            setSelectedSection={setSelectedSection}
          />

          <Container onDrop={onDrop} behaviour="contain">
            {sections?.map((section, sectIndex) => (
              <Draggable
                style={{width: "100%", overflow: "auto"}}
                key={section?.id}>
                <MainSection
                  setSections={setSections}
                  sections={sections}
                  selectedRow={selectedRow}
                  index={sectIndex}
                  section={section}
                  sectionIndex={sectionIndex}
                  setSectionIndex={setSectionIndex}
                  setSelectedSection={setSelectedSection}
                />
              </Draggable>
            ))}
          </Container>

          <Box mt={20} w={"100%"} textAlign={"center"}>
            <Button
              onClick={addSections}
              w={32}
              h={32}
              mx={"0 auto"}
              borderRadius={"50%"}
              bg={"rgba(35, 131, 226, 0.07)"}>
              <AddIcon style={{color: "#2383E2"}} />
            </Button>
          </Box>
        </Box>
      </Box>
      <Box w={"35%"}></Box>
    </Flex>
  );
}

const LayoutHeading = ({
  selectedTab,
  selectedRow,
  sectionIndex,
  setSectionIndex = () => {},
  setSelectedSection = () => {},
}) => {
  return (
    <Box
      onClick={() => {
        setSelectedSection({fields: [], label: "Heading"});
        setSectionIndex(101);
      }}
      cursor={"pointer"}
      width={"99%"}
      mx={"auto"}
      mb={"10px"}
      outline={
        sectionIndex === 101
          ? "3px solid rgb(35, 131, 226)"
          : "1px solid #E2EDFB"
      }
      _hover={{
        outline:
          sectionIndex === 101
            ? "3px solid rgb(35, 131, 226)"
            : "2px solid #d2e4fb",
      }}
      borderRadius={8}
      minH={150}
      maxH={250}>
      <Flex
        p={8}
        alignItems={"center"}
        h={32}
        color="rgb(35, 131, 226)"
        fontWeight={500}
        fontSize={14}
        bg={"rgba(35, 131, 226, 0.07)"}>
        Heading
      </Flex>
      <Box pt={15} px={12}>
        <Button my={5} border={"none"} bg={"none"} cursor={"pointer"}>
          <SouthWestIcon style={{color: "#C7C5C0"}} />
          <Text color={"#C7C5C0"} fontSize={14}>
            No backlinks
          </Text>
        </Button>

        <Text fontSize={34} fontWeight={700}>
          {selectedRow?.[selectedTab?.attributes?.layout_heading] ?? ""}
          {/* (Layout) Input fields need to be disabled */}
        </Text>

        <Button
          h={32}
          fontSize={14}
          fontWeight={400}
          color={"#787774"}
          bg={"none"}
          border={"none"}>
          View details
        </Button>
      </Box>
    </Box>
  );
};

const MainSection = ({
  sections,
  sectionIndex,
  index,
  section,
  selectedRow,
  setSections = () => {},
  setSectionIndex = () => {},
  setSelectedSection = () => {},
}) => {
  const removeSection = (sectionIndex) => {
    const updatedSection = sections?.filter(
      (_, index) => index !== sectionIndex
    );
    setSections(updatedSection);
  };
  return (
    <Box bg={"#fff"} w={"99%"} my={"10px"} mx={"auto"}>
      <Box
        onClick={() => {
          setSelectedSection(section);
          setSectionIndex(index);
        }}
        cursor={"pointer"}
        outline={
          sectionIndex === index
            ? "3px solid rgb(35, 131, 226)"
            : "1px solid #E2EDFB"
        }
        _hover={{
          outline:
            sectionIndex === index
              ? "3px solid rgb(35, 131, 226)"
              : "2px solid #d2e4fb",
        }}
        borderRadius={8}
        minH={220}>
        <Flex
          p={8}
          h={32}
          gap={3}
          fontSize={14}
          fontWeight={500}
          alignItems={"center"}
          justifyContent={"space-between"}
          bg={"rgba(35, 131, 226, 0.07)"}>
          <Button cursor={"grab"} bg={"none"} border="none">
            <DragIndicatorIcon
              style={{
                color: "rgb(35, 131, 226)",
                width: "18px",
                height: "18px",
              }}
            />
            <Text fontSize={14} color="rgb(35, 131, 226)">
              Section {index + 1}
            </Text>
          </Button>
          <PositionUpDown index={index} removeSection={removeSection} />
        </Flex>
        <Box p={15}>
          {section?.fields
            ?.filter((el) => !el?.attributes?.field_hide_layout)
            ?.map((field) => (
              <FieldGenerator field={field} selectedRow={selectedRow} />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

const PositionUpDown = ({index, removeSection = () => {}}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOpen = () => {
    handleClose();
    setOpenDialog(true);
  };
  const onCloseDialog = () => setOpenDialog(false);
  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        _hover={{
          background: "#2383E224",
        }}
        p={3}
        borderRadius={4}
        cursor={"pointer"}
        bg={"none"}
        border={"none"}>
        <MoreHorizIcon
          style={{
            color: "rgb(35, 131, 226)",
            width: "22px",
            height: "22px",
          }}
        />
      </Button>

      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}>
        <Box p={4}>
          <Flex
            borderRadius={6}
            _hover={{
              background: "rgba(55, 53, 47, 0.06)",
            }}
            alignItems={"center"}
            px={8}
            gap={10}
            h={28}
            w={170}
            cursor={"pointer"}>
            <SouthIcon style={{width: "14px", height: "16px"}} />
            <Text fontSize={14}> Move down</Text>
          </Flex>
          <Flex
            borderRadius={6}
            _hover={{
              background: "rgba(55, 53, 47, 0.06)",
            }}
            alignItems={"center"}
            px={8}
            gap={10}
            h={28}
            cursor={"pointer"}>
            <EastIcon style={{width: "14px", height: "16px"}} />
            <Text fontSize={14}> Move to panel</Text>
          </Flex>

          <Flex
            onClick={handleOpen}
            borderRadius={6}
            _hover={{
              background: "rgba(55, 53, 47, 0.06)",
              color: "red",
            }}
            alignItems={"center"}
            px={8}
            gap={10}
            h={28}
            cursor={"pointer"}>
            <DeleteOutlineIcon style={{width: "16px", height: "16px"}} />
            <Text fontSize={14}> Delete section</Text>
          </Flex>
        </Box>
      </Menu>

      <Dialog open={openDialog} onClose={onCloseDialog}>
        <Box w={"400px"} height={"200px"} p={15}>
          <Flex textAlign={"center"} flexDirection={"column"}>
            <DeleteOutlineIcon
              style={{fontSize: "50px", margin: "0 auto", color: "#91908F"}}
            />
            <Text fontSize={"16px"}>Remove property from layout?</Text>
          </Flex>

          <Flex
            mt={20}
            w={"100%"}
            flexDirection={"column"}
            justifyContent={"space-between"}>
            <Button
              onClick={() => {
                removeSection(index);
                onCloseDialog();
              }}
              fontSize={14}
              borderRadius={6}
              color={"#fff"}
              h={32}
              bg={"#EB5756"}>
              Remove
            </Button>
            <Button
              onClick={onCloseDialog}
              borderRadius={6}
              mt={8}
              fontSize={14}
              border="1px solid rgba(55, 53, 47, 0.16)"
              h={32}>
              Cancel
            </Button>
          </Flex>
        </Box>
      </Dialog>
    </>
  );
};

export default LayoutSections;
