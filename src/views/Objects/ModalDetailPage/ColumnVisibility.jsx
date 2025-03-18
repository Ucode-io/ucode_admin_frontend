import {ChevronLeftIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Switch,
} from "@chakra-ui/react";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams, useSearchParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import layoutService from "../../../services/layoutService";
import menuService from "../../../services/menuService";
import {columnIcons} from "../../../utils/constants/columnIcons";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {useMutation} from "react-query";

const ColumnsVisibility = ({
  data,
  fieldsMap,
  onBackClick,
  tableLan,
  selectedTabIndex,
  getAllData = () => {},
  setOpenedMenu = () => {},
}) => {
  const {tableSlug} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {i18n} = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const [computedColumns, setComputedColumns] = useState(
    data?.tabs?.[selectedTabIndex]?.attributes?.columns || []
  );
  console.log("computedColumnscomputedColumns", computedColumns, data);
  const allFields = useMemo(() => {
    return Object.values(fieldsMap);
  }, [fieldsMap]);

  const mutation = useMutation(
    async (updatedColumns) => {
      await layoutService.update(
        {
          ...data,
          tabs: data.tabs.map((item, index) =>
            index === selectedTabIndex
              ? {
                  ...item,
                  attributes: {...item.attributes, columns: updatedColumns},
                }
              : item
          ),
        },
        tableSlug
      );
    },
    {
      onMutate: async (updatedColumns) => {
        const previousColumns = computedColumns;
        setComputedColumns(updatedColumns);

        return () => setComputedColumns(previousColumns);
      },
      onSuccess: () => {
        getAllData();
      },
      onError: (err, _, rollback) => {
        if (rollback) rollback();
      },
    }
  );

  const updateView = (newColumns) => {
    console.log("newColumnsnewColumns", newColumns);
    // mutation.mutate(newColumns);
  };

  const visibleFields = useMemo(() => {
    return (
      computedColumns?.map((id) => fieldsMap?.[id])?.filter((el) => el?.type) ??
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
    <Box p={"10px"}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box color="#475467" fontSize={16} ml={"5px"} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, "Visible columns") ||
            "Visible columns"}
        </Box>

        <Flex as="label" alignItems="center" columnGap="4px" cursor="pointer">
          <Switch
            isChecked={computedColumns?.includes(column?.id)}
            onChange={(e) => {
              // updateView(
              //   e.target.checked
              //     ? [...computedColumns, column.id]
              //     : computedColumns.filter((el) => el !== column.id)
              // );
            }}
          />
          {generateLangaugeText(tableLan, i18n?.language, "Show all") ||
            "Show all"}
        </Flex>
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
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex
        mx={"10px"}
        flexDirection="column"
        mt="8px"
        maxHeight="300px"
        overflow="auto">
        <Container onDrop={onDrop}>
          {visibleFields?.map((column, index) => (
            <Draggable key={column?.id}>
              <div
                key={column?.id}
                style={{
                  display: "flex",
                  backgroundColor: "#fff",
                }}>
                <div
                  style={{
                    flex: 1,
                    border: 0,
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 0px",
                    margin: "-1px -1px 0 0",
                  }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {column?.type ? columnIcons(column?.type) : <LinkIcon />}
                  </div>
                  <p
                    style={{
                      width: "200px",
                    }}>
                    {column?.attributes?.[`label_${i18n.language}`] ??
                      column?.label}
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    alignItems: "center",
                    padding: "8px 16px",
                    margin: "-1px -1px 0 0",
                    width: 70,
                    border: 0,
                    paddingLeft: 0,
                    paddingRight: "5px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}>
                  {column.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                    <Switch
                      isChecked={computedColumns?.includes(column?.relation_id)}
                      onChange={(e) => {
                        updateView(
                          e.target.checked
                            ? [...computedColumns, column.relation_id]
                            : computedColumns.filter(
                                (el) => el !== column.relation_id
                              )
                        );
                      }}
                    />
                  ) : (
                    <Switch
                      isChecked={computedColumns?.includes(column?.id)}
                      onChange={(e) => {
                        updateView(
                          e.target.checked
                            ? [...computedColumns, column.id]
                            : computedColumns.filter((el) => el !== column.id)
                        );
                      }}
                    />
                  )}
                </div>
              </div>
            </Draggable>
          ))}

          {unVisibleFields?.map((column, index) => (
            <div
              key={column.id}
              style={{
                display: "flex",
                backgroundColor: "#fff",
              }}>
              <div
                style={{
                  flex: 1,
                  border: 0,
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 0px",
                  margin: "-1px -1px 0 0",
                }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  {column.type ? columnIcons(column.type) : <LinkIcon />}
                </div>
                <p
                  style={{
                    width: "200px",
                    minHeight: "42px",
                    wordBreak: "break-all",
                  }}>
                  {column?.attributes?.[`label_${i18n.language}`] ??
                    column?.label}
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  alignItems: "center",
                  padding: "8px 16px",
                  margin: "-1px -1px 0 0",
                  width: 70,
                  border: 0,
                  paddingLeft: 0,
                  paddingRight: "5px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
                  <Switch
                    isChecked={computedColumns?.includes(column?.relation_id)}
                    onChange={(e) => {
                      updateView(
                        e.target.checked
                          ? [...computedColumns, column.relation_id]
                          : computedColumns.filter(
                              (el) => el !== column.relation_id
                            )
                      );
                    }}
                  />
                ) : (
                  <Switch
                    isChecked={computedColumns?.includes(column?.id)}
                    onChange={(e) => {
                      updateView(
                        e.target.checked
                          ? [...computedColumns, column.id]
                          : computedColumns.filter((el) => el !== column.id)
                      );
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </Container>
      </Flex>
    </Box>
  );
};

export default ColumnsVisibility;
