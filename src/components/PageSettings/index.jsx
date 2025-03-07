import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import React, {useEffect, useMemo, useState} from "react";
import "./style.scss";
import chakraUITheme from "@/theme/chakraUITheme";
import {Container, Draggable} from "react-smooth-dnd";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddIcon from "@mui/icons-material/Add";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {Menu} from "@mui/material";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import constructorTableService from "../../services/constructorTableService";
import {getColumnIcon} from "../../views/table-redesign/icons";
import {useTranslation} from "react-i18next";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {applyDrag} from "../../utils/applyDrag";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function PageSettings({
  selectedSection,
  setSections = () => {},
  updateSectionFields = () => {},
  setSelectedSection = () => {},
}) {
  const [sectionSearch, setSectionSearch] = useState("");

  return (
    <>
      <Box px={"20px"} pt={5}>
        <Text mb={"10px"} fontSize={16} fontWeight={500}>
          {selectedSection
            ? (selectedSection?.label ?? `Section`)
            : "Property group"}
        </Text>
        <SearchInput onChange={setSectionSearch} paddingLeft="35px" />
      </Box>

      <SettingFields
        sectionSearch={sectionSearch}
        setSelectedSection={setSelectedSection}
        setSections={setSections}
        updateSectionFields={updateSectionFields}
        selectedSection={selectedSection}
      />
    </>
  );
}

const SettingFields = ({
  sectionSearch = "",
  selectedSection,
  updateSectionFields = () => {},
  setSelectedSection = () => {},
}) => {
  const [sectionFields, setSectionFields] = useState(selectedSection?.fields);
  const [dragAction, setDragAction] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const {tableSlug} = useParams();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const {
    data: {fields} = {
      fields: [],
    },
  } = useQuery({
    queryKey: ["GET_TABLE_INFO", tableSlug],
    queryFn: () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    enabled: Boolean(tableSlug),
    select: (res) => {
      return {
        fields: res?.data?.fields ?? [],
      };
    },
  });

  const computedFieldsList = useMemo(() => {
    if (!fields || !sectionFields) return [];

    return fields.filter(
      (field) =>
        !sectionFields.some((sectionField) => sectionField.slug === field.slug)
    );
  }, [fields, sectionFields, selectedSection]);

  const onDrop = (dropResult) => {
    const result = applyDrag(sectionFields, dropResult);
    updateSectionFields(result);
    setSectionFields(result);
  };

  const addFieldSections = (field) => {
    const updatedSection = [...selectedSection?.fields, field];
    setSelectedSection({...selectedSection, fields: updatedSection});
    updateSectionFields(updatedSection);
  };

  const toggleFieldVisibility = (fieldSlug) => {
    if (!selectedSection?.fields) return;

    const updatedFields = selectedSection.fields.map((field) =>
      field.slug === fieldSlug
        ? {
            ...field,
            attributes: {
              ...field.attributes,
              field_hide_layout: !field.attributes?.field_hide_layout,
            },
          }
        : field
    );

    setSelectedSection({...selectedSection, fields: updatedFields});
    updateSectionFields(updatedFields);
  };

  const removeFieldFromSection = (fieldSlug) => {
    if (!selectedSection?.fields) return;

    const updatedFields = selectedSection.fields.filter(
      (field) => field?.slug !== fieldSlug
    );

    setSelectedSection({...selectedSection, fields: updatedFields});
    updateSectionFields(updatedFields);
  };

  useEffect(() => {
    setSectionFields(selectedSection?.fields);
  }, [selectedSection]);

  return (
    <Box mt={"25px"} h={"calc(100vh - 160px)"} pb={5} overflow={"auto"} px={15}>
      <Container
        behaviour="contain"
        onDrop={onDrop}
        onDragStart={() => setDragAction(true)}
        onDragEnd={() => setDragAction(false)}
        dragClass="field-drag">
        {sectionFields
          ?.filter((el) =>
            el?.label?.toLowerCase()?.includes(sectionSearch?.toLowerCase())
          )
          ?.map((item) => (
            <Draggable>
              <Flex
                cursor={"pointer"}
                alignItems={"center"}
                justifyContent={"space-between"}>
                <Flex
                  className={dragAction ? "fieldRowDrag" : "fieldRow"}
                  _hover={{
                    background: "rgba(55, 53, 47, 0.09)",
                  }}
                  w={"230px"}
                  gap={"5px"}
                  my={"3px"}
                  px={"6px"}
                  h={"33px"}
                  alignItems={"center"}
                  borderRadius={"4px"}>
                  <Flex className={"fieldIcon"}>
                    {getColumnIcon({
                      column: {
                        type: item?.type ?? item?.relation_type,
                        table_slug: "regulart",
                      },
                    })}
                  </Flex>
                  <Flex
                    className="fieldDragIcon"
                    w={"20px"}
                    h={"20px"}
                    alignItems={"center"}>
                    <DragIndicatorIcon
                      style={{fontSize: "16px", color: "#9A9A96"}}
                    />
                  </Flex>
                  <Text color={"#1b1d16"} fontSize={14}>
                    {item?.label}
                  </Text>
                </Flex>
                <FieldControl
                  removeFieldFromSection={removeFieldFromSection}
                  toggleFieldVisibility={toggleFieldVisibility}
                  item={item}
                />
              </Flex>
            </Draggable>
          ))}
      </Container>

      <Button
        onClick={handleClick}
        mt={"5px"}
        h={"34px"}
        bg={"none"}
        border={"none"}
        px={5}
        color="#787774"
        borderRadius={6}
        fontSize={"14px"}
        _hover={{
          background: "rgba(55, 53, 47, 0.09)",
        }}>
        <AddIcon style={{width: "20px", height: "20px", marginRight: "4px"}} />
        <Text fontWeight={400}>Add Property</Text>
      </Button>

      <FieldsList
        addFieldSections={addFieldSections}
        fields={computedFieldsList}
        anchorEl={anchorEl}
        handleClose={handleClose}
      />
    </Box>
  );
};

const FieldControl = ({
  removeFieldFromSection = () => {},
  toggleFieldVisibility = () => {},
  item,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        onClick={(e) => handleClick(e)}
        _hover={{
          background: "rgba(55, 53, 47, 0.09)",
        }}
        bg={"none"}
        w={"24px"}
        h={"24px"}
        borderRadius={4}
        border={"none"}>
        {item?.attributes?.field_hide_layout ? (
          <VisibilityOffIcon
            style={{color: "#53524C", width: "16px", height: "16px"}}
          />
        ) : (
          <RemoveRedEyeIcon
            style={{color: "#53524C", width: "16px", height: "16px"}}
          />
        )}
      </Button>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
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
            onClick={() => {
              toggleFieldVisibility(item.slug);
              handleClose();
            }}
            cursor={"pointer"}>
            {!item?.attributes?.field_hide_layout ? (
              <VisibilityOffIcon
                style={{color: "#53524C", width: "16px", height: "16px"}}
              />
            ) : (
              <RemoveRedEyeIcon
                style={{color: "#53524C", width: "16px", height: "16px"}}
              />
            )}
            <Text fontSize={14}>
              {item?.attributes?.field_hide_layout ? "Show" : "Hide"}
            </Text>
          </Flex>
          <Flex
            onClick={() => {
              removeFieldFromSection(item.slug);
              handleClose();
            }}
            borderRadius={6}
            _hover={{
              background: "rgba(55, 53, 47, 0.06)",
            }}
            alignItems={"center"}
            px={8}
            gap={10}
            h={28}
            cursor={"pointer"}>
            <DeleteOutlineIcon
              style={{color: "#53524C", width: "18px", height: "18px"}}
            />
            <Text fontSize={14}>Delete</Text>
          </Flex>
        </Box>
      </Menu>
    </>
  );
};

const FieldsList = ({
  anchorEl,
  handleClose = () => {},
  addFieldSections,
  fields,
}) => {
  const open = Boolean(anchorEl);
  const {i18n} = useTranslation();
  const [search, setSearch] = useState("");

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
      <Box
        border={"1px solid #E6E6E4"}
        w={"280px"}
        pb={"8px"}
        borderRadius={"10px"}
        minH={"100px"}
        maxH={"600px"}
        overflow={"auto"}>
        <Box p={"8px 12px"}>
          <SearchInput
            onChange={setSearch}
            placeholder="Search or add new property"
            searchIcon={false}
            paddingLeft={"10px"}
          />
        </Box>

        <Box p={"0 10px"}>
          <Text color={"#37352fa6"} fontSize={"12px"} h={"28px"}>
            Type
          </Text>

          {fields
            ?.filter((el) =>
              (el?.attributes?.[`label_${i18n?.language}`] ?? el?.label)
                ?.toLowerCase()
                ?.includes(search?.toLowerCase())
            )
            ?.map((field) => (
              <Flex
                onClick={() => addFieldSections(field)}
                _hover={{
                  background: "#F3F3F3",
                }}
                cursor={"pointer"}
                p={"8px"}
                h={"34px"}
                borderRadius={"4px"}
                alignItems="center"
                gap={"8px"}>
                <Flex>
                  {getColumnIcon({
                    column: {
                      type: field?.type,
                      table_slug: "regular",
                    },
                  })}
                </Flex>
                <Text fontSize={"14px"}>
                  {field?.attributes?.[`label_${i18n?.language}`] ??
                    field?.label}
                </Text>
              </Flex>
            ))}
        </Box>
      </Box>
    </Menu>
  );
};

const SearchInput = ({
  searchIcon = true,
  paddingLeft = "0px",
  placeholder = "Search",
  onChange = () => {},
}) => {
  return (
    <ChakraProvider theme={chakraUITheme}>
      <InputGroup>
        {searchIcon && (
          <InputLeftElement pointerEvents="none">
            <Image src="/img/search-lg.svg" alt="search" boxSize="16px" />
          </InputLeftElement>
        )}
        <Input
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          pl={paddingLeft}
          bg={"#fff"}
          borderColor="gray.300"
          focusBorderColor="blue.500"
        />
      </InputGroup>
    </ChakraProvider>
  );
};

export default PageSettings;
