import {Add} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useEffect, useMemo, useRef} from "react";
import {useState} from "react";
import {useParams, useSearchParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import BoardCardRowGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator";
import BoardPhotoGenerator from "../../../components/ElementGenerators/BoardCardRowGenerator/BoardPhotoGenerator";
import useDebounce from "../../../hooks/useDebounce";
import constructorObjectService from "../../../services/constructorObjectService";
import {groupFieldActions} from "../../../store/groupField/groupField.slice";
import {applyDrag} from "../../../utils/applyDrag";
import styles from "./style.module.scss";
import {updateQueryWithoutRerender} from "../../../utils/useSafeQueryUpdater";
import {useDispatch, useSelector} from "react-redux";
import {detailDrawerActions} from "../../../store/detailDrawer/detailDrawer.slice";
import {FIELD_TYPES} from "../../../utils/constants/fieldTypes";
import {useQueryClient} from "react-query";

const BoardColumn = ({
  group,
  boardData = [],
  fieldsMap,
  view = {},
  computedColumnsFor,
  boardRef,
  index: columnIndex,
  subGroupById,
  subItem,
  subGroupFieldSlug,
  setOpenDrawerModal,
  setSelectedRow,
  setDateInfo,
  setDefaultValue,
  tableSlug,
  selectedView,
  projectInfo,
  setLoading = () => {},
  setSelectedView = () => {},
  searchText,
  columnsForSearch,
  groupSlug,
  getGroupCounts,
  setBoardData,
  groupItem,
  groupField,
}) => {
  const dispatch = useDispatch();
  const {menuId} = useParams();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState();
  const [searchParams] = useSearchParams();
  const viewId = searchParams.get("v") ?? view?.id;
  const new_router = localStorage.getItem("new_router") === "true";
  const selectedGroupField = fieldsMap?.[view?.group_fields?.[0]];
  const isStatusType = selectedGroupField?.type === "STATUS";
  const [computedBoardData, setComputedBoardData] = useState(boardData);
  const initialTableInf = useSelector((state) => state.drawer.tableInfo);

  const mutateDrop = useDebounce((mutateData) => {
    constructorObjectService
      .update(tableSlug, {
        data: mutateData,
      })
      .then(() => {
        getGroupCounts();
      });
  }, 0);

  const onDrop = (dropResult) => {
    let dropResultTemp = {...dropResult};

    const payload = dropResultTemp.payload;

    if (dropResult?.addedIndex !== null && subGroupById) {
      payload[subGroupFieldSlug] = subItem === "Unassigned" ? null : subItem;
    }

    payload["color"] = color;

    if (subGroupById && payload[subGroupFieldSlug] !== subItem) {
      payload[subGroupFieldSlug] = subItem === "Unassigned" ? null : subItem;
    }

    if (
      groupField?.type === FIELD_TYPES.LOOKUP ||
      groupField?.type === FIELD_TYPES.LOOKUPS
    ) {
      payload[groupField?.slug] =
        group?.name === "Unassigned" ? null : group?.name;
    } else if (groupField?.type === FIELD_TYPES.MULTISELECT) {
      payload[groupSlug] = group?.name === "Unassigned" ? null : [group?.name];
    } else {
      payload[groupSlug] = group?.name === "Unassigned" ? null : group?.name;
    }

    const result = applyDrag(boardData, dropResultTemp);

    setIndex(dropResult?.addedIndex);

    if (result) {
      setComputedBoardData(result);

      if (subGroupById) {
        setBoardData((prev) => {
          return {
            ...prev,
            [subItem]: {
              ...prev[subItem],
              [groupItem]: result,
            },
          };
        });
      } else {
        setBoardData((prev) => {
          return {
            ...prev,
            [groupItem]: result,
          };
        });
      }
    }

    if (
      result?.length >= boardData?.length &&
      dropResult?.addedIndex !== dropResult?.removedIndex
    ) {
      const mutateData = {
        ...dropResult.payload,
        board_order: dropResult.addedIndex + 1,
      };

      mutateDrop(mutateData);
    }
  };

  const viewFields = useMemo(() => {
    return view.columns?.map((id) => fieldsMap[id]).filter((el) => el) ?? [];
  }, [view, fieldsMap]);

  const navigateToCreatePage = (slug) => {
    setOpenDrawerModal(true);
    setSelectedRow(null);
    if (isStatusType) {
      setDefaultValue({
        field: selectedGroupField?.slug,
        value: group?.name,
      });
    } else {
      setDefaultValue({
        field: group.name,
        value: group.name,
      });
    }

    if (subGroupById) {
      setDefaultValue((prev) => [
        prev,
        {
          field: subGroupFieldSlug,
          value: subItem,
        },
      ]);
    }
  };

  const navigateToEditPage = (row) => {
    setDateInfo({});
    setDefaultValue({});
    dispatch(
      groupFieldActions.addView({
        id: view?.id,
        label: view?.table_label || initialTableInf?.label,
        table_slug: view?.table_slug,
        relation_table_slug: view.relation_table_slug ?? null,
        is_relation_view: view?.is_relation_view,
        detailId: row?.guid,
      })
    );
    if (Boolean(selectedView?.is_relation_view)) {
      setSelectedView(view);
      setSelectedRow(row);
      dispatch(detailDrawerActions.openDrawer());
      updateQueryWithoutRerender("p", row?.guid);
    } else {
      if (new_router) {
        updateQueryWithoutRerender("p", row?.guid);
        if (view?.attributes?.url_object) {
          navigateToDetailPage(row);
        } else if (projectInfo?.new_layout) {
          setSelectedRow(row);
          dispatch(detailDrawerActions.openDrawer());
        } else {
          if (layoutType === "PopupLayout") {
            setSelectedRow(row);
            dispatch(detailDrawerActions.openDrawer());
          } else {
            navigateToDetailPage(row);
          }
        }
      } else {
        if (view?.attributes?.url_object) {
          navigateToDetailPage(row);
        } else if (projectInfo?.new_layout) {
          setSelectedRow(row);
          dispatch(detailDrawerActions.openDrawer());
        } else {
          if (layoutType === "PopupLayout") {
            setSelectedRow(row);
            dispatch(detailDrawerActions.openDrawer());
          } else {
            navigateToDetailPage(row);
          }
        }
      }
    }
  };

  // const navigateCreatePage = (row) => {
  //   if (projectInfo?.new_layout) {
  //     setSelectedRow(row);
  //     dispatch(detailDrawerActions.openDrawer());
  //   } else {
  //     if (layoutType === "PopupLayout") {
  //       setSelectedRow(row);
  //       dispatch(detailDrawerActions.openDrawer());
  //     } else {
  //       navigateToForm(tableSlug, "CREATE", {}, {}, menuId);
  //     }
  //   }
  // };

  const replaceUrlVariables = (urlTemplate, data) => {
    return urlTemplate.replace(/\{\{\$(\w+)\}\}/g, (_, variable) => {
      return data[variable] || "";
    });
  };

  const navigateToDetailPage = (row) => {
    if (
      view?.attributes?.navigate?.params?.length ||
      view?.attributes?.navigate?.url
    ) {
      const params = view?.attributes?.navigate?.params
        ?.map(
          (param) =>
            `${mergeStringAndState(param.key, row)}=${mergeStringAndState(
              param.value,
              row
            )}`
        )
        .join("&");

      const urlTemplate = view?.attributes?.navigate?.url;
      let query = urlTemplate;

      const variablePattern = /\{\{\$\.(.*?)\}\}/g;

      const matches = replaceUrlVariables(urlTemplate, row);

      navigate(`${matches}${params ? "?" + params : ""}`);
    } else {
      if (Boolean(new_router === "true"))
        navigate(`/${menuId}/detail?p=${row?.guid}`, {
          state: {
            viewId,
            tableSlug,
          },
        });
      else navigateToForm(tableSlug, "EDIT", row, {}, menuItem?.id ?? appId);
    }
  };

  const field = computedColumnsFor?.find((field) => field?.slug === groupSlug);

  const color =
    group?.color ||
    field?.attributes?.options?.find((item) => item?.slug === group?.slug)
      ?.color;

  const fixedElement = useRef(null);

  useEffect(() => {
    const board = boardRef.current;
    const el = fixedElement.current;
    if (!board || !el) return;

    const onScroll = () => {
      el.style.top = `${board.scrollTop}px`;
    };

    board.addEventListener("scroll", onScroll);

    return () => {
      board.removeEventListener("scroll", onScroll);
    };
  }, []);

  // const filteredComputedData = viewSearch({
  //   columnsForSearch,
  //   computedData,
  //   searchText,
  // });

  const photoViewFields = viewFields.filter(
    (field) => field?.type === FIELD_TYPES.PHOTO
  );

  useEffect(() => {
    if (boardData?.length !== computedBoardData?.length) {
      setComputedBoardData(boardData);
    }
  }, [boardData]);

  return (
    <>
      <div
        className={styles.column}
        style={{
          backgroundColor: color ? color + "08" : "rgba(84, 72, 49, 0.04)",
        }}>
        <Container
          groupName="subtask"
          getChildPayload={(i) => computedBoardData[i]}
          onDrop={(e) => {
            onDrop(e);
          }}
          dropPlaceholder={{
            className: "drag-row-drop-preview",
            showOnTop: true,
            animationDuration: 150,
          }}
          style={{
            padding: "10px 8px 0 8px",
          }}
          animationDuration={300}>
          {computedBoardData?.length > 0 ? (
            computedBoardData.map((el, boardDataIndex) => (
              <Draggable
                key={el.guid}
                index={index}
                className={styles.cardWrapper}>
                <div
                  className={styles.card}
                  key={el.guid}
                  onClick={() => navigateToEditPage(el)}
                  data-guid={el.guid}>
                  {photoViewFields.map((field) => (
                    <BoardPhotoGenerator
                      key={field.id}
                      field={field}
                      el={el}
                      imgProps={{
                        style: {
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                          pointerEvents: "none",
                        },
                        width: "260",
                        height: "200",
                      }}
                      style={{
                        overflow: "hidden",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    />
                  ))}
                  {viewFields.map((field) => (
                    <>
                      <BoardCardRowGenerator
                        key={field.id}
                        isStatus={field?.type === "STATUS"}
                        field={field}
                        el={el}
                        fieldsMap={fieldsMap}
                        slug={selectedGroupField?.slug}
                        columnIndex={columnIndex}
                        showFieldLabel
                        hintPosition={columnIndex === 0 ? "top" : "left"}
                      />
                    </>
                  ))}
                </div>
              </Draggable>
            ))
          ) : (
            <Draggable
              key="placeholder"
              className={styles.draggablePlaceholder}
            />
          )}
        </Container>

        <div className={styles.columnFooterBlock}>
          <Button
            style={{height: "41px"}}
            id={`addBoardItem`}
            variant="contain"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigateToCreatePage();
            }}>
            <Add /> Add new
          </Button>
        </div>
      </div>
    </>
  );
};

export default BoardColumn;
