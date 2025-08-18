import {Box, ChakraProvider, Flex, Text} from "@chakra-ui/react";
import TranslateIcon from "@mui/icons-material/Translate";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {languagesActions} from "../../../../store/globalLanguages/globalLanguages.slice";
import {useProjectGetByIdQuery} from "../../../../services/projectService";
import {store} from "../../../../store";

function Language({languageOptions = []}) {
  const dispatch = useDispatch();
  const {i18n} = useTranslation();
  const [currentLangIndex, setCurrentLangIndex] = useState(0);

  const projectId = store.getState().company.projectId;
  const {data: projectInfo} = useProjectGetByIdQuery({projectId});
  const languages = projectInfo?.language;
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(languagesActions.setDefaultLanguage(lang));
    localStorage.setItem("defaultLanguage", lang);
  };

  const handleClick = () => {
    if (!languages?.length) return;

    const nextIndex = (currentLangIndex + 1) % languages.length;
    setCurrentLangIndex(nextIndex);
    changeLanguage(languages[nextIndex]?.short_name);
  };

  return (
    <ChakraProvider>
      <Flex
        align="center"
        justify="center"
        gap={2}
        px={3}
        py={1.5}
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="8px"
        cursor="pointer"
        h={"36px"}
        mr={"20px"}
        _hover={{
          bg: "gray.50",
          boxShadow: "md",
          transform: "scale(1.05)",
          transition: "all 0.2s ease-in-out",
        }}
        onClick={handleClick}
        w="fit-content"
        boxShadow="sm"
        transition="all 0.15s ease-in-out">
        <Box as={TranslateIcon} fontSize="20px" color="gray.600" />
        <Text fontWeight="medium" color="gray.700" fontSize="sm">
          {languages?.[currentLangIndex]?.short_name.toUpperCase()}
        </Text>
      </Flex>
    </ChakraProvider>
  );
}

export default Language;
