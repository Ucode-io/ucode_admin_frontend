import cls from "../../styles/styles.module.scss";
import TableCard from "@/components/TableCard";
import Tag from "@/components/Tag";
import EmptyDataComponent from "@/components/EmptyDataComponent";
import { format } from "date-fns";
import { useActivityFeedTableProps } from "./useActivityFeedTableProps";
import { CTable, CTableBody, CTableCell, CTableHead, CTableRow } from "@/components/CTable";
import { ActivityFeedColors } from "@/components/Status";
import { TableDataSkeleton } from "@/components/TableDataSkeleton/TableDataSkeleton";
import { Box, Fade, Paper, Popper } from "@mui/material";
import { Image, Input, InputGroup, InputLeftElement, position } from "@chakra-ui/react";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import Select from "react-select";
import { customStyles } from "@/components/Status";

export const ActivityFeedTable = ({
  setHistories,
  type = "withoutPadding",
  requestType = "GLOBAL",
  apiKey,
  actionByVisible = true,
  dateFilters,
  actionValue,
}) => {

  const {
    pageCount,
    currentPage,
    setCurrentPage,
    handleActivityClick,
    histories,
    versionHistoryLoader,
    tableLan,
    i18n,
    onCollectionChange,
    onUserInfoChange,
    collectionText,
    userInfoText,
    onCollectionClick,
    isCollectionOpen,
    isUserInfoOpen,
    onUserInfoClick,
    collectionRef,
    userInfoRef,
  } = useActivityFeedTableProps({
    setHistories,
    requestType,
    apiKey,
    dateFilters,
    actionValue,
  })

  return (
    <>
      <TableCard cardStyles={{ padding: "1px" }}>
        <CTable
          loader={false}
          removableHeight={false}
          count={pageCount}
          page={currentPage}
          setCurrentPage={setCurrentPage}
          dataCount={histories?.count}
        >
          <CTableHead>
            <CTableCell className={cls.tableHeadCell} width={10}>
              №
            </CTableCell>
            <CTableCell className={cls.tableHeadCell} width={130}>
              Action
            </CTableCell>
            <CTableCell
              className={cls.tableHeadCell}
              id="collection"
              onClick={(e) => {
                onCollectionClick();
                e.stopPropagation();
              }}
              style={{ position: "relative" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {isCollectionOpen && (
                  <Input
                    ref={collectionRef}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    className={cls.searchInput}
                    id="collection_search_input"
                    defaultValue={collectionText}
                    value={collectionText}
                    placeholder={
                      generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Search"
                      ) || "Search"
                    }
                    onChange={onCollectionChange}
                  />
                )}
                <span>Collection</span>
                <Image
                  src="/img/search-lg.svg"
                  alt="search"
                  width={16}
                  height={16}
                />
              </Box>
            </CTableCell>
            <CTableCell className={cls.tableHeadCell}>Action On</CTableCell>
            {actionByVisible && (
              <CTableCell
                className={cls.tableHeadCell}
                onClick={(e) => {
                  onUserInfoClick();
                  e.stopPropagation();
                }}
                style={{ position: "relative" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {isUserInfoOpen && (
                    <Input
                      ref={userInfoRef}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className={cls.searchInput}
                      id="user_info_search_input"
                      defaultValue={userInfoText}
                      value={userInfoText}
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Search"
                        ) || "Search"
                      }
                      onChange={onUserInfoChange}
                    />
                  )}
                  <span>Action By</span>
                  <Image
                    src="/img/search-lg.svg"
                    alt="search"
                    width={16}
                    height={16}
                  />
                </Box>
              </CTableCell>
            )}
          </CTableHead>
          <CTableBody
            loader={false}
            columnsCount={5}
            dataLength={histories?.histories?.length}
          >
            {versionHistoryLoader ? (
              <TableDataSkeleton colLength={5} rowLength={10} height={33} />
            ) : (
              histories?.histories?.map((element, index) => {
                return (
                  <CTableRow
                    height="50px"
                    className={cls.row}
                    key={element.id}
                    onClick={() => {
                      handleActivityClick(element?.id);
                    }}
                    style={{
                      width: "80px",
                    }}
                  >
                    <CTableCell className={cls.tBodyCell}>
                      {(currentPage - 1) * 10 + index + 1}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      <Tag
                        shape="subtle"
                        color={ActivityFeedColors(element?.action_type)}
                        size="large"
                        style={{
                          background: `${ActivityFeedColors(element?.action_type)}`,
                        }}
                        className={cls.tag}
                      >
                        {element?.action_type?.charAt(0).toUpperCase() +
                          element?.action_type.slice(1).toLowerCase()}
                      </Tag>
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {element?.table_slug}
                    </CTableCell>
                    <CTableCell className={cls.tBodyCell}>
                      {format(new Date(element?.date), "yyyy-MM-dd HH:mm:ss")}
                    </CTableCell>
                    {actionByVisible && (
                      <CTableCell className={cls.tBodyCell}>
                        {element?.user_info}
                      </CTableCell>
                    )}
                  </CTableRow>
                );
              })
            )}
            <EmptyDataComponent
              columnsCount={5}
              isVisible={!versionHistoryLoader && !histories?.histories}
            />
          </CTableBody>
        </CTable>
      </TableCard>
      {/* <ActivitySinglePage
        open={drawerIsOpen}
        closeDrawer={closeDrawer}
        history={history}
        versionHistoryByIdLoader={versionHistoryByIdLoader}
      /> */}
    </>
  );
};

const SearchPopover = ({
  open,
  anchorEl,
  searchText,
  tableLan,
  i18n,
  inputChangeHandler,
  filterType,
}) => {

  return <Popper
    sx={{ zIndex: 1400, top: "0 !important" }}
    open={open}
    anchorEl={anchorEl}
    placement="top-end"
    transition
    onClick={(e) => e.stopPropagation()}
  >
    {({ TransitionProps }) => (
      <Fade {...TransitionProps} timeout={350} style={{ padding: 0 }}>
        <Box p={2} sx={{width: anchorEl?.offsetWidth}}>
          <Input
            autoFocus
            className={cls.searchInput}
            id="search_input"
            defaultValue={searchText[filterType]}
            value={searchText[filterType]}
            placeholder={
              generateLangaugeText(tableLan, i18n?.language, "Search") ||
              "Search"
            }
            onChange={(e) => inputChangeHandler(e.target.value)}
          />
        </Box>
      </Fade>
    )}
  </Popper>
}

const FilterPopover = ({open, anchorEl, options = [], searchText, tableLan, i18n, onChange}) => {

  return <Popper
    sx={{ zIndex: 1500 }}
    open={open}
    anchorEl={anchorEl}
    placement="top"
    transition
  >
    {({ TransitionProps }) => (
      <Fade {...TransitionProps} timeout={350} style={{ padding: 0 }}>
        <Box p={2} sx={{background: "#fff"}}>
          <Select
            options={[
              {label: "text", value: "re"},
              {label: "jo", value: "res"},
              {label: "jofd", value: "ads"},
              {label: "jo23", value: "refgrs"},
            ]}
            isClearable
            onChange={(newValue, {action}) => {
              //   changeHandler(newValue);
            }}
            styles={customStyles}
            isOptionSelected={(option, value) =>
              value.some((val) => val.guid === value)
            }
        />
        </Box>
      </Fade>
    )}
  </Popper>
}
