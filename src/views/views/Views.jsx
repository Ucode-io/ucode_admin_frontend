import { useViewsProps } from "./useViewsProps"
import {default as SVG} from "react-inlinesvg";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { MoreViews } from "./components/MoreViews";
import { viewIcons } from "@/utils/constants/viewTypes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { TableActions } from "./components/TableActions";
import chakraUITheme from "@/theme/chakraUITheme";
import { AIButton } from "./components/AIButton";
import { generateLangaugeText } from "@/utils/generateLanguageText";

export const Views = () => {

  const {
    viewsMap,
    viewsRef,
    visibleViews,
    overflowedViews,
    tableLan,
    viewId,
    i18n,
    tableName,
    tableSlug,
    handleViewClick,
    handleClick,
    navigate,
    setViewAnchorEl,
  } = useViewsProps();

  return <ChakraProvider theme={chakraUITheme}>
    <Flex
      minH="45px"
      h="36px"
      px="16px"
      alignItems="center"
      bg="#fff"
      borderBottom="1px solid #EAECF0"
      columnGap="8px"
    >
      {/* {relationView && (
        <IconButton
          aria-label="back"
          icon={<ArrowBackIcon fontSize={20} color="#344054" />}
          variant="ghost"
          colorScheme="gray"
          onClick={() => {
            handleClose();
          }}
          size="sm"
        />
      )} */}

      {/* {!relationView && (
        <IconButton
          aria-label="back"
          icon={<ArrowBackIcon fontSize={20} color="#344054" />}
          variant="ghost"
          colorScheme="gray"
          onClick={() => {
            navigate(-1);
          }}
          size="sm"
        />
      )} */}

      <IconButton
        aria-label="home"
        icon={<img src="/img/home.svg" alt="home" />}
        variant="ghost"
        colorScheme="gray"
        onClick={() => navigate("/")}
        ml="8px"
        size="sm"
      />
      <ChevronRightIcon fontSize={20} color="#344054" />
      <Flex
        py="4px"
        px="8px"
        bg="#EAECF0"
        borderRadius={6}
        color="#344054"
        fontWeight={500}
        alignItems="center"
        columnGap="8px"
      >
        <Flex
          w="16px"
          h="16px"
          bg="#EE46BC"
          borderRadius={4}
          columnGap={8}
          color="#fff"
          fontWeight={500}
          fontSize={11}
          justifyContent="center"
          alignItems="center"
        >
          {tableName?.[0]}
        </Flex>
        {tableName}
      </Flex>

      <Flex position="absolute" right="16px" gap="8px">
        <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
          <TableActions tableSlug={tableSlug} tableLan={tableLan} />
        </PermissionWrapperV2>
        <AIButton />
      </Flex>
      {/* <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
        <Button
          h="30px"
          ml="auto"
          onClick={navigateToSettingsPage}
          variant="outline"
          colorScheme="gray"
          borderColor="#D0D5DD"
          color="#344054"
          leftIcon={<Image src="/img/settings.svg" alt="settings" />}
          borderRadius="8px"
        >
          {generateLangaugeText(
            tableLan,
            i18n?.language,
            "Table Settings"
          ) || "Table Settings"}
        </Button>
      </PermissionWrapperV2> */}
    </Flex>
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
            key={view.id}
            variant="ghost"
            colorScheme="gray"
            mx={"4px"}
            leftIcon={
              <SVG
                src={`/img/${viewIcons[view.type]}`}
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
                view.type
              : view?.attributes?.[`name_${i18n?.language}`] ||
                view?.name ||
                view.type}

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
          <MoreViews
            tableLan={tableLan}
            views={overflowedViews}
          />
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
            {generateLangaugeText(tableLan, i18n?.language, "View") ||
              "View"}
          </Button>
        </PermissionWrapperV2>
      )}

      {/* {view?.type === "FINANCE CALENDAR" && (
        <CRangePickerNew onChange={setDateFilters} value={dateFilters} />
      )} */}

      {/* <ViewCreatePopup
        fieldsMap={fieldsMap}
        fieldsMapRel={fieldsMapRel}
        handleClose={handleClose}
        handleClosePop={handleClosePop}
        menuId={menuId}
        refetchViews={refetchViews}
        relationFields={relationFields}
        relationView={relationView}
        setSelectedView={setSelectedView}
        tableSlug={tableSlug}
        viewAnchorEl={viewAnchorEl}
        views={views}
      /> */}

      {/* {view?.type !== VIEW_TYPES_MAP.WEBSITE && (
        <Popover placement="bottom-end">
          <InputGroup ml="auto" w="320px">
            <InputLeftElement>
              <Image src="/img/search-lg.svg" alt="search" />
            </InputLeftElement>
            <Input
              id="search_input"
              defaultValue={searchText}
              placeholder={
                generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Search"
                ) || "Search"
              }
              onChange={(ev) => inputChangeHandler(ev.target.value)}
            />

            {(roleInfo === "DEFAULT ADMIN" ||
              permissions?.search_button) && (
              <PopoverTrigger>
                <InputRightElement>
                  <IconButton
                    w="24px"
                    h="24px"
                    aria-label="more"
                    icon={
                      <Image src="/img/dots-vertical.svg" alt="more" />
                    }
                    variant="ghost"
                    colorScheme="gray"
                    size="xs"
                  />
                </InputRightElement>
              </PopoverTrigger>
            )}
          </InputGroup>

          <PopoverContent
            w="280px"
            p="8px"
            display="flex"
            flexDirection="column"
            maxH="300px"
            overflow="auto"
          >
            {columnsForSearch.map((column) => (
              <Flex
                key={column.id}
                as="label"
                p="8px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                _hover={{ bg: "#EAECF0" }}
                cursor="pointer"
              >
                {getColumnIcon({ column })}
                <ViewOptionTitle>
                  {column?.attributes?.[`label_${i18n.language}`] ||
                    column?.label}
                </ViewOptionTitle>
                <Switch
                  ml="auto"
                  isChecked={column.is_search}
                  onChange={(e) =>
                    updateField({
                      data: {
                        fields: columnsForSearch.map((c) =>
                          c.id === column.id
                            ? { ...c, is_search: e.target.checked }
                            : c
                        ),
                      },
                      tableSlug,
                    })
                  }
                />
              </Flex>
            ))}
          </PopoverContent>
        </Popover>
      )}

      {view?.type !== "SECTION" &&
        view?.type !== VIEW_TYPES_MAP.WEBSITE && (
          <Box display="flex">
            {view?.type === VIEW_TYPES_MAP.TABLE && (
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

      {view?.type === "TIMELINE" && noDates.length > 0 && (
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

      {view?.type !== "SECTION" && (
        <>
          {view?.type !== VIEW_TYPES_MAP.WEBSITE && (
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
                  "Create item"
                ) || "Create item"}
              </Button>
            </PermissionWrapperV2>
          )}
          <PermissionWrapperV2 tableSlug={tableSlug} type="settings">
            <ViewOptions
              tableInfo={tableInfo}
              relationView={relationView}
              refetchViews={refetchViews}
              selectedTabIndex={selectedTabIndex}
              isChanged={isChanged}
              setIsChanged={setIsChanged}
              selectedView={selectedView}
              tableLan={tableLan}
              view={view}
              viewName={viewName}
              fieldsMap={fieldsMap}
              visibleRelationColumns={visibleRelationColumns}
              checkedColumns={checkedColumns}
              projectId={projectId}
              onDocsClick={() => {
                dispatch(
                  detailDrawerActions.setDrawerTabIndex(views?.length)
                );
                if (new_router) {
                  navigate(`/${menuId}/templates?tableSlug=${tableSlug}`);
                } else {
                  navigate(
                    `/main/${appId}/object/${tableSlug}/templates`
                  );
                }
              }}
              searchText={searchText}
              computedVisibleFields={computedVisibleFields}
              handleOpenPopup={handleOpenPopup}
              queryClient={queryClient}
              settingsForm={settingsForm}
              views={views}
              refetchMenuViews={refetchMenuViews}
              refetchRelationViews={refetchRelationViews}
            />
          </PermissionWrapperV2>
        </>
      )} */}
    </Flex>
  </ChakraProvider>
}
