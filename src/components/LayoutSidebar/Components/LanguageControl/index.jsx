import {Box, Button, Flex, Text} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import HFTextField from "../../../FormElements/HFTextField";
import { useSelector } from "react-redux";
import { getAllFromDB } from "../../../../utils/languageDB";
import HFTextFieldLanguage from "../../../FormElements/HFTextFieldLanguage";

function LanguageControl({ withHeader = true }) {
  const { control, handleSubmit, reset } = useForm();
  const languages = useSelector((state) => state.languages.list);

  const { fields } = useFieldArray({
    control,
    name: "translations",
  });

  const onSubmit = (values) => {
    console.log("Submitted values:", values);
  };

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        reset({ translations: formattedData });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {withHeader && <Header />}
      <Box h={"calc(100vh - 45px)"} overflow={"auto"} bg={"#fff"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <LanguageKey
              fields={fields}
              control={control}
              languages={languages}
            />
          </Box>
        </form>
      </Box>
    </>
  );
}

const Header = () => {
  const navigate = useNavigate();
  return (
    <Box
      position={"sticky"}
      top={0}
      zIndex={99}
      height={45}
      p={10}
      borderBottom={"1px solid #eee"}
      bg={"#fff"}
    >
      <Flex
        alignItems={"center"}
        fontSize={14}
        color={"#475467"}
        fontWeight={"500"}
      >
        <Button
          border="none"
          bg={"none"}
          cursor={"pointer"}
          w={50}
          _hover={{ bg: "#eee" }}
          borderRadius={6}
          h={25}
          mr={10}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </Button>
        Language control
      </Flex>
    </Box>
  );
};

const LanguageKey = ({ fields, control, languages }) => {
  return (
    <Box>
      <Flex position="sticky" top={0} zIndex={999} bg="white" mb={15}>
        <Box borderBottom="1px solid #eee" fontSize={12} w={300}></Box>
        <Flex
          w="100%"
          justifyContent="space-between"
          borderBottom="1px solid #eee"
          pt={10}
          pb={10}
        >
          {languages?.map((el) => (
            <Box key={el.slug} pl={10} fontSize={14} w="100%">
              {el?.slug.toUpperCase() ?? ""}
            </Box>
          ))}
        </Flex>
      </Flex>

      {fields?.map((categoryItem, categoryIndex) => (
        <Box key={categoryItem?.id} borderBottom="1px solid #eee" py={15}>
          <Text fontWeight="bold" ml={20} fontSize="14px">
            {categoryItem?.key}
          </Text>
          {categoryItem?.values.map((el, index) => (
            <CategoryLanguage
              categoryIndex={categoryIndex}
              key={el.id || index}
              index={index}
              field={el}
              control={control}
              languages={languages}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const CategoryLanguage = ({
  languages,
  control,
  categoryIndex,
  index,
  field,
}) => {
  return (
    <Flex
      minHeight={40}
      key={field.id}
      my={10}
      px={20}
      alignItems={"center"}
      overflowX={"auto"}>
      <Box fontSize={12} w={150}>
        {field.key}:
      </Box>
      <Flex w={"100%"} gap={10} justifyContent={"space-between"}>
        {languages?.map((item) => (
          <HFTextFieldLanguage
            key={`${field.id}-${item.slug}`}
            inputHeight={"20px"}
            name={`translations.${categoryIndex}.values.${index}.translations.${item.slug}`}
            control={control}
            field={field}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default LanguageControl;
