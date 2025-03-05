import {Box, Button, Flex, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import {Container} from "react-smooth-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Menu, MenuItem} from "@mui/material";
import SouthIcon from "@mui/icons-material/South";

function LayoutSections() {
  const [selectedSection, setSelectedSection] = useState();
  return (
    <Flex>
      <Box w={"65%"} h={"calc(100vh - 60px)"} borderRight={"1px solid #E2EDFB"}>
        <Box pt={24} px={20}>
          <LayoutHeading
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
          {/* 
          <Container>
            
          </Container> */}
          <MainSection
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
        </Box>
      </Box>
      <Box w={"35%"}></Box>
    </Flex>
  );
}

const LayoutHeading = ({selectedSection, setSelectedSection}) => {
  return (
    <Box
      onClick={() => setSelectedSection(0)}
      cursor={"pointer"}
      outline={
        selectedSection === 0
          ? "3px solid rgb(35, 131, 226)"
          : "1px solid #E2EDFB"
      }
      _hover={{
        outline:
          selectedSection === 0
            ? "3px solid rgb(35, 131, 226)"
            : "2px solid #d2e4fb",
      }}
      borderRadius={8}
      h={220}>
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
          (Layout) Input fields need to be disabled
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

const MainSection = ({selectedSection, setSelectedSection, index = 1}) => {
  return (
    <Box my={20}>
      <Box
        onClick={() => setSelectedSection(index)}
        cursor={"pointer"}
        outline={
          selectedSection === 1
            ? "3px solid rgb(35, 131, 226)"
            : "1px solid #E2EDFB"
        }
        _hover={{
          outline:
            selectedSection === 1
              ? "3px solid rgb(35, 131, 226)"
              : "2px solid #d2e4fb",
        }}
        borderRadius={8}
        minH={220}>
        <Flex
          p={8}
          h={32}
          gap={2}
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
              Section Name
            </Text>
          </Button>
          <PositionUpDown />
        </Flex>
      </Box>
    </Box>
  );
};

const PositionUpDown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
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
            width: "18px",
            height: "18px",
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
          <Flex w={170}>
            <SouthIcon style={{width: "16px", height: "16px"}} />
            Move down
          </Flex>
          <Flex>
            <SouthIcon />
            Move down
          </Flex>
        </Box>
      </Menu>
    </>
  );
};

export default LayoutSections;
