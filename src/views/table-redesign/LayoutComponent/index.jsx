import {ChevronRightIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {default as InlineSVG, default as SVG} from "react-inlinesvg";
import ViewSettings from "../../Objects/components/ViewSettings";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import LayoutModal from "./LayoutModal";

function LayoutComponent({
  selectedView,
  tableInfo = {},
  tableLan = {},
  isChanged = false,
  viewSetting = false,
  selectedTabIndex = 0,
  refetchViews = () => {},
  setIsChanged = () => {},
}) {
  const {i18n} = useTranslation();
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
        columnGap="8px"
        alignItems="center"
        borderRadius={6}
        // _hover={{bg: "#EAECF0"}}
        cursor="pointer"
        onClick={onOpen}>
        {viewSetting ? (
          <>
            <Button
              width={"18px"}
              p={"0 0"}
              color={"#000"}
              bg={"none"}
              h={"24px"}
              _hover={{
                bg: "#edf2f6",
              }}>
              <MoreHorizIcon />
            </Button>
          </>
        ) : (
          <>
            <Flex
              minW="36px"
              h="28px"
              alignItems="center"
              justifyContent="center">
              <SVG src={`/img/file-download.svg`} width={20} height={20} />
            </Flex>
            <ViewOptionTitle>
              {generateLangaugeText(tableLan, i18n?.language, "Layout") ||
                "Layout"}
            </ViewOptionTitle>
            <ChevronRightIcon ml="auto" fontSize={22} />
          </>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent zIndex={2} minW="802px" w="802px">
          <MaterialUIProvider>
            <LayoutModal
              tableInfo={tableInfo}
              tableLan={tableLan}
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

const ViewOptionTitle = ({children}) => (
  <Box color="#475467" fontWeight={500} fontSize={14}>
    {children}
  </Box>
);

export default LayoutComponent;
