import {Box, Button, Flex} from "@chakra-ui/react";
import React, {useMemo} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";
import {useForm, useFieldArray} from "react-hook-form";
import HFTextField from "../../../FormElements/HFTextField";
import {useSelector} from "react-redux";
import {useProjectGetByIdQuery} from "../../../../services/projectService";

const staticData = [
  // MENU LANGUAGE ELEMENTS //
  {
    key: "Settings",
    translations: {
      uz: "Sozlamalar",
      ru: "Настройки",
      en: "Settings",
    },
  },
  {
    key: "Users",
    translations: {
      uz: "Foydanaluvchilar",
      ru: "Участники",
      en: "Users",
    },
  },
  {
    key: "Create",
    translations: {
      uz: "Yaratish",
      ru: "Создать",
      en: "Create",
    },
  },
  {
    key: "Files",
    translations: {
      uz: "Fayllar",
      ru: "Файлы",
      en: "Files",
    },
  },
  {
    key: "Languages",
    translations: {
      uz: "Tillar",
      ru: "Languages",
      en: "Languages",
    },
  },
  {
    key: "Logout",
    translations: {
      uz: "Logout",
      ru: "Logout",
      en: "Logout",
    },
  },

  {
    key: "Project Settings",
    translations: {
      uz: "Project Settings",
      ru: "Project Settings",
      en: "Project Settings",
    },
  },
  {
    key: "Permissions",
    translations: {
      uz: "Permissions",
      ru: "Permissions",
      en: "Permissions",
    },
  },
  {
    key: "Resources",
    translations: {
      uz: "Resurslar",
      ru: "Resources",
      en: "Resources",
    },
  },
  {
    key: "Code",
    translations: {
      uz: "Chqish",
      ru: "Code",
      en: "Code",
    },
  },
  {
    key: "Activity Logs",
    translations: {
      uz: "Activity Logs",
      ru: "Activity Logs",
      en: "Activity Logs",
    },
  },

  {
    key: "Environments",
    translations: {
      uz: "Chqish",
      ru: "Выйти",
      en: "Environments",
    },
  },
  {
    key: "Versions",
    translations: {
      uz: "Versiyalar",
      ru: "Versions",
      en: "Versions",
    },
  },
  {
    key: "Language Control",
    translations: {
      uz: "Tilni Boshqarish",
      ru: "Language Control",
      en: "Language Control",
    },
  },

  {
    key: "Functions",
    translations: {
      uz: "Funksiyalar",
      ru: "Functions",
      en: "Functions",
    },
  },
  {
    key: "Microfrontend",
    translations: {
      uz: "Microfrontend",
      ru: "Microfrontend",
      en: "Microfrontend",
    },
  },
  {
    key: "Upload ERD",
    translations: {
      uz: "Upload ERD",
      ru: "Upload ERD",
      en: "Upload ERD",
    },
  },

  {
    key: "Data",
    translations: {
      uz: "Data",
      ru: "Data",
      en: "Data",
    },
  },
  {
    key: "Models",
    translations: {
      uz: "Models",
      ru: "Models",
      en: "Models",
    },
  },

  //   TABLE LANGUAGE ELEMENTS //
  {
    key: "Name",
    translations: {
      uz: "Ism",
      ru: "Name",
      en: "Name",
    },
  },
  {
    key: "Language",
    translations: {
      uz: "Til",
      ru: "Language",
      en: "Language",
    },
  },
  {
    key: "Currency",
    translations: {
      uz: "Currency",
      ru: "Currency",
      en: "Currency",
    },
  },
  {
    key: "Timezone",
    translations: {
      uz: "Timezone",
      ru: "Timezone",
      en: "Timezone",
    },
  },
  {
    key: "Description",
    translations: {
      uz: "Description",
      ru: "Description",
      en: "Description",
    },
  },
  {
    key: "Add",
    translations: {
      uz: "Qoshish",
      ru: "Add",
      en: "Add",
    },
  },

  // CLIENT TYPE CREATE //
  {
    key: "Create folder",
    translations: {
      uz: "Papka qoshish",
      ru: "Create folder",
      en: "Create folder",
    },
  },
  {
    key: "Title",
    translations: {
      uz: "Title",
      ru: "Title",
      en: "Title",
    },
  },

  {
    key: "Default page link",
    translations: {
      uz: "Default page link",
      ru: "Default page link",
      en: "Default page link",
    },
  },
  {
    key: "Self recover",
    translations: {
      uz: "Self recover",
      ru: "Self recover",
      en: "Self recover",
    },
  },
  {
    key: "Self register",
    translations: {
      uz: "Self register",
      ru: "Self register",
      en: "Self register",
    },
  },
  {
    key: "Table",
    translations: {
      uz: "Table",
      ru: "Table",
      en: "Table",
    },
  },
  {
    key: "Session limit",
    translations: {
      uz: "Session limit",
      ru: "Session limit",
      en: "Session limit",
    },
  },
  {
    key: "Matrix Details",
    translations: {
      uz: "Matrix Details",
      ru: "Matrix Details",
      en: "Matrix Details",
    },
  },
  {
    key: "Role",
    translations: {
      uz: "Role",
      ru: "Role",
      en: "Role",
    },
  },
  {
    key: "Connection",
    translations: {
      uz: "Connection",
      ru: "Connection",
      en: "Connection",
    },
  },
  {
    key: "View slug",
    translations: {
      uz: "View slug",
      ru: "View slug",
      en: "View slug",
    },
  },
  {
    key: "Table slug",
    translations: {
      uz: "Table slug",
      ru: "Table slug",
      en: "Table slug",
    },
  },
];

function LanguageControl() {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      translations: staticData,
    },
  });

  const {fields} = useFieldArray({
    control,
    name: "translations",
  });

  const projectId = useSelector((state) => state.company.projectId);
  const {data: projectInfo = []} = useProjectGetByIdQuery({projectId});

  const languages = useMemo(() => {
    return projectInfo?.language?.map((lang) => ({
      title: lang?.name,
      slug: lang?.short_name,
    }));
  }, [projectInfo]);

  const onSubmit = (values) => {
    console.log("Submitted values:", values);
  };

  return (
    <>
      <Header />
      <Box h={"calc(100vh - 45px)"} overflow={"auto"} bg={"#fff"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <LanguageKey
              fields={fields}
              control={control}
              languages={languages}
            />
          </Box>
          {/* <Button type="submit" mt={4}>
            Save
          </Button> */}
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
      bg={"#fff"}>
      <Flex
        alignItems={"center"}
        fontSize={14}
        color={"#475467"}
        fontWeight={"500"}>
        <Button
          border="none"
          bg={"none"}
          cursor={"pointer"}
          w={50}
          _hover={{bg: "#eee"}}
          borderRadius={6}
          h={25}
          mr={10}
          onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </Button>
        Language control
      </Flex>
    </Box>
  );
};

const LanguageKey = ({fields, control, languages}) => {
  return (
    <Box>
      <Flex position={"sticky"} top={0} zIndex={999} bg={"white"} mb={15}>
        <Box borderBottom={"1px solid #eee"} fontSize={12} w={300}></Box>
        <Flex
          w={"100%"}
          justifyContent={"space-between"}
          borderBottom={"1px solid #eee"}
          pt={10}
          pb={10}>
          {languages?.map((el) => (
            <Box key={el.slug} pl={10} fontSize={14} w={"100%"}>
              {el?.title ?? ""}
            </Box>
          ))}
        </Flex>
      </Flex>
      {fields.map((field, index) => (
        <Flex
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
              <HFTextField
                key={`${field.id}-${item.slug}`}
                inputHeight={"20px"}
                name={`translations.${index}.translations.${item.slug}`}
                control={control}
              />
            ))}
          </Flex>
        </Flex>
      ))}
    </Box>
  );
};

export default LanguageControl;
