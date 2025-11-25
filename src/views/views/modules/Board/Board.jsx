import {Container, Draggable} from "react-smooth-dnd";
import BoardColumn from "./BoardColumn";
import {ColumnHeaderBlock} from "./components/ColumnHeaderBlock";
import styles from "./style.module.scss";
import {FIELD_TYPES} from "@/utils/constants/fieldTypes";
import {useBoardProps} from "./useBoardProps";
import {BoardSkeleton} from "./components/BoardSkeleton";
import clsx from "clsx";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useParams } from "react-router-dom";

export const Board = () => {
  const {
    isLoading,
    onDrop,
    groups,
    groupField,
    getGroupFieldLabel,
    handleCreateItem,
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
    setDefaultValue,
    getGroupCounts,
    subGroupFieldSlug,
    projectInfo,
    fixedElement,
    boardRef,
    subGroups,
    boardData,
    view,
    fieldsMap,
    menuItem,
    searchText,
    columnsForSearch,
    layoutType,
    selectedView,
    setSelectedRow,
  } = useBoardProps();

  const { tableSlug: tableSlugFromParams } = useParams();
  const tableSlug =
    view?.relation_table_slug || tableSlugFromParams || view?.table_slug;

  return (
    <div className={styles.container} ref={boardRef}>
      {isLoading ? (
        <BoardSkeleton />
      ) : (
        <div className={styles.wrapper}>
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
                    handleCreateItem={handleCreateItem}
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
                            subGroup?.name,
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
                            // setLoading={setLoading}
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
                            setSelectedRow={setSelectedRow}
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
                            handleCreateItem={handleCreateItem}
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
                      // setLoading={setLoading}
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
                      setSelectedRow={setSelectedRow}
                      setDefaultValue={setDefaultValue}
                      searchText={searchText}
                      columnsForSearch={columnsForSearch}
                      groupSlug={groupField?.slug}
                      getGroupCounts={getGroupCounts}
                      groupItem={group?.name}
                      groupField={groupField}
                      layoutType={layoutType}
                      menuItem={menuItem}
                      handleCreateItem={handleCreateItem}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
