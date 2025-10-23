import {ChevronRightIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import MaterialUIProvider from "@/providers/MaterialUIProvider";
import {generateLangaugeText} from "@/utils/generateLanguageText";
import { FileDownloadIcon } from "@/utils/constants/icons";
import { ViewSettings } from "./components/ViewSettings";

export const ViewSettingsModal = ({
  selectedView,
  tableLan = {},
  isChanged = false,
  viewSetting = false,
  selectedTabIndex = 0,
  refetchViews = () => {},
  setIsChanged = () => {},
}) => {
  const { i18n } = useTranslation();
  const [typeNewView, setTypeNewView] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsChanged(false);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setIsChanged(false);
  };

  return (
    <>
      <Flex
        h="32px"
        columnGap="4px"
        alignItems="center"
        borderRadius={6}
        // _hover={{bg: "#EAECF0"}}
        cursor="pointer"
        onClick={onOpen}
        padding="6px 8px"
        _hover={{
          bg: "#F2F4F7",
        }}
      >
        {viewSetting ? (
          <>
            <Button
              width={"18px"}
              p={"0 0"}
              color={"#000"}
              bg={"none"}
              h={"24px"}
            >
              <MoreHorizIcon />
            </Button>
          </>
        ) : (
          <>
            <Flex
              // minW="36px"
              // h="28px"
              alignItems="center"
              justifyContent="center"
            >
              <FileDownloadIcon />
            </Flex>
            <ViewOptionTitle>
              {generateLangaugeText(tableLan, i18n?.language, "View") || "View"}
            </ViewOptionTitle>
            <ChevronRightIcon ml="auto" fontSize={18} color="#D0D5DD" />
          </>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent zIndex={2} minW={"470px"}>
          <MaterialUIProvider>
            <ViewSettings
              refetchMainView={refetchViews}
              selectedTabIndex={selectedTabIndex}
              closeModal={onClose}
              isChanged={isChanged}
              setIsChanged={setIsChanged}
              viewData={selectedView}
              typeNewView={typeNewView}
              selectedView={selectedView}
            />
          </MaterialUIProvider>
        </ModalContent>
      </Modal>
    </>
  );
}

const ViewOptionTitle = ({ children }) => (
  <Box color="#101828" fontWeight={400} fontSize={14}>
    {children}
  </Box>
);

