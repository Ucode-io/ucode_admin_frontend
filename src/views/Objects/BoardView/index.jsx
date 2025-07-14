import {Box} from "@mui/material";
import {Container, Draggable} from "react-smooth-dnd";
import PageFallback from "../../../components/PageFallback";
import FastFilter from "../components/FastFilter";
import BoardColumn from "./BoardColumn";
import {ColumnHeaderBlock} from "./components/ColumnHeaderBlock";
import styles from "./style.module.scss";
import DrawerDetailPage from "../DrawerDetailPage";
import {FIELD_TYPES} from "../../../utils/constants/fieldTypes";
import {useBoardViewProps} from "./useBoardViewProps";
import {BoardSkeleton} from "./components/BoardSkeleton";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import OldDrawerDetailPage from "../DrawerDetailPage/OldDrawerDetailPage";
import clsx from "clsx";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import ModalDetailPage from "../ModalDetailPage/ModalDetailPage";

const BoardView = ({
  relationView = false,
  view,
  fieldsMap,
  fieldsMapRel,
  menuItem,
  visibleColumns,
  visibleRelationColumns,
  searchText,
  columnsForSearch,
  checkedColumns,
  layoutType,
  selectedRow,
  selectedView,
  setLoading = () => {},
  setSelectedRow = () => {},
  setLayoutType = () => {},
  setFormValue = () => {},
}) => {
  const {
    isLoading,
    new_list,
    onDrop,
    groups,
    groupField,
    getGroupFieldLabel,
    navigateToCreatePage,
    groupsCounts,
    isFilterOpen,
    subGroupById,
    handleToggle,
    openedGroups,
    getColor,
    subGroupField,
    getSubgroupFieldLabel,
    setBoardData,
    computedColumnsFor,
    setOpenDrawerModal,
    setDateInfo,
    setDefaultValue,
    getGroupCounts,
    subGroupFieldSlug,
    projectInfo,
    layout,
    selectedViewType,
    setSelectedViewType,
    fixedElement,
    boardRef,
    t,
    isOnTop,
    subGroups,
    boardData,
  } = useBoardViewProps({
    selectedView,
    view,
    fieldsMap,
    fieldsMapRel,
    visibleColumns,
    visibleRelationColumns,
    menuItem,
    searchText,
    checkedColumns,
    columnsForSearch,
    relationView,
  });
  const {
    id,
    menuId: menuid,
    tableSlug: tableSlugFromParams,
    appId,
  } = useParams();
  const new_router = localStorage.getItem("new_router") === "true";
  const tableSlug =
    view?.relation_table_slug || tableSlugFromParams || view?.table_slug;
  const open = useSelector((state) => state?.drawer?.openDrawer);

  return (
    <div className={styles.container} ref={boardRef}>
      {isLoading ? (
        <BoardSkeleton />
      ) : (
        <div className={styles.wrapper}>
          {(view?.quick_filters?.length > 0 ||
            (new_list[tableSlug] &&
              new_list[tableSlug].some((i) => i.checked))) && (
            <div className={styles.filtersVisiblitiy}>
              <Box className={styles.block}>
                <p>{t("filters")}</p>
                <FastFilter
                  tableSlug={tableSlug}
                  view={view}
                  fieldsMap={fieldsMap}
                  isVertical
                />
              </Box>
            </div>
          )}
          <div className={styles.boardHeader} ref={fixedElement}>
            <Container
              lockAxis="x"
              onDrop={onDrop}
              getChildPayload={(i) => groups[i]}
              orientation="horizontal"
              dragHandleSelector=".column-header"
              dragClass="drag-card-ghost"
              dropClass="drag-card-ghost-drop"
              autoScrollEnabled={false}
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drag-cards-drop-preview",
              }}
              style={{
                display: "flex",
              }}
            >
              {groups?.map((group, tabIndex) => (
                <Draggable
                  key={tabIndex}
                  style={{
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    padding: "0 16px",
                    paddingLeft: tabIndex === 0 ? "16px" : "8px",
                    paddingRight:
                      tabIndex === groups?.length - 1 ? "16px" : "0",
                  }}
                >
                  <ColumnHeaderBlock
                    field={
                      group?.name === "Unassigned"
                        ? "Unassigned"
                        : groupField?.type === FIELD_TYPES.LOOKUP ||
                            groupField?.type === FIELD_TYPES.LOOKUPS
                          ? getGroupFieldLabel(group)
                          : group?.name
                    }
                    group={group}
                    groupField={groupField}
                    navigateToCreatePage={navigateToCreatePage}
                    counts={groupsCounts}
                    computedColumnsFor={computedColumnsFor}
                    groupSlug={groupField?.slug}
                  />
                </Draggable>
              ))}
            </Container>
          </div>
          <div
            className={styles.board}
            style={{
              paddingBottom: isFilterOpen ? "130px" : "90px",
              // height: isFilterOpen
              //   ? "calc(100vh - 171px)"
              //   : "calc(100vh - 140px)",
              // paddingTop: "50px",
              // ? subGroupById
              //   ? "calc(100vh - 171px)"
              //   : "calc(100vh - 121px)"
              // : subGroupById
              //   ? "calc(100vh - 133px)"
              //   : "calc(100vh - 83px)",
            }}
          >
            {subGroupById ? (
              <div className={styles.boardSubGroupWrapper}>
                {subGroups?.map((subGroup, subGroupIndex) => (
                  <div key={subGroup?.name} data-sub-group={subGroup?.name}>
                    <button
                      className={styles.boardSubGroupBtn}
                      onClick={() => handleToggle(subGroup?.name)}
                    >
                      <span
                        className={clsx(styles.boardSubGroupBtnInner, {
                          [styles.selected]: openedGroups.includes(
                            subGroup?.name
                          ),
                        })}
                      >
                        <span className={styles.iconWrapper}>
                          <span className={styles.icon}>
                            <PlayArrowRoundedIcon fontSize="small" />
                          </span>
                        </span>
                        <span
                          className={styles.boardSubGroupBtnLabel}
                          style={{
                            color: getColor(subGroup?.name),
                            background: getColor(subGroup?.name) + 33,
                          }}
                        >
                          {subGroup?.name === "Unassigned"
                            ? "Unassigned"
                            : subGroupField?.type === FIELD_TYPES.LOOKUP ||
                                subGroupField?.type === FIELD_TYPES.LOOKUPS
                              ? getSubgroupFieldLabel(subGroup)
                              : subGroup?.name}
                        </span>
                      </span>
                    </button>
                    {openedGroups?.includes(subGroup?.name) && (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "flex-start",
                        }}
                      >
                        {groups?.map((group, index) => (
                          <BoardColumn
                            setLoading={setLoading}
                            selectedView={selectedView}
                            tableSlug={tableSlug}
                            projectInfo={projectInfo}
                            key={group.value}
                            group={group}
                            boardData={
                              boardData?.[subGroup?.name]?.[group?.name]
                            }
                            setBoardData={setBoardData}
                            fieldsMap={fieldsMap}
                            view={view}
                            computedColumnsFor={computedColumnsFor}
                            boardRef={boardRef}
                            index={index}
                            setOpenDrawerModal={setOpenDrawerModal}
                            setSelectedRow={setSelectedRow}
                            setDateInfo={setDateInfo}
                            setDefaultValue={setDefaultValue}
                            searchText={searchText}
                            columnsForSearch={columnsForSearch}
                            groupSlug={groupField.slug}
                            getGroupCounts={getGroupCounts}
                            groupItem={group?.name}
                            groupField={groupField}
                            subGroupIndex={subGroupIndex}
                            subGroupById={subGroupById}
                            subItem={subGroup?.name}
                            subGroupFieldSlug={subGroupFieldSlug}
                            layoutType={layoutType}
                            menuItem={menuItem}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                {groups?.map((group, index) => (
                  <div key={group.value} className={styles.draggable}>
                    <BoardColumn
                      setLoading={setLoading}
                      selectedView={selectedView}
                      tableSlug={tableSlug}
                      projectInfo={projectInfo}
                      key={group.value}
                      group={group}
                      boardData={boardData?.[group?.name]}
                      setBoardData={setBoardData}
                      fieldsMap={fieldsMap}
                      view={view}
                      computedColumnsFor={computedColumnsFor}
                      boardRef={boardRef}
                      index={index}
                      setOpenDrawerModal={setOpenDrawerModal}
                      setSelectedRow={setSelectedRow}
                      setDateInfo={setDateInfo}
                      setDefaultValue={setDefaultValue}
                      searchText={searchText}
                      columnsForSearch={columnsForSearch}
                      groupSlug={groupField?.slug}
                      getGroupCounts={getGroupCounts}
                      groupItem={group?.name}
                      groupField={groupField}
                      layoutType={layoutType}
                      menuItem={menuItem}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <MaterialUIProvider>
        {Boolean(!relationView && open && projectInfo?.new_layout) &&
        selectedViewType === "SidePeek" ? (
          new_router ? (
            <DrawerDetailPage
              view={view}
              projectInfo={projectInfo}
              open={open}
              setFormValue={setFormValue}
              selectedRow={selectedRow}
              menuItem={menuItem}
              layout={layout}
              fieldsMap={fieldsMap}
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
            />
          ) : (
            <OldDrawerDetailPage
              view={view}
              projectInfo={projectInfo}
              open={open}
              setFormValue={setFormValue}
              selectedRow={selectedRow}
              menuItem={menuItem}
              layout={layout}
              fieldsMap={fieldsMap}
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              selectedViewType={selectedViewType}
              setSelectedViewType={setSelectedViewType}
            />
          )
        ) : selectedViewType === "CenterPeek" ? (
          <ModalDetailPage
            view={view}
            projectInfo={projectInfo}
            open={open}
            setFormValue={setFormValue}
            selectedRow={selectedRow}
            menuItem={menuItem}
            layout={layout}
            fieldsMap={fieldsMap}
            layoutType={layoutType}
            setLayoutType={setLayoutType}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
          />
        ) : null}

        {Boolean(open && !projectInfo?.new_layout) && (
          <ModalDetailPage
            open={open}
            selectedRow={selectedRow}
            menuItem={menuItem}
            layout={layout}
            fieldsMap={fieldsMap}
            setLayoutType={setLayoutType}
            selectedViewType={selectedViewType}
            setSelectedViewType={setSelectedViewType}
          />
        )}
      </MaterialUIProvider>
    </div>
  );
};

export default BoardView;
