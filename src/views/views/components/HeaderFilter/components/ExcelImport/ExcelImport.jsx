import { FileDownloadIcon } from "@/utils/constants/icons";
import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ViewOptionTitle } from "../../../ViewOptionTitle";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { ExcelUploadModal } from "../../../ExcelUploadModal";

export const ExcelImport = ({ fieldsMap, tableLan, tableSlug }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { i18n } = useTranslation();
  return (
    <>
      <Flex
        p="8px"
        h="32px"
        columnGap="4px"
        alignItems="center"
        borderRadius={6}
        _hover={{ bg: "#EAECF0" }}
        cursor="pointer"
        onClick={onOpen}
      >
        <FileDownloadIcon />
        <ViewOptionTitle>
          {generateLangaugeText(tableLan, i18n?.language, "Import") || "Import"}
        </ViewOptionTitle>
        <ChevronRightIcon ml="auto" fontSize={18} color="#D0D5DD" />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent zIndex={2} minW="602px" w="602px">
          <ExcelUploadModal
            fieldsMap={fieldsMap}
            handleClose={onClose}
            tableSlug={tableSlug}
          />
        </ModalContent>
      </Modal>
    </>
  );
};