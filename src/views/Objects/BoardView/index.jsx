import { Box } from "@mui/material";
import { Container, Draggable } from "react-smooth-dnd";
import PageFallback from "../../../components/PageFallback";
import FastFilter from "../components/FastFilter";
import BoardColumn from "./BoardColumn";
import styles from "./style.module.scss";
import { ColumnHeaderBlock } from "./components/ColumnHeaderBlock";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import clsx from "clsx";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import DrawerDetailPage from "../DrawerDetailPage";
import { FIELD_TYPES } from "../../../utils/constants/fieldTypes";
import { useBoardViewProps } from "./useBoardViewProps";

const BoardView = ({
  view,
  fieldsMap,
  fieldsMapRel,
  menuItem,
  visibleColumns,
  visibleRelationColumns,
  setLayoutType,
  searchText,
  columnsForSearch,
}) => {
  const {
    loader,
    new_list,
    tableSlug,
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
    setSelectedRow,
    setDateInfo,
    setDefaultValue,
    getGroupCounts,
    subGroupFieldSlug,
    projectInfo,
    openDrawerModal,
    selectedRow,
    layout,
    selectedViewType,
    setSelectedViewType,
    navigateToEditPage,
    dateInfo,
    defaultValue,
    fixedElement,
    boardRef,
    t,
    isOnTop,
    subGroups,
    boardData,
    refetchAfterChangeBoard,
  } = useBoardViewProps({
    view,
    fieldsMap,
    fieldsMapRel,
    visibleColumns,
    visibleRelationColumns,
    menuItem,
  });

  return (
    <div className={styles.container} ref={boardRef}>
      {loader ? (
        <PageFallback />
      ) : (
        <div className={styles.wrapper}>
          {(view?.quick_filters?.length > 0 ||
            (new_list[tableSlug] &&
              new_list[tableSlug].some((i) => i.checked))) && (
            <div className={styles.filtersVisiblitiy}>
              <Box className={styles.block}>
                <p>{t("filters")}</p>
                <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
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
                  />
                </Draggable>
              ))}
            </Container>
          </div>
          <div
            className={styles.board}
            // style={{
            //   height: isFilterOpen
            //     ? "calc(100vh - 121px)"
            //     : "calc(100vh - 91px)",
            // }}
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
                      groupSlug={groupField.slug}
                      getGroupCounts={getGroupCounts}
                      groupItem={group?.name}
                      groupField={groupField}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <MaterialUIProvider>
        <DrawerDetailPage
          projectInfo={projectInfo}
          open={openDrawerModal}
          setOpen={setOpenDrawerModal}
          selectedRow={selectedRow}
          menuItem={menuItem}
          layout={layout}
          fieldsMap={fieldsMap}
          refetch={refetchAfterChangeBoard}
          setLayoutType={setLayoutType}
          selectedViewType={selectedViewType}
          setSelectedViewType={setSelectedViewType}
          navigateToEditPage={navigateToEditPage}
          dateInfo={dateInfo}
          defaultValue={defaultValue}
          modal
        />
      </MaterialUIProvider>
    </div>
  );
};

export default BoardView;
