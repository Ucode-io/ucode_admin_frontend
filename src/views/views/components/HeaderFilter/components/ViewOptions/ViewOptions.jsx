import cls from "./styles.module.scss";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { default as SVG } from "react-inlinesvg";
import { generateLangaugeText } from "@/utils/generateLanguageText";
// import {
  // ColumnsVisibility,
//   DeleteViewButton,
//   ExcelExportButton,
//   ExcelImportButton,
//   FixColumns,
//   TabGroup,
// } from "../../table-redesign/components/ViewOptionElement";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
// import LayoutComponent from "../../table-redesign/LayoutComponent";
import {
  EyeIcon,
  FileDropdownIcon,
  FileIcon,
  LayoutIcon,
  PinIcon,
  SettingsIcon,
} from "@/utils/constants/icons";
import { CloseButton } from "@/components/CloseButton";
import { ViewSettingsModal } from "../../../ViewSettingsModal";
import { ColumnsVisibility } from "../ColumnsVisibility";
import { SubGroup } from "../SubGroup";
import { TimelineSettings } from "../TimelineSettings";
import { CalendarSettings } from "../CalendarSettings";
import { Group } from "../Group";
import { useViewOptionsProps } from "./useViewOptionsProps";
import LayoutComponent from "../LayoutComponent";
import { TabGroup } from "../TabGroup";
import { FixColumns } from "../FixColumns";

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

export const ViewOptions = ({
  handleOpenPopup,
  isChanged,
  setIsChanged = () => {},
  settingsForm,
}) => {
  const {
    isPopoverOpen,
    handleClosePopover,
    onToggle,
    ref,
    openedMenu,
    onViewNameChange,
    updateView,
    view,
    tableLan,
    i18n,
    t,
    refetchViews,
    isTimelineView,
    visibleColumnsCountForTimeline,
    visibleColumnsCount,
    roleInfo,
    permissions,
    setOpenedMenu,
    groupByColumnsCount,
    isBoardView,
    tabGroupColumnsCount,
    fieldsMap,
    fixedColumnsCount,
    isCalendarView,
    isRelationView,
    tableSlug,
    navigateToOldTemplate,
    viewUpdateMutation,
    computedColumns,
    saveSettings,
    visibleColumns,
    views,
    projectId,
    viewName,
    onDocsClick,
    selectedTabIndex,
  } = useViewOptionsProps({ settingsForm });

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        offset={[-145, 8]}
        closeOnBlur={false}
        onClose={handleClosePopover}
        modifiers={[
          {
            name: "computeStyles",
            options: {
              gpuAcceleration: false,
              adaptive: false,
            },
          },
        ]}
      >
        <PopoverTrigger>
          <IconButton
            onClick={onToggle}
            aria-label="more"
            icon={<Image src="/img/dots-vertical.svg" alt="more" />}
            variant="ghost"
            colorScheme="gray"
            style={{ marginLeft: "auto" }}
          />
        </PopoverTrigger>
        <PopoverContent ref={ref} w="250px" p={"8px"} borderRadius="8px">
          {openedMenu === null && (
            <>
              <Box py="4px" borderBottom="1px solid #D0D5DD">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <span className={cls.optionsTitle}>{t("view_options")}</span>
                  <CloseButton onClick={handleClosePopover} />
                </Box>
                <Flex mt="10px" columnGap="4px" mb="4px">
                  <InputGroup>
                    <Input
                      h="32px"
                      placeholder={t("view_name")}
                      defaultValue={viewName}
                      onChange={onViewNameChange}
                      borderRadius="8px"
                      fontSize="12px"
                      lineHeight="18px"
                    />
                    <InputLeftElement h="32px">
                      <SVG
                        src={`/img/${viewIcons?.[view?.type]}`}
                        width={16}
                        height={16}
                        color="#101828"
                      />
                    </InputLeftElement>
                    {updateView.isLoading && (
                      <InputRightElement>
                        <Spinner color="#475467" />
                      </InputRightElement>
                    )}
                  </InputGroup>
                </Flex>
                <OptionItem
                  icon={view?.type}
                  title={
                    generateLangaugeText(tableLan, i18n?.language, "General") ||
                    "General"
                  }
                  rightContent={viewName}
                  onClick={handleOpenPopup}
                />

                {localStorage.getItem("newLayout") === "false" && (
                  <LayoutComponent
                    isChanged={isChanged}
                    setIsChanged={setIsChanged}
                  />
                )}

                <ViewSettingsModal
                  refetchViews={refetchViews}
                  selectedTabIndex={selectedTabIndex}
                  tableLan={tableLan}
                  selectedView={view}
                  isChanged={isChanged}
                  setIsChanged={setIsChanged}
                />
              </Box>
              <Box py="4px" borderBottom="1px solid #D0D5DD">
                <OptionItem
                  title={
                    generateLangaugeText(tableLan, i18n?.language, "Columns") ||
                    "Columns"
                  }
                  icon={<EyeIcon />}
                  onClick={() => setOpenedMenu("columns-visibility")}
                  rightContent={
                    <Flex ml="auto" alignItems="center" columnGap="8px">
                      {Boolean(
                        isTimelineView
                          ? visibleColumnsCountForTimeline
                          : visibleColumnsCount
                      ) &&
                        (isTimelineView
                          ? visibleColumnsCountForTimeline
                          : visibleColumnsCount) > 0 && (
                          <>
                            {isTimelineView
                              ? visibleColumnsCountForTimeline
                              : visibleColumnsCount}{" "}
                          </>
                        )}
                    </Flex>
                  }
                />
                {(roleInfo === "DEFAULT ADMIN" || permissions?.group) &&
                  view?.type !== "BOARD" && (
                    <OptionItem
                      onClick={() => setOpenedMenu("group")}
                      title={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Group"
                        ) || "Group"
                      }
                      icon={<FileDropdownIcon />}
                      rightContent={
                        <>
                          {Boolean(groupByColumnsCount) && (
                            <div className={cls.viewOptionSubtitle}>
                              {groupByColumnsCount}{" "}
                              {generateLangaugeText(
                                tableLan,
                                i18n?.language,
                                "Group"
                              ) || "Group"}
                            </div>
                          )}
                        </>
                      }
                    />
                  )}
                {(roleInfo === "DEFAULT ADMIN" || permissions?.tab_group) &&
                  !isTimelineView && (
                    <OptionItem
                      onClick={() => setOpenedMenu("tab-group")}
                      title={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          isBoardView ? "Group" : "Tab Group"
                        ) || "Tab Group"
                      }
                      icon={<LayoutIcon />}
                      rightContent={
                        <>
                          {Boolean(tabGroupColumnsCount) && (
                            <div className={cls.viewOptionSubtitle}>
                              {tabGroupColumnsCount}{" "}
                              {generateLangaugeText(
                                tableLan,
                                i18n?.language,
                                "Group"
                              ) || "Group"}
                            </div>
                          )}
                        </>
                      }
                    />
                  )}
                {(roleInfo === "DEFAULT ADMIN" || permissions?.group) &&
                  view?.type === "BOARD" && (
                    <OptionItem
                      onClick={() => setOpenedMenu("sub-group")}
                      title={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Sub group"
                        ) || "Sub group"
                      }
                      icon={<HorizontalSplitOutlinedIcon color="inherit" />}
                      rightContent={
                        <>
                          {Boolean(tabGroupColumnsCount) && (
                            <div className={cls.viewOptionSubtitle}>
                              {fieldsMap?.[view?.attributes?.sub_group_by_id]
                                ?.label || "None"}
                            </div>
                          )}
                        </>
                      }
                    />
                  )}
                {(roleInfo === "DEFAULT ADMIN" || permissions?.fix_column) &&
                  !isTimelineView &&
                  !isBoardView && (
                    <OptionItem
                      onClick={() => setOpenedMenu("fix-column")}
                      icon={<PinIcon />}
                      title={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Fix columns"
                        ) || "Fix columns"
                      }
                      rightContent={
                        <>
                          {Boolean(fixedColumnsCount) && (
                            <div className={cls.viewOptionSubtitle}>
                              {fixedColumnsCount}{" "}
                              {generateLangaugeText(
                                tableLan,
                                i18n?.language,
                                "Fixed"
                              ) || "Fixed"}
                            </div>
                          )}
                        </>
                      }
                    />
                  )}
                {(isTimelineView || isCalendarView) && (
                  <OptionItem
                    onClick={() =>
                      setOpenedMenu(
                        isTimelineView
                          ? "timeline-settings"
                          : "calendar-settings"
                      )
                    }
                    title={
                      generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Settings"
                      ) || "Settings"
                    }
                    icon={<SettingsIcon />}
                  />
                )}
              </Box>
              <Box py="4px" borderBottom="1px solid #D0D5DD">
                <OptionItem
                  onClick={(e) => {
                    onDocsClick(e);
                    projectId === "c7168030-b876-4d01-8063-f7ad9f92e974" &&
                      navigateToOldTemplate();
                  }}
                  title={
                    generateLangaugeText(tableLan, i18n?.language, "Docs") ||
                    "Docs"
                  }
                  icon={<FileIcon />}
                />
                {/* <ExcelExportButton
                  tableLan={tableLan}
                  fieldsMap={fieldsMap}
                  tableSlug={tableSlug}
                />
                <ExcelImportButton
                  tableLan={tableLan}
                  searchText={searchText}
                  checkedColumns={checkedColumns}
                  computedVisibleFields={computedVisibleFields}
                  tableSlug={tableSlug}
                /> */}
              </Box>
              {/* <Box pt="4px">
                <DeleteViewButton
                  relationView={relationView}
                  view={view}
                  refetchViews={refetchViews}
                  tableLan={tableLan}
                />
              </Box> */}
            </>
          )}

          {openedMenu === "columns-visibility" && (
            <ColumnsVisibility onBackClick={() => setOpenedMenu(null)} />
          )}

          {openedMenu === "group" && (
            <Group onBackClick={() => setOpenedMenu(null)} />
          )}

          {openedMenu === "sub-group" && (
            <SubGroup
              onBackClick={() => setOpenedMenu(null)}
              title={"Sub Group"}
              viewUpdateMutation={viewUpdateMutation}
            />
          )}

          {openedMenu === "tab-group" && (
            <TabGroup
              tableLan={tableLan}
              onBackClick={() => setOpenedMenu(null)}
              label={isBoardView ? "Group" : ""}
            />
          )}

          {openedMenu === "fix-column" && (
            <FixColumns
              tableLan={tableLan}
              onBackClick={() => setOpenedMenu(null)}
            />
          )}
          {openedMenu === "timeline-settings" && (
            <TimelineSettings
              relationView={isRelationView}
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
      {isPopoverOpen && (
        <Box
          onClick={handleClosePopover}
          sx={{
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: "2",
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </>
  );
};

const OptionItem = ({ title, icon, rightContent, ...props }) => {
  return (
    <Flex
      color="#475467"
      padding="6px 8px"
      columnGap="4px"
      alignItems="center"
      borderRadius={6}
      _hover={{ bg: "#F2F4F7" }}
      as="span"
      cursor="pointer"
      {...props}
      // to={`/settings/constructor/apps/${appId}/objects/${layoutQuery.data?.table_id}/${tableSlug}?menuId=${menuId}`}
    >
      <Flex>
        {typeof icon === "string" ? (
          <SVG
            src={`/img/${viewIcons[icon]}`}
            width={16}
            height={16}
            color="#101828"
          />
        ) : (
          icon
        )}
      </Flex>
      <div className={cls.viewOptionTitle}>{title}</div>
      <Flex ml="auto" columnGap="4px" alignItems="center">
        {rightContent && (
          <Box color="#667085" fontWeight={400} fontSize={12}>
            {rightContent}
          </Box>
        )}
        <ChevronRightIcon fontSize={18} color="#D0D5DD" />
      </Flex>
    </Flex>
  );
};
