import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import {ChevronRightIcon} from "@chakra-ui/icons";
import DrawerFormDetailPage from "./DrawerFormDetailPage";
import {useParams} from "react-router-dom";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

function DrawerDetailPage({
  open,
  setOpen,
  selectedRow,
  menuItem,
  layout,
  fieldsMap,
  refetch,
  dateInfo = {},
  fullScreen = false,
  setFullScreen = () => {},
}) {
  const {tableSlug} = useParams();
  const handleClose = () => setOpen(false);

  return (
    <Drawer isOpen={open} placement="right" onClose={handleClose} size="md">
      <Box position={"relative"} zIndex={9} bg={"red"} maxW="650px">
        <DrawerContent
          boxShadow="
        rgba(15, 15, 15, 0.04) 0px 0px 0px 1px,
        rgba(15, 15, 15, 0.03) 0px 3px 6px,
        rgba(15, 15, 15, 0.06) 0px 9px 24px
      "
          zIndex={9}
          bg={"white"}
          maxW="650px">
          <DrawerHeader px="12px" bg="white">
            <Flex h={"44px"} align="center" justify="space-between">
              <Box
                onClick={handleClose}
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="24px"
                height="24px">
                <KeyboardDoubleArrowRightIcon w={6} h={6} />
              </Box>
            </Flex>
          </DrawerHeader>

          <DrawerBody p="0px 50px" overflow={"auto"}>
            <DrawerFormDetailPage
              menuItem={menuItem}
              layout={layout}
              selectedRow={selectedRow}
              tableSlugFromProps={tableSlug}
              handleClose={handleClose}
              modal={true}
              dateInfo={dateInfo}
              setFullScreen={setFullScreen}
              fullScreen={fullScreen}
              fieldsMap={fieldsMap}
              refetch={refetch}
            />
          </DrawerBody>
        </DrawerContent>
      </Box>
    </Drawer>
  );
}

export default DrawerDetailPage;
