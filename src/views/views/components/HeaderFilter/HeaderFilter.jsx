import { default as SVG } from "react-inlinesvg";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { VIEW_TYPES_MAP, viewIcons } from "@/utils/constants/viewTypes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { SortIcon } from "@/utils/constants/icons";
import { useHeaderFilterProps } from "./useHeaderFilterProps";
import { MoreViews } from "../MoreViews";
import { ViewCreatePopup } from "../ViewCreatePopup";
import { SearchPopover } from "../SearchPopover";
import { SortPopover } from "./components/SortPopover";
import { FilterPopover } from "./components/FilterPopover";
import { FilterButton } from "./components/FilterButton";
import { FiltersList } from "./components/FiltersList";
import { ViewOptions } from "./components/ViewOptions";
import { LayoutPopup } from "./components/LayoutPopup";
import MaterialUIProvider from "@/providers/MaterialUIProvider";

export const HeaderFilter = ({
  noDates,
  handleAddDate,
  navigateCreatePage,
  settingsForm,
}) => {
  const {
    viewsRef,
    visibleViews,
    overflowedViews,
    viewId,
    tableSlug,
    i18n,
    viewType,
    view,
    views,
    menuId,
    refetchViews,
    isRelationView,
    setSelectedView,
    handleCloseCreateViewPopup,
    viewAnchorEl,
    setViewAnchorEl,
    handleViewClick,
    handleClick,
    tableLan,
    handleSearchOnChange,
    orderBy,
    handleSortClick,
    handleCloseSortPopup,
    isSortPopupOpen,
    sortPopupAnchorEl,
    handleChangeOrder,
    setOrderBy,
    setSortedDatas,
    fieldsMap,
    fieldsMapRel,
    relationFields,
    visibleColumns,
    isPopupOpen,
    handleOpenPopup,
    handleClosePopup,
    isChanged,
    setIsChanged,
    viewForm,
  } = useHeaderFilterProps();

  return (
    <>
      <Flex
        minH="40px"
        h="40px"
        px="16px"
        alignItems="center"
        bg="#fff"
        borderBottom="1px solid #EAECF0"
        columnGap="5px"
      >
        <Flex
          ref={viewsRef}
          w={"70%"}
          sx={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
          overflow={"scroll"}
        >
          {(visibleViews ?? []).map((view, index) => (
            <Button
              p={"0 6px"}
              minW={"80px"}
              key={view?.id}
              variant="ghost"
              colorScheme="gray"
              mx={"4px"}
              leftIcon={
                <SVG
                  src={`/img/${viewIcons[view?.type]}`}
                  color={viewId === view?.id ? "#175CD3" : "#475467"}
                  width={18}
                  height={18}
                />
              }
              fontSize={13}
              h={"30px"}
              fontWeight={500}
              color={viewId === view?.id ? "#175CD3" : "#475467"}
              bg={viewId === view?.id ? "#D1E9FF" : "#fff"}
              _hover={viewId === view?.id ? { bg: "#D1E9FF" } : undefined}
              onClick={(e) => {
                e.stopPropagation();
                if (overflowedViews?.length > 0) {
                  if (index !== visibleViews?.length - 1) {
                    handleViewClick(view, index);
                  } else {
                    handleClick(e);
                  }
                } else handleViewClick(view, index);
              }}
            >
              {view?.is_relation_view
                ? view?.attributes?.[`name_${i18n?.language}`] ||
                  view?.table_label ||
                  view?.type
                : view?.attributes?.[`name_${i18n?.language}`] ||
                  view?.name ||
                  view?.type}

              {overflowedViews?.length > 0 &&
                index === visibleViews?.length - 1 && (
                  <Box
                    onClick={handleClick}
                    sx={{
                      height: "19px",
                      cursor: "pointer",
                    }}
                  >
                    <KeyboardArrowDownIcon />
                  </Box>
                )}
            </Button>
          ))}
          {overflowedViews?.length > 0 && (
            <MoreViews tableLan={tableLan} views={overflowedViews} />
          )}
        </Flex>

        {!overflowedViews?.length > 0 && (
          <PermissionWrapperV2 tableSlug={tableSlug} type="view_create">
            <Button
              leftIcon={<Image src="/img//plus-icon.svg" alt="Add" />}
              variant="ghost"
              colorScheme="gray"
              color="#475467"
              onClick={(e) => setViewAnchorEl(e.currentTarget)}
            >
              {generateLangaugeText(tableLan, i18n?.language, "View") || "View"}
            </Button>
          </PermissionWrapperV2>
        )}

        {/* {view?.type === "FINANCE CALENDAR" && (
<CRangePickerNew onChange={setDateFilters} value={dateFilters} />
)} */}

        <ViewCreatePopup
          fieldsMap={fieldsMap}
          fieldsMapRel={fieldsMapRel}
          handleClosePop={handleCloseCreateViewPopup}
          menuId={menuId}
          refetchViews={refetchViews}
          relationFields={relationFields}
          relationView={isRelationView}
          setSelectedView={setSelectedView}
          tableSlug={tableSlug}
          viewAnchorEl={viewAnchorEl}
          views={views}
        />

        {viewType !== VIEW_TYPES_MAP.WEBSITE && (
          <SearchPopover handleSearchOnChange={handleSearchOnChange} />
        )}

        {viewType !== VIEW_TYPES_MAP.SECTION &&
          viewType !== VIEW_TYPES_MAP.WEBSITE && (
            <Box display="flex">
              {viewType === VIEW_TYPES_MAP.TABLE && (
                <IconButton
                  fontSize="1.7rem"
                  variant="ghost"
                  color={orderBy ? "#0365F2" : "#475467"}
                  sx={{ color: orderBy ? "#0365F2" : "#475467" }}
                  icon={<SortIcon color="currentColor" />}
                  onClick={handleSortClick}
                />
              )}
              <SortPopover
                tableSlug={tableSlug}
                open={isSortPopupOpen}
                anchorEl={sortPopupAnchorEl}
                handleClose={handleCloseSortPopup}
                fieldsMap={fieldsMap}
                setSortedDatas={setSortedDatas}
                handleChangeOrder={handleChangeOrder}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
              />
              <FilterPopover
                tableLan={tableLan}
                view={view}
                visibleColumns={visibleColumns}
                refetchViews={refetchViews}
                tableSlug={tableSlug}
              >
                <FilterButton view={view} />
              </FilterPopover>
            </Box>
          )}

        {viewType === "TIMELINE" && noDates.length > 0 && (
          <Popover>
            <PopoverTrigger>
              <Button
                variant="text"
                _hover={{ backgroundColor: "rgba(0, 122, 255, 0.08)" }}
                fontWeight={400}
                color={"#888"}
              >
                No date ({noDates.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
                {noDates.map((item) => (
                  <Box
                    p="8px"
                    h="32px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    _hover={{ bg: "#EAECF0" }}
                    cursor="pointer"
                    key={item?.guid}
                    fontSize={12}
                    onClick={() => handleAddDate(item)}
                  >
                    {item?.[view?.attributes?.visible_field?.split("/")[0]]}
                  </Box>
                ))}
              </Box>
            </PopoverContent>
          </Popover>
        )}

        {viewType !== "SECTION" && (
          <>
            {viewType !== VIEW_TYPES_MAP.WEBSITE && (
              <PermissionWrapperV2 tableSlug={tableSlug} type="write">
                <Button
                  minW={"auto"}
                  width={"auto"}
                  h={"30px"}
                  px={4}
                  onClick={() => navigateCreatePage()}
                >
                  {generateLangaugeText(
                    tableLan,
                    i18n?.language,
                    "Create item",
                  ) || "Create item"}
                </Button>
              </PermissionWrapperV2>
            )}
            <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
              <ViewOptions
                handleOpenPopup={handleOpenPopup}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
                settingsForm={settingsForm}
              />
            </PermissionWrapperV2>
          </>
        )}
      </Flex>
      <FiltersList />
      <MaterialUIProvider>
        <LayoutPopup
          open={isPopupOpen}
          onClose={handleClosePopup}
          control={viewForm.control}
          handleSubmit={viewForm.handleSubmit}
          viewForm={viewForm}
        />
      </MaterialUIProvider>
    </>
  );
};
