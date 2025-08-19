import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@chakra-ui/react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {
  ArrowBackIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {default as InlineSVG, default as SVG} from "react-inlinesvg";
import constructorViewService from "../../../services/constructorViewService";
import {
  ViewOptionSubtitle,
  ViewOptionTitle,
} from "../../table-redesign/views-with-groups";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import ViewSettingsModal from "../../table-redesign/ViewSettings";
import {
  ColumnsVisibility,
  DeleteViewButton,
  ExcelExportButton,
  ExcelImportButton,
  FixColumns,
  TabGroup,
} from "../../table-redesign/components/ViewOptionElement";
import {SubGroup} from "../../table-redesign/components/SubGroup";
import {TimelineSettings} from "../../table-redesign/components/TimelineSettings";
import {CalendarSettings} from "../../table-redesign/components/CalendarSettings";
import {Group} from "../../table-redesign/components/ViewOptionElement";
import useDebounce from "../../../hooks/useDebounce";
import constructorTableService from "../../../services/constructorTableService";
import {listToMap} from "../../../utils/listToMap";
import listToOptions from "../../../utils/listToOptions";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
import LayoutComponent from "../../table-redesign/LayoutComponent";

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
  WEBSITE: "globe.svg",
  TREE: "tree.svg",
  SECTION: "layout.svg",
};

const ViewOptions = ({
  relationView = false,
  view,
  viewName,
  refetchViews,
  fieldsMap,
  visibleRelationColumns,
  searchText,
  checkedColumns,
  onDocsClick,
  computedVisibleFields,
  tableLan,
  handleOpenPopup,
  isChanged,
  selectedTabIndex,
  setIsChanged = () => {},
  refetchMenuViews = () => {},
  settingsForm,
  views,
  projectId,
  refetchRelationViews,
}) => {
  const navigate = useNavigate();
  const {menuId, appId, tableSlug: tableSlugFromProps} = useParams();
  const queryClient = useQueryClient();
  const tableSlug = relationView
    ? view?.relation_table_slug
    : (tableSlugFromProps ?? view?.table_slug);
  const {i18n, t} = useTranslation();
  const permissions = useSelector(
    (state) => state.permissions.permissions?.[tableSlug]
  );

  const roleInfo = useSelector((state) => state.auth?.roleInfo?.name);
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const ref = useRef();

  const [openedMenu, setOpenedMenu] = useState(null);

  const isTimelineView = view?.type === "TIMELINE";
  const isBoardView = view?.type === "BOARD";
  const isCalendarView = view?.type === "CALENDAR";

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [openedMenu]);

  useEffect(() => {
    settingsForm.setValue(
      "calendar_from_slug",
      view?.attributes?.calendar_from_slug
    );
    settingsForm.setValue(
      "calendar_to_slug",
      view?.attributes?.calendar_to_slug
    );
    settingsForm.setValue("group_fields", view?.group_fields);
  }, [view]);

  const updateView = useMutation({
    mutationFn: async (value) => {
      await constructorViewService.update(tableSlug, {
        ...view,
        id: view.id,
        columns: view.columns,
        attributes: {...view?.attributes, [`name_${i18n?.language}`]: value},
      });
      if (relationView && viewsList?.length > 1) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
      } else {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      }
    },
  });

  const onViewNameChange = useDebounce((ev) => {
    updateView.mutate(ev.target.value);
  }, 500);

  const fixedColumnsCount = Object.values(
    view?.attributes?.fixedColumns || {}
  ).length;
  const groupByColumnsCount = view?.attributes?.group_by_columns?.length;
  const visibleColumnsCount = view?.columns?.length ?? 0;
  const tabGroupColumnsCount = view?.group_fields?.length;
  const visibleColumnsCountForTimeline =
    view?.attributes?.visible_field?.split("/")?.length ?? 0;

  const {
    data: {fields, visibleColumns} = {data: []},
    isLoading: tableInfoLoading,
    refetch: refetchGetTableInfo,
  } = useQuery(
    ["GET_TABLE_INFO", {tableSlug}],
    () => {
      return constructorTableService.getTableInfo(tableSlug, {
        data: {},
      });
    },
    {
      enabled: false,
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        const relationFields =
          res?.data?.relation_fields?.map((el) => ({
            ...el,
            label: `${el.label} (${el.table_label})`,
          })) ?? [];
        const fieldsMap = listToMap([...fields, ...relationFields]);
        const data = res.data?.response?.map((row) => ({
          ...row,
        }));

        return {
          fieldsMap,
          data,
          fields,
          visibleColumns: res?.data?.fields ?? [],
          visibleRelationColumns:
            res?.data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  const computedColumns = useMemo(() => {
    const filteredFields = fields?.filter(
      (el) => el?.type === "DATE" || el?.type === "DATE_TIME"
    );
    return listToOptions(filteredFields, "label", "slug");
  }, [fields]);

  const saveSettings = () => {
    const computedData = {
      ...view,
      attributes: {
        ...view.attributes,
        calendar_from_slug: settingsForm.getValues("calendar_from_slug"),
        calendar_to_slug: settingsForm.getValues("calendar_to_slug"),
        // visible_field: settingsForm.getValues("visible_field"),
      },
    };

    constructorViewService
      .update(tableSlug, {
        ...computedData,
      })
      .then(() => {
        if (relationView && viewsList?.length > 1) {
          return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
        } else {
          return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
        }
      });
  };

  const computedColumnsFor = useMemo(() => {
    if (view.type !== "CALENDAR" && view.type !== "GANTT") {
      return visibleColumns;
    } else {
      if (
        Array.isArray(visibleRelationColumns) &&
        Array.isArray(visibleColumns)
      ) {
        return [...visibleColumns, ...visibleRelationColumns];
      } else {
        return [];
      }
    }
  }, [visibleColumns, visibleRelationColumns, view.type]);

  const viewUpdateMutation = useMutation({
    mutationFn: async (data) => {
      await constructorViewService.update(tableSlug, data);
      return await refetchViews();
    },
  });

  const navigateToOldTemplate = () => {
    if (localStorage.getItem("new_router") === "true") {
      navigate(`/${menuId}/object/${tableSlug}/docs`);
    } else {
      navigate(`/main/${appId}/object/${tableSlug}/docs`);
    }
  };

  const [closeOnBlur, setCloseOnBlur] = useState(true);

  return (
    <Popover
      offset={[-145, 8]}
      closeOnBlur={closeOnBlur}
      onClose={() => setTimeout(() => setOpenedMenu(null), 250)}
      modifiers={[
        {
          name: "computeStyles",
          options: {
            gpuAcceleration: false,
            adaptive: false,
          },
        },
      ]}>
      <PopoverTrigger>
        <IconButton
          aria-label="more"
          icon={<Image src="/img/dots-vertical.svg" alt="more" />}
          variant="ghost"
          colorScheme="gray"
        />
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        w="320px"
        p={openedMenu === null ? "0px" : "8px"}>
        {openedMenu === null && (
          <>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              <Box color="#475467" fontSize={16} fontWeight={600}>
                {t("view_options")}
              </Box>
              <Flex mt="12px" columnGap="4px">
                <Flex
                  minW="32px"
                  h="26px"
                  borderRadius={6}
                  border="1px solid #D0D5DD"
                  alignItems="center"
                  justifyContent="center">
                  <SVG
                    src={`/img/${viewIcons[view.type]}`}
                    width={18}
                    height={18}
                  />
                </Flex>
                <InputGroup>
                  <Input
                    h="26px"
                    placeholder={t("view_name")}
                    defaultValue={viewName}
                    onChange={onViewNameChange}
                  />
                  {updateView.isLoading && (
                    <InputRightElement>
                      <Spinner color="#475467" />
                    </InputRightElement>
                  )}
                </InputGroup>
              </Flex>
              <Flex
                color="#475467"
                mt="4px"
                columnGap="4px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                as="span"
                onClick={handleOpenPopup}
                // to={`/settings/constructor/apps/${appId}/objects/${layoutQuery.data?.table_id}/${tableSlug}?menuId=${menuId}`}
              >
                <Flex
                  minW="36px"
                  h="28px"
                  alignItems="center"
                  justifyContent="center">
                  <SVG
                    src={`/img/${viewIcons[view.type]}`}
                    width={18}
                    height={18}
                  />
                </Flex>
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "General") ||
                    "General"}
                </ViewOptionTitle>
                <Flex ml="auto" columnGap="4px" alignItems="center">
                  <Box color="#667085" fontWeight={400} fontSize={14}>
                    {viewName}
                  </Box>
                  <ChevronRightIcon fontSize={22} />
                </Flex>
              </Flex>

              <LayoutComponent
                refetchViews={refetchViews}
                selectedTabIndex={selectedTabIndex}
                tableLan={tableLan}
                selectedView={view}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
              />

              <ViewSettingsModal
                refetchViews={refetchViews}
                selectedTabIndex={selectedTabIndex}
                tableLan={tableLan}
                selectedView={view}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
              />
            </Box>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              <Flex
                p="8px"
                h="32px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                onClick={() => setOpenedMenu("columns-visibility")}>
                <Image src="/img/eye.svg" alt="Visibility" />
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "Columns") ||
                    "Columns"}
                </ViewOptionTitle>
                <Flex ml="auto" alignItems="center" columnGap="8px">
                  {Boolean(
                    isTimelineView
                      ? visibleColumnsCountForTimeline
                      : visibleColumnsCount
                  ) &&
                    (isTimelineView
                      ? visibleColumnsCountForTimeline
                      : visibleColumnsCount) > 0 && (
                      <ViewOptionSubtitle>
                        {isTimelineView
                          ? visibleColumnsCountForTimeline
                          : visibleColumnsCount}{" "}
                        {t("shown")}
                      </ViewOptionSubtitle>
                    )}
                  <ChevronRightIcon fontSize={22} />
                </Flex>
              </Flex>
              {/* )} */}

              {(roleInfo === "DEFAULT ADMIN" || permissions?.group) &&
                view.type !== "BOARD" && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("group")}>
                    <Image src="/img/copy-01.svg" alt="Group by" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Group"
                      ) || "Group"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(groupByColumnsCount) && (
                        <ViewOptionSubtitle>
                          {groupByColumnsCount}{" "}
                          {generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Group"
                          ) || "Group"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(roleInfo === "DEFAULT ADMIN" || permissions?.tab_group) &&
                !isTimelineView && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("tab-group")}>
                    <Image src="/img/browser.svg" alt="Group by" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        isBoardView ? "Group" : "Tab Group"
                      ) || "Tab Group"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(tabGroupColumnsCount) && (
                        <ViewOptionSubtitle>
                          {tabGroupColumnsCount}{" "}
                          {generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Group"
                          ) || "Group"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(roleInfo === "DEFAULT ADMIN" || permissions?.group) &&
                view.type === "BOARD" && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("sub-group")}
                    color="#475467">
                    <HorizontalSplitOutlinedIcon color="inherit" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Sub group"
                      ) || "Sub group"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(tabGroupColumnsCount) && (
                        <ViewOptionSubtitle>
                          {fieldsMap?.[view?.attributes?.sub_group_by_id]
                            ?.label || "None"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(roleInfo === "DEFAULT ADMIN" || permissions?.fix_column) &&
                !isTimelineView &&
                !isBoardView && (
                  <Flex
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{bg: "#EAECF0"}}
                    cursor="pointer"
                    onClick={() => setOpenedMenu("fix-column")}>
                    <Image src="/img/layout-left.svg" alt="Fix columns" />
                    <ViewOptionTitle>
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Fix columns"
                      ) || "Fix columns"}
                    </ViewOptionTitle>
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(fixedColumnsCount) && (
                        <ViewOptionSubtitle>
                          {fixedColumnsCount}{" "}
                          {generateLangaugeText(
                            tableLan,
                            i18n?.language,
                            "Fixed"
                          ) || "Fixed"}
                        </ViewOptionSubtitle>
                      )}
                      <ChevronRightIcon fontSize={22} />
                    </Flex>
                  </Flex>
                )}
              {(isTimelineView || isCalendarView) && (
                <Flex
                  p="8px"
                  h="32px"
                  columnGap="8px"
                  alignItems="center"
                  borderRadius={6}
                  _hover={{bg: "#EAECF0"}}
                  cursor="pointer"
                  onClick={() =>
                    setOpenedMenu(
                      isTimelineView ? "timeline-settings" : "calendar-settings"
                    )
                  }>
                  <Image src="/img/settings.svg" alt="Settings" />
                  <ViewOptionTitle>
                    {generateLangaugeText(
                      tableLan,
                      i18n?.language,
                      "Settings"
                    ) || "Settings"}
                  </ViewOptionTitle>
                  <Flex ml="auto">
                    <ChevronRightIcon fontSize={22} />
                  </Flex>
                </Flex>
              )}
            </Box>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              <Flex
                p="8px"
                h="32px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                onClick={(e) => {
                  onDocsClick(e);
                  projectId === "c7168030-b876-4d01-8063-f7ad9f92e974" &&
                    navigateToOldTemplate();
                }}>
                <Image src="/img/file-docs.svg" alt="Docs" />
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "Docs") ||
                    "Docs"}
                </ViewOptionTitle>
                <ChevronRightIcon ml="auto" fontSize={22} />
              </Flex>
              <ExcelExportButton tableLan={tableLan} fieldsMap={fieldsMap} />
              <ExcelImportButton
                tableLan={tableLan}
                searchText={searchText}
                checkedColumns={checkedColumns}
                computedVisibleFields={computedVisibleFields}
                tableSlug={tableSlug}
              />
            </Box>
            <Box px="8px" py="4px">
              <DeleteViewButton
                relationView={relationView}
                view={view}
                refetchViews={refetchViews}
                tableLan={tableLan}
              />
            </Box>
          </>
        )}

        {openedMenu === "columns-visibility" && (
          <ColumnsVisibility
            setCloseOnBlur={setCloseOnBlur}
            relationView={relationView}
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
            settingsForm={settingsForm}
            columns={computedColumnsFor}
            queryClient={queryClient}
            refetchGetTableInfo={refetchGetTableInfo}
            refetchMenuViews={refetchMenuViews}
            refetchRelationViews={refetchRelationViews}
          />
        )}

        {openedMenu === "group" && (
          <Group
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}

        {openedMenu === "sub-group" && (
          <SubGroup
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
            title={"Sub Group"}
            viewUpdateMutation={viewUpdateMutation}
          />
        )}

        {openedMenu === "tab-group" && (
          <TabGroup
            relationView={relationView}
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            visibleRelationColumns={visibleRelationColumns}
            onBackClick={() => setOpenedMenu(null)}
            visibleColumns={visibleColumns}
            label={isBoardView ? "Group" : ""}
            isBoardView={isBoardView}
          />
        )}

        {openedMenu === "fix-column" && (
          <FixColumns
            relationView={relationView}
            tableSlug={tableSlug}
            tableLan={tableLan}
            view={view}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}
        {openedMenu === "timeline-settings" && (
          <TimelineSettings
            relationView={relationView}
            tableSlug={tableSlug}
            control={settingsForm.control}
            computedColumns={computedColumns}
            onBackClick={() => setOpenedMenu(null)}
            saveSettings={saveSettings}
            title={
              generateLangaugeText(tableLan, i18n?.language, "Settings") ||
              "Settings"
            }
          />
        )}
        {openedMenu === "calendar-settings" && (
          <CalendarSettings
            tableSlug={tableSlug}
            columns={visibleColumns}
            onBackClick={() => setOpenedMenu(null)}
            selectedTabIndex={selectedTabIndex}
            views={views}
            initialValues={view}
            title={
              generateLangaugeText(tableLan, i18n?.language, "Settings") ||
              "Settings"
            }
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ViewOptions;
