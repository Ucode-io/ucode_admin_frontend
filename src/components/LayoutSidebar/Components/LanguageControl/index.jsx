import {Box, Button, Flex} from "@chakra-ui/react";
import React, {useMemo} from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";
import {useForm, useFieldArray} from "react-hook-form";
import HFTextField from "../../../FormElements/HFTextField";
import {useSelector} from "react-redux";
import {useProjectGetByIdQuery} from "../../../../services/projectService";
import {staticData} from "./mockData";

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
