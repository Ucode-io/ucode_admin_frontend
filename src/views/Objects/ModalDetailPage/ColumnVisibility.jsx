import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useMutation} from "react-query";
import {useParams, useSearchParams} from "react-router-dom";
import constructorViewService from "../../../services/constructorViewService";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react";
import {ChevronLeftIcon} from "@chakra-ui/icons";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {Switch} from "@mui/material";
import {Container, Draggable} from "react-smooth-dnd";
import menuService from "../../../services/menuService";

const ColumnsVisibility = ({
  data,
  fieldsMap,
  refetchViews,
  onBackClick,
  tableLan,
  selectedTab,
  selectedTabIndex,
}) => {
  const {tableSlug} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {i18n} = useTranslation();
  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateView = async (datas) => {
    setIsLoading(true);

    const result = data?.tabs;

    if (!result) {
      setIsLoading(false);
      return;
    }

    const computeTabs = result.map((item, index) => {
      if (index === selectedTabIndex) {
        return {
          ...item,
          attributes: {
            ...item.attributes,
            columns: [...datas],
          },
        };
      } else {
        return {
          ...item,
          attributes: {
            ...item.attributes,
            columns: Array.isArray(item?.attributes?.columns)
              ? [...item?.attributes?.columns]
              : [],
          },
        };
      }
    });

    try {
      await layoutService.update(
        {
          ...data,
          tabs: computeTabs,
        },
        tableSlug
      );

      await getAllData();
    } catch (error) {
      console.error("Error updating layout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const computedColumns = useMemo(() => {
    if (Array.isArray(data?.tabs?.[selectedTabIndex]?.attributes?.columns)) {
      return (
        data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
        data?.tabs?.[selectedTabIndex]?.relation?.columns
      );
    } else {
      return [];
    }
  }, [data?.tabs, selectedTabIndex]);

  const visibleFields = useMemo(() => {
    return (
      computedColumns?.map((id) => fieldsMap[id])?.filter((el) => el?.type) ??
      []
    );
  }, [computedColumns, fieldsMap]);

  const unVisibleFields = useMemo(() => {
    return allFields.filter((field) => {
      if (field?.type === "LOOKUP" || field?.type === "LOOKUPS") {
        return !computedColumns?.includes(field.relation_id);
      } else {
        return !computedColumns?.includes(field.id);
      }
    });
  }, [allFields, computedColumns]);

  const onDrop = (dropResult) => {
    const result = applyDrag(visibleFields, dropResult);
    if (result) {
      updateView(
        result.map((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return el.relation_id;
          } else {
            return el.id;
          }
        })
      );
    }
  };

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
        .getByID({
          menuId: searchParams.get("menuId"),
        })
        .then((res) => {
          setMenuItem(res);
        });
    }
  }, []);
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Button
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          //   rightIcon={
          //     mutation.isLoading ? <Spinner color="#475467" /> : undefined
          //   }
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={onBackClick}>
          <Box color="#475467" fontSize={16} fontWeight={600}>
            {generateLangaugeText(
              tableLan,
              i18n?.language,
              "Visible columns"
            ) || "Visible columns"}
          </Box>
        </Button>

        {/* <Flex as="label" alignItems="center" columnGap="4px" cursor="pointer">
          <Switch
            isChecked={allColumns?.length === visibleFields?.length}
            onChange={(ev) => onShowAllChange(ev.target.checked)}
          />
          {generateLangaugeText(tableLan, i18n?.language, "Show all") ||
            "Show all"}
        </Flex> */}
      </Flex>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Search by filled name"
            ) || "Search by filled name"
          }
          value={"search"}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        <Container onDrop={onDrop}>
          {computedColumns?.map((column) => (
            <Draggable key={column.id}>
              <Flex
                as="label"
                p="8px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                bg="#fff"
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                zIndex={999999}>
                {column?.type && getColumnIcon({column})}
                <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
                <Switch
                  ml="auto"
                  onChange={(ev) => onChange(column, ev.target.checked)}
                  isChecked={selectedTab?.columns?.includes(
                    column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                      ? column?.relation_id
                      : column?.id
                  )}
                />
              </Flex>
            </Draggable>
          ))}
        </Container>
      </Flex>
    </Box>
  );
};

const ViewOptionTitle = ({children}) => (
  <Box color="#475467" fontWeight={500} fontSize={14}>
    {children}
  </Box>
);

export default ColumnsVisibility;
