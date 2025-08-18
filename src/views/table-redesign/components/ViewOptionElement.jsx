import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useMutation, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import constructorViewService from "../../../services/constructorViewService";
import {applyDrag} from "../../../utils/applyDrag";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalContent,
  ModalOverlay,
  Spinner,
  Switch,
  useDisclosure,
} from "@chakra-ui/react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/icons";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {Container, Draggable} from "react-smooth-dnd";
import {ViewOptionTitle} from "../views-with-groups";
import {getColumnIcon} from "../icons";
import ExcelUploadModal from "@/views/Objects/components/ExcelButtons/ExcelUploadModal";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";
import {useParams} from "react-router-dom";
import useDownloader from "../../../hooks/useDownloader";
import constructorObjectService from "../../../services/constructorObjectService";
import {VIEW_TYPES_MAP} from "../../../utils/constants/viewTypes";
import {viewsActions} from "../../../store/views/view.slice";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FieldOptions from "./FieldOptions";

export const ColumnsVisibility = ({
  relationView = false,
  view,
  fieldsMap,
  refetchViews,
  onBackClick,
  tableLan,
  tableSlug,
  setCloseOnBlur = () => {},
  refetchRelationViews = () => {},
}) => {
  const queryClient = useQueryClient();
  const {i18n, t} = useTranslation();
  const [search, setSearch] = useState("");
  const allFields = Object.values(fieldsMap);
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);

      if (relationView && viewsList?.length > 1) {
        refetchRelationViews();
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
      } else if (!relationView) {
        dispatch(viewsActions.updateView({view: data, id: view?.id}));
      } else {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      }
    },
    onSuccess: (data) => {
      // refetchViews();
    },
  });

  const visibleFields =
    view?.columns
      ?.map((id) => fieldsMap[id])
      .filter((el) => {
        return el?.type === "LOOKUP" || el?.type === "LOOKUPS"
          ? el?.relation_id
          : el?.id;
      }) ?? [];
  const invisibleFields =
    allFields.filter((field) => {
      return !view?.columns?.includes(
        field?.type === "LOOKUP" || field?.type === "LOOKUPS"
          ? field.relation_id
          : field.id
      );
    }) ?? [];

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const allColumns = [...visibleFields, ...invisibleFields];
  const renderFields = visibleFields?.filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    const columns = view?.columns ?? [];
    const id =
      column?.type === "LOOKUP" || column?.type === "LOOKUPS"
        ? column.relation_id
        : column.id;

    if (view?.type === "TIMELINE") {
      let visible_field = view?.attributes?.visible_field;
      if (checked) {
        visible_field = visible_field
          ? visible_field + "/" + column?.slug
          : column?.slug;
      } else {
        visible_field = visible_field
          ?.split("/")
          ?.filter((item) => item !== column?.slug)
          ?.join("/");
      }
      mutation.mutate({
        ...view,
        attributes: {
          ...view?.attributes,
          visible_field: visible_field,
        },
      });
    } else {
      mutation.mutate({
        ...view,
        columns: checked ? [...columns, id] : columns.filter((c) => c !== id),
      });
    }
  };

  const onShowAllChange = (checked) => {
    mutation.mutate({
      ...view,
      columns: checked
        ? renderFields.map((column) =>
            column?.type === "LOOKUP" || column?.type === "LOOKUPS"
              ? column.relation_id
              : column.id
          )
        : [],
    });
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(visibleFields, dropResult);
    const computedResult = result?.filter((item) => {
      return item?.type === "LOOKUP" || item?.type === "LOOKUPS"
        ? item?.relation_id
        : item?.id;
    });

    if (computedResult) {
      mutation.mutate({
        ...view,
        columns: computedResult?.map((item) =>
          item?.type === "LOOKUP" || item?.type === "LOOKUPS"
            ? item?.relation_id
            : item?.id
        ),
      });
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Button
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          rightIcon={
            mutation.isLoading ? <Spinner color="#475467" /> : undefined
          }
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={onBackClick}>
          <Box color="#475467" fontSize={14} fontWeight={600}>
            {generateLangaugeText(
              tableLan,
              i18n?.language,
              "Visible columns"
            ) || "Visible columns"}
          </Box>
        </Button>

        {view?.type !== "TIMELINE" && (
          <Flex as="label" alignItems="center" columnGap="4px" cursor="pointer">
            <Switch
              isChecked={allColumns?.length === visibleFields?.length}
              onChange={(ev) => onShowAllChange(ev.target.checked)}
            />
            {t("show_all")}
          </Flex>
        )}
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
              "Seaarch by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex
        className="scrollbarNone"
        flexDirection="column"
        mt="8px"
        maxHeight="300px"
        overflow="auto">
        <Container onDrop={onDrop}>
          <Box p={"8px 0 8px 6px"} fontWeight="700" color={"#777"}>
            Shown in Table
          </Box>
          {renderFields.map((column) => (
            <Draggable key={column.id}>
              <Flex
                as="label"
                p="6px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                bg="#fff"
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                zIndex={999999}>
                {column?.type && getColumnIcon({column})}
                <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
                <Flex
                  ml="auto"
                  cursor="pointer"
                  onClick={() =>
                    onChange(
                      column,
                      !(view?.type === "TIMELINE"
                        ? view?.attributes?.visible_field?.includes(
                            column?.slug
                          )
                        : view?.columns?.includes(
                            column?.type === "LOOKUP" ||
                              column?.type === "LOOKUPS"
                              ? column?.relation_id
                              : column?.id
                          ))
                    )
                  }>
                  {view?.type === "TIMELINE" ? (
                    view?.attributes?.visible_field?.includes(column?.slug) ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon style={{color: "#888"}} />
                    )
                  ) : view?.columns?.includes(
                      column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                        ? column?.relation_id
                        : column?.id
                    ) ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon style={{color: "#888"}} />
                  )}
                </Flex>
                <FieldOptions
                  view={view}
                  tableSlug={tableSlug}
                  field={column}
                  setCloseOnBlur={setCloseOnBlur}
                />
              </Flex>
            </Draggable>
          ))}
          <Box p={"8px 0 8px 6px"} fontWeight="700" color={"#777"}>
            Hidden in Table
          </Box>
          {invisibleFields?.map((column) => (
            <Flex
              as="label"
              p="6px"
              columnGap="8px"
              alignItems="center"
              borderRadius={6}
              bg="#fff"
              _hover={{bg: "#EAECF0"}}
              cursor="pointer"
              zIndex={999999}>
              {column?.type && getColumnIcon({column})}
              <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
              <Flex
                ml="auto"
                cursor="pointer"
                onClick={() =>
                  onChange(
                    column,
                    !(view?.type === "TIMELINE"
                      ? view?.attributes?.visible_field?.includes(column?.slug)
                      : view?.columns?.includes(
                          column?.type === "LOOKUP" ||
                            column?.type === "LOOKUPS"
                            ? column?.relation_id
                            : column?.id
                        ))
                  )
                }>
                {view?.type === "TIMELINE" ? (
                  view?.attributes?.visible_field?.includes(column?.slug) ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon style={{color: "#888"}} />
                  )
                ) : view?.columns?.includes(
                    column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                      ? column?.relation_id
                      : column?.id
                  ) ? (
                  <VisibilityIcon />
                ) : (
                  <VisibilityOffIcon style={{color: "#888"}} />
                )}
              </Flex>
              <FieldOptions
                view={view}
                tableSlug={tableSlug}
                field={column}
                setCloseOnBlur={setCloseOnBlur}
              />
            </Flex>
          ))}
        </Container>
      </Flex>
    </Box>
  );
};

export const Group = ({
  relationView = false,
  view,
  fieldsMap,
  refetchViews,
  onBackClick,
  tableLan,
  tableSlug,
}) => {
  const queryClient = useQueryClient();
  const {i18n} = useTranslation();
  const [search, setSearch] = useState("");

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      if (relationView) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      } else {
        return refetchViews();
      }
    },
  });

  const allFields = Object.values(fieldsMap);
  const visibleFields =
    view?.attributes?.group_by_columns?.map((id) => fieldsMap[id]) ?? [];
  const invisibleFields = allFields.filter((field) => {
    return !view?.attributes?.group_by_columns?.includes(
      field?.type === "LOOKUP" || field?.type === "LOOKUPS"
        ? field.relation_id
        : field.id
    );
  });

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const renderFields = [...visibleFields, ...invisibleFields].filter(
    (column) =>
      search === ""
        ? column
        : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    const columns = view?.attributes?.group_by_columns ?? [];
    const id =
      column?.type === "LOOKUP" || column?.type === "LOOKUPS"
        ? column.relation_id
        : column.id;

    mutation.mutate({
      ...view,
      attributes: {
        ...view.attributes,
        group_by_columns: checked
          ? [...columns, id]
          : columns.filter((c) => c !== id),
      },
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={mutation.isLoading ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}>
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, "Group columns") ||
            "Group columns"}
        </Box>
      </Button>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Seaarch by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        {renderFields.map((column) => (
          <Flex
            key={column.id}
            as="label"
            p="8px"
            columnGap="8px"
            alignItems="center"
            borderRadius={6}
            _hover={{bg: "#EAECF0"}}
            cursor="pointer">
            {column?.type && getColumnIcon({column})}
            <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
            <Switch
              ml="auto"
              onChange={(ev) => onChange(column, ev.target.checked)}
              isChecked={view?.attributes?.group_by_columns?.includes(
                column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                  ? column?.relation_id
                  : column?.id
              )}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export const TabGroup = ({
  relationView = false,
  view,
  fieldsMap,
  refetchViews,
  visibleRelationColumns,
  onBackClick,
  tableLan,
  visibleColumns,
  label = "Tab group columns",
  isBoardView,
  tableSlug,
}) => {
  const queryClient = useQueryClient();
  const {i18n} = useTranslation();
  const [search, setSearch] = useState("");

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      if (relationView) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      } else {
        return refetchViews();
      }
    },
  });

  const computedColumns =
    view?.type !== "CALENDAR" && view?.type !== "GANTT"
      ? Object.values(fieldsMap)
      : [...Object.values(fieldsMap), ...visibleRelationColumns];
  const columns = (computedColumns ?? []).filter((column) =>
    ["LOOKUP", "PICK_LIST", "LOOKUPS", "MULTISELECT", "STATUS"].includes(
      column.type
    )
  );

  // const computedColumnsFor = useMemo(() => {
  //   if (view.type !== "CALENDAR" && view.type !== "GANTT") {
  //     return visibleColumns;
  //   } else {
  //     return [...visibleColumns, ...visibleRelationColumns];
  //   }
  // }, [visibleColumns, visibleRelationColumns, view.type]);

  const getLabel = (column) =>
    column?.attributes?.[`label_${i18n.language}`] || column?.label;

  const renderFields = columns.filter((column) =>
    search === ""
      ? true
      : getLabel(column)?.toLowerCase().includes(search.toLowerCase())
  );

  const [selected, setSelected] = useState(view?.group_fields?.[0] ?? null);
  const onChange = (column, checked) => {
    if (isBoardView && selected === column.id) {
      return;
    } else if (isBoardView && selected !== column.id) {
      setSelected(column.id);
    }
    mutation.mutate({
      ...view,
      group_fields: checked
        ? [
            column?.type === "LOOKUP" || column?.type === "LOOKUPS"
              ? column?.relation_id
              : column?.id,
          ]
        : [],
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={mutation.isLoading ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}>
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, label) ||
            "Tab group columns"}
        </Box>
      </Button>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Seaarch by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        {renderFields.map((column) => (
          <Flex
            key={column.id}
            as="label"
            p="8px"
            columnGap="8px"
            alignItems="center"
            borderRadius={6}
            _hover={{bg: "#EAECF0"}}
            cursor="pointer">
            {column?.type && getColumnIcon({column})}
            <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
            {isBoardView ? (
              <Switch
                ml="auto"
                checked={selected === column?.id}
                onChange={(ev) => onChange(column, ev.target.checked)}
                disabled={
                  isBoardView
                    ? view?.attributes?.sub_group_by_id === column?.id
                    : false
                }
                isChecked={(view?.group_fields ?? []).includes(
                  column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                    ? column?.relation_id
                    : column?.id
                )}
              />
            ) : (
              <Switch
                ml="auto"
                onChange={(ev) => onChange(column, ev.target.checked)}
                isChecked={(view?.group_fields ?? []).includes(
                  column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                    ? column?.relation_id
                    : column?.id
                )}
              />
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export const FixColumns = ({
  relationView = false,
  view,
  fieldsMap,
  refetchViews,
  onBackClick,
  tableLan,
  tableSlug,
}) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const {i18n} = useTranslation();

  const mutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);

      if (relationView) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      } else {
        return refetchViews();
      }
    },
  });

  const checkedElements = Object.values(fieldsMap)
    .filter((column) => {
      return view?.columns?.find((el) => el === column?.id);
    })
    ?.filter((column) =>
      Object.keys(view?.attributes?.fixedColumns ?? {}).includes(column?.id)
    );

  const uncheckedElements = Object.values(fieldsMap)
    .filter((column) => {
      return view?.columns?.find((el) => el === column?.id);
    })
    ?.filter(
      (column) =>
        !Object.keys(view?.attributes?.fixedColumns ?? {}).includes(column?.id)
    );

  const columns = [...checkedElements, ...uncheckedElements].filter((column) =>
    search === ""
      ? true
      : column?.label?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    let fixed = [...Object.keys(view?.attributes?.fixedColumns ?? {})];
    if (checked) {
      fixed.push(column.id);
    } else {
      fixed = fixed.filter((el) => el !== column.id);
    }
    mutation.mutate({
      ...view,
      attributes: {
        ...view.attributes,
        fixedColumns: Object.fromEntries(fixed.map((key) => [key, true])),
      },
    });
  };

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={mutation.isLoading ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}>
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, "Fix columns") ||
            "Fix columns"}
        </Box>
      </Button>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Seaarch by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        {columns.map((column) => (
          <Flex
            key={column.id}
            as="label"
            p="8px"
            columnGap="8px"
            alignItems="center"
            borderRadius={6}
            _hover={{bg: "#EAECF0"}}
            cursor="pointer">
            {column?.type && getColumnIcon({column})}
            <ViewOptionTitle>{column?.label}</ViewOptionTitle>
            <Switch
              ml="auto"
              isChecked={Boolean(
                Object.keys(view?.attributes?.fixedColumns ?? {})?.find(
                  (el) => el === column.id
                )
              )}
              onChange={(ev) => onChange(column, ev.target.checked)}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

export const ExcelExportButton = ({fieldsMap, tableLan}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {i18n} = useTranslation();
  return (
    <>
      <Flex
        p="8px"
        h="32px"
        columnGap="8px"
        alignItems="center"
        borderRadius={6}
        _hover={{bg: "#EAECF0"}}
        cursor="pointer"
        onClick={onOpen}>
        <Image src="/img/file-download.svg" alt="Docs" />
        <ViewOptionTitle>
          {generateLangaugeText(tableLan, i18n?.language, "Import") || "Import"}
        </ViewOptionTitle>
        <ChevronRightIcon ml="auto" fontSize={22} />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent zIndex={2} minW="602px" w="602px">
          <ExcelUploadModal fieldsMap={fieldsMap} handleClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};

export const ExcelImportButton = ({
  searchText,
  checkedColumns,
  computedVisibleFields,
  tableLan,
  tableSlug,
}) => {
  // const {tableSlug} = useParams();
  const {download} = useDownloader();
  const {i18n} = useTranslation();

  const mutation = useMutation({
    mutationFn: async () => {
      const {data} = await constructorObjectService.downloadExcel(tableSlug, {
        data: {
          field_ids: computedVisibleFields,
          language: i18n.language,
          search: searchText,
          view_fields: checkedColumns,
        },
      });
      return await download({
        fileName: `${tableSlug}.xlsx`,
        link: "https://" + data.link,
      });
    },
  });

  return (
    <Flex
      p="8px"
      h="32px"
      columnGap="8px"
      alignItems="center"
      borderRadius={6}
      _hover={{bg: "#EAECF0"}}
      cursor="pointer"
      onClick={mutation.mutate}>
      {mutation.isLoading ? (
        <Spinner w="20px" h="20px" />
      ) : (
        <Image src="/img/file-download.svg" alt="Docs" />
      )}
      <ViewOptionTitle>
        {generateLangaugeText(tableLan, i18n?.language, "Export") || "Export"}
      </ViewOptionTitle>
      <ChevronRightIcon ml="auto" fontSize={22} />
    </Flex>
  );
};

export const DeleteViewButton = ({
  relationView,
  view,
  refetchViews,
  tableLan,
}) => {
  const dispatch = useDispatch();
  const {tableSlug: tableSlugFromParams} = useParams();
  const tableSlug = tableSlugFromParams ?? view?.table_slug;
  const {i18n} = useTranslation();
  const queryClient = useQueryClient();
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const mutation = useMutation({
    mutationFn: () => constructorViewService.delete(view.id, tableSlug),
    onSuccess: () => {
      relationView
        ? dispatch(detailDrawerActions.setDrawerTabIndex(0))
        : dispatch(detailDrawerActions.setMainTabIndex(0));

      if (relationView && viewsList?.length > 1) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
      } else if (relationView && viewsList?.length <= 1) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      } else refetchViews();
    },
  });

  return (
    <Flex
      p="8px"
      h="32px"
      columnGap="8px"
      alignItems="center"
      borderRadius={6}
      _hover={{bg: "#EAECF0"}}
      cursor="pointer"
      onClick={() => mutation.mutate()}>
      {mutation.isLoading ? (
        <Spinner w="20px" h="20px" />
      ) : (
        <Image src="/img/trash.svg" alt="Delete" />
      )}
      <ViewOptionTitle>
        {generateLangaugeText(tableLan, i18n?.language, "Delete") || "Delete"}
      </ViewOptionTitle>
    </Flex>
  );
};
