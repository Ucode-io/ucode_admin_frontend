import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import constructorViewService from "../../../services/constructorViewService";
import constructorFieldService from "../../../services/constructorFieldService";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import SortByAlphaOutlinedIcon from "@mui/icons-material/SortByAlphaOutlined";
import {paginationActions} from "@/store/pagination/pagination.slice";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import WrapTextOutlinedIcon from "@mui/icons-material/WrapTextOutlined";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FunctionsIcon from "@mui/icons-material/Functions";
import {
  Box,
  ChakraProvider,
  Flex,
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import {getColumnIcon} from "../../table-redesign/icons";
import {Menu} from "@mui/material";
import relationService from "../../../services/relationService";

const Th = ({
  tableSlug,
  columns,
  column,
  view,
  tableSettings,
  tableSize,
  pageName,
  sortedDatas,
  setSortedDatas,
  relationAction,
  relatedTable,
  isRelationTable,
  getAllData,
  setFieldCreateAnchor,
  setFieldData,
  setCurrentColumnWidth,
  calculateWidthFixedColumn,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [summaryOpen, setSummaryOpen] = useState(null);
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const summaryIsOpen = Boolean(summaryOpen);
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const permissions = useSelector(
    (state) => state.auth.permissions?.[tableSlug]
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSummaryOpen = (event) => {
    setSummaryOpen(event.currentTarget);
  };
  const handleSummaryClose = () => {
    setSummaryOpen(null);
    handleClose();
  };

  const fixColumnChangeHandler = (column, e) => {
    const computedData = {
      ...view,
      attributes: {
        ...view?.attributes,
        fixedColumns: {
          ...view?.attributes?.fixedColumns,
          [column.id]: e,
        },
      },
    };

    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const textWrapChangeHandler = (column, e) => {
    const computedData = {
      ...view,
      attributes: {
        ...view?.attributes,
        textWrap: {
          ...view?.attributes?.textWrap,
          [column.id]: e,
        },
      },
    };

    constructorViewService.update(tableSlug, computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const updateView = (column) => {
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: view?.columns?.filter((item) => item !== column),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", { tableSlug });
      });
  };

  const updateRelationView = (data) => {
    relationService.update(data, view?.relatedTable).then((res) => {
      getAllData();
      handleSummaryClose();
    });
  };

  const deleteField = (column) => {
    constructorFieldService.delete(column, tableSlug).then((res) => {
      constructorViewService
        .update(tableSlug, {
          ...view,
          columns: view?.columns?.filter((item) => item !== column),
        })
        .then(() => {
          queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
          queryClient.refetchQueries("GET_OBJECTS_LIST", { tableSlug });
        });
    });
  };

  const computedViewSummaries = useMemo(() => {
    if (
      view?.attributes?.summaries?.find(
        (item) => item?.field_name === column?.id
      )
    )
      return true;
    else return false;
  }, [view?.attributes?.summaries, column]);

  const menu = [
    {
      id: 1,
      children: [
        {
          id: 2,
          title: "Edit field",
          icon: <CreateOutlinedIcon />,
          onClickAction: (e) => {
            setFieldCreateAnchor(e.currentTarget);
            setFieldData(column);
            if (column?.attributes?.relation_data?.id) {
              queryClient.refetchQueries([
                "RELATION_GET_BY_ID",
                { tableSlug, id: column?.attributes?.relation_data?.id },
              ]);
            }
          },
        },
      ],
    },
    {
      id: 7,
      children: [
        {
          id: 8,
          title: `Sort ${
            sortedDatas?.find((item) => item.field === column.id)?.order ===
            "ASC"
              ? "Z -> A"
              : "A -> Z"
          }`,
          icon: <SortByAlphaOutlinedIcon />,
          onClickAction: () => {
            const field = column.id;
            const order =
              sortedDatas?.find((item) => item.field === column.id)?.order ===
              "ASC"
                ? "DESC"
                : "ASC";
            dispatch(
              paginationActions.setSortValues({ tableSlug, field, order })
            );
            setSortedDatas((prev) => {
              const newSortedDatas = [...prev];
              const index = newSortedDatas.findIndex(
                (item) => item.field === column.id
              );
              if (index !== -1) {
                newSortedDatas[index].order =
                  newSortedDatas[index].order === "ASC" ? "DESC" : "ASC";
              } else {
                newSortedDatas.push({
                  field: column.id,
                  order: "ASC",
                });
              }
              return newSortedDatas;
            });
          },
        },
        {
          id: 18,
          title: computedViewSummaries ? `Unset Summary` : "Add Summary",
          icon: <PlaylistAddCircleIcon />,
          arrowIcon: <KeyboardArrowRightIcon />,
          onClickAction: (e) => {
            if (computedViewSummaries) {
              handleAddSummary(column, "unset");
            } else {
              handleSummaryOpen(e);
            }
          },
        },
        {
          id: 19,
          title: `${
            view?.attributes?.textWrap?.[column?.id] ? "Unwrap" : "Wrap"
          } text`,
          icon: view?.attributes?.textWrap?.[column?.id] ? (
            <WrapTextOutlinedIcon />
          ) : (
            <AlignHorizontalLeftIcon />
          ),
          onClickAction: () => {
            textWrapChangeHandler(
              column,
              !view?.attributes?.textWrap?.[column?.id] ? true : false
            );
          },
        },
        {
          id: 10,
          title: `${
            view?.attributes?.fixedColumns?.[column?.id] ? "Unfix" : "Fix"
          } column`,
          icon: <ViewWeekOutlinedIcon />,
          onClickAction: () => {
            fixColumnChangeHandler(
              column,
              !view?.attributes?.fixedColumns?.[column?.id] ? true : false
            );
          },
        },
      ],
    },
    {
      id: 12,
      children: [
        {
          id: 13,
          title: "Hide field",
          icon: <VisibilityOffOutlinedIcon />,
          onClickAction: () => {
            updateView(column.id);
          },
        },

        {
          id: 14,
          title: "Delete field",
          icon: <DeleteOutlinedIcon />,
          onClickAction: () => {
            deleteField(column.id);
          },
        },
      ],
    },
  ];

  const formulaTypes = [
    {
      icon: <FunctionsIcon />,
      id: 1,
      label: "Sum ()",
      value: "sum",
    },
    {
      icon: <FunctionsIcon />,
      id: 1,
      label: "Avg ()",
      value: "avg",
    },
  ];

  const handleAddSummary = (item, type) => {
    let result = [];

    if (type === "add") {
      const newSummary = {
        field_name: column?.id,
        formula_name: item?.value,
      };
      result = Array.from(
        new Map(
          [newSummary, ...(view?.attributes?.summaries ?? [])]?.map((item) => [
            item.field_name,
            item,
          ])
        ).values()
      );
    } else if (type === "unset") {
      result = view?.attributes?.summaries?.filter(
        (element) => element?.field_name !== item?.id
      );
    }

    const computedValues = {
      ...view,
      attributes: {
        ...view?.attributes,
        summaries: result ?? [],
      },
    };

    const relationData = {
      ...relationAction?.relation,
      table_from: relationAction?.relation?.table_from?.slug,
      table_to: relationAction?.relation?.table_to?.slug,
    };

    const computedValuesForRelationView = {
      ...relatedTable,
      ...relationData,
      table_from: view?.table_from?.slug,
      table_to: view?.table_to?.slug,
      view_fields: view?.view_fields?.map((el) => el.id),
      attributes: {
        ...relatedTable?.attributes,
        summaries: result ?? [],
      },
      relation_table_slug:
        relationAction?.relation_table_slug || column?.table_slug,
      id: relationAction?.relation_id,
    };

    if (isRelationTable) {
      updateRelationView(computedValuesForRelationView);
    } else {
      constructorViewService.update(tableSlug, computedValues).then(() => {
        queryClient.refetchQueries("GET_VIEWS_AND_FIELDS", { tableSlug });
        handleSummaryClose();
      });
    }
  };

  const position =
    tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
      ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
      ? "sticky"
      : "relative";
  const left = view?.attributes?.fixedColumns?.[column?.id]
    ? `${calculateWidthFixedColumn({ columns, column }) + 45}px`
    : "0";
  const bg =
    tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
      ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
      ? "#F6F6F6"
      : "#F9FAFB";
  const zIndex =
    tableSettings?.[pageName]?.find((item) => item?.id === column?.id)
      ?.isStiky || view?.attributes?.fixedColumns?.[column?.id]
      ? "1"
      : "0";
  const label =
    column?.attributes?.[`label_${i18n?.language}`] ||
    column?.attributes?.[`title_${i18n?.language}`] ||
    column?.attributes?.[`name_${i18n?.language}`] ||
    column.label;
  const minWidth = tableSize?.[pageName]?.[column.id]
    ? tableSize?.[pageName]?.[column.id]
    : "auto";
  const width = tableSize?.[pageName]?.[column.id]
    ? tableSize?.[pageName]?.[column.id]
    : "auto";

  return (
    <Box
      h={"32px"}
      as="th"
      id={column.id}
      className="th"
      py="2px"
      px="12px"
      borderRight="1px solid #EAECF0"
      color="#475467"
      fontWeight={500}
      fontSize={12}
      minW={minWidth}
      w={width}
      position={position}
      left={left}
      bg={bg}
      zIndex={zIndex}
      onMouseEnter={(e) => setCurrentColumnWidth(e.relatedTarget.offsetWidth)}
    >
      <Flex
        alignItems="center"
        columnGap="8px"
        whiteSpace="nowrap"
        minW="max-content"
      >
        {getColumnIcon({ column })}
        {label}

        {permissions?.field_filter && (
          <ChakraProvider>
            <Popover>
              <PopoverTrigger>
                <IconButton
                  aria-label="more"
                  icon={
                    <Image
                      src="/img/chevron-down.svg"
                      alt="more"
                      style={{ minWidth: 20 }}
                    />
                  }
                  variant="ghost"
                  colorScheme="gray"
                  ml="auto"
                  onClick={handleClick}
                  size="xs"
                />
              </PopoverTrigger>
              <Portal>
                <PopoverContent
                  w="200px"
                  bg="#fff"
                  py="4px"
                  borderRadius={6}
                  boxShadow="0 0 2px 0 rgba(145, 158, 171, 0.24),0 12px 24px 0 rgba(145, 158, 171, 0.24)"
                >
                  {menu.map((item, index) => (
                    <Flex flexDirection="column">
                      {item.children
                        .filter(
                          (child) =>
                            !(child.id === 19 && column?.type !== "MULTI_LINE")
                        )
                        .map((child) => (
                          <Flex
                            h="32px"
                            mx="10px"
                            columnGap="10px"
                            alignItems="center"
                            cursor="pointer"
                            color={child.id === 14 ? "red" : "#475467"}
                            fontSize="14px"
                            fontWeight={500}
                            p="5px"
                            borderRadius="6px"
                            _hover={{ bg: "#919eab14" }}
                            onClick={(e) => child.onClickAction(e)}
                          >
                            <Flex justifyContent="center" alignItems="center">
                              {child.icon}
                            </Flex>

                            <Flex justifyContent="center">{child.title}</Flex>
                          </Flex>
                        ))}
                      {index !== menu.length - 1 && <Box as="hr" my="4px" />}
                    </Flex>
                  ))}
                </PopoverContent>
              </Portal>
            </Popover>
          </ChakraProvider>
        )}
      </Flex>

      <Menu
        anchorEl={summaryOpen}
        open={summaryIsOpen}
        onClose={handleSummaryClose}
        anchorOrigin={{ horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            marginLeft: "10px",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {formulaTypes?.map((item) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                handleAddSummary(item, "add");
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
                className="subMenuItem"
              >
                <span
                  style={{
                    marginRight: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  {item.icon}
                </span>
                {item?.label}
              </div>
            </div>
          ))}
        </div>
      </Menu>
    </Box>
  );
};

export default Th;
