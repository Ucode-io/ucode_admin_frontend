import { Description } from "@mui/icons-material";
import { useEffect, useId } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import FiltersBlock from "../../../components/FiltersBlock";
import PageFallback from "../../../components/PageFallback";
import useFilters from "../../../hooks/useFilters";
import useTabRouter from "../../../hooks/useTabRouter";
import constructorObjectService from "../../../services/constructorObjectService";
import { applyDrag } from "../../../utils/applyDrag";
import { getRelationFieldTabsLabel } from "../../../utils/getRelationFieldLabel";
import ExcelButtons from "../components/ExcelButtons";
import FastFilter from "../components/FastFilter";
import FastFilterButton from "../components/FastFilter/FastFilterButton";
import SettingsButton from "../components/ViewSettings/SettingsButton";
import ViewTabSelector from "../components/ViewTypeSelector";
import BoardColumn from "./BoardColumn";
import styles from "./style.module.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Menu from "@mui/material/Menu";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import { useTranslation } from "react-i18next";
import constructorViewService from "../../../services/constructorViewService";
import ColumnVisible from "../ColumnVisible";
import { useForm } from "react-hook-form";
import CalendarGroupByButton from "../CalendarView/CalendarGroupColumns";

const BoardView = ({
  view,
  setViews,
  selectedTabIndex,
  setSelectedTabIndex,
  views,
  fieldsMap,
  selectedTable,
}) => {
  const visibleForm = useForm();
  const queryClient = useQueryClient();
  const { tableSlug } = useParams();
  const { new_list } = useSelector((state) => state.filter);
  const id = useId();
  const { t } = useTranslation();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const [tab, setTab] = useState();
  const { navigateToForm } = useTabRouter();
  const { filters } = useFilters(tableSlug, view.id);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex] ?? {});
  }, [views, selectedTabIndex]);

  const { data = [], isLoading: dataLoader } = useQuery(
    ["GET_OBJECT_LIST_ALL", { tableSlug, id, filters }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: filters ?? {},
      });
    },
    {
      select: ({ data }) => data.response ?? [],
    }
  );

  const updateView = (tabs) => {
    const computedData = {
      ...selectedView,
      attributes: {
        ...selectedView?.attributes,
        tabs,
      },
    };
    constructorViewService.update(computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const groupFieldId = view?.group_fields?.[0];
  const groupField = fieldsMap[groupFieldId];

  const { data: tabs, isLoading: tabsLoader } = useQuery(
    queryGenerator(groupField, filters, updateView)
  );

  const loader = dataLoader || tabsLoader;

  const navigateToCreatePage = () => {
    navigateToForm(tableSlug);
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(view?.attributes?.tabs, dropResult);
    if (result) {
      updateView(result);
    }
  };

  const {
    data: { visibleViews, visibleColumns, visibleRelationColumns } = {
      visibleViews: [],
      visibleColumns: [],
      visibleRelationColumns: [],
    },
    isVisibleLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0 },
      });
    },
    {
      select: ({ data }) => {
        return {
          visibleViews: data?.views ?? [],
          visibleColumns: data?.fields ?? [],
          visibleRelationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  useEffect(() => {
    updateView(view?.attributes?.tabs);
  }, [tabs]);

  return (
    <div>
      <FiltersBlock
        extra={
          <>
            <FastFilterButton view={view} />

            <button className={styles.moreButton} onClick={handleClick}>
              <MoreHorizIcon
                style={{
                  color: "#888",
                }}
              />
            </button>
            <Menu
              open={open}
              onClose={handleClose}
              anchorEl={anchorEl}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    // width: 100,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
            >
              <div className={styles.menuBar}>
                <ExcelButtons />
                <div
                  className={styles.template}
                  onClick={() => setSelectedTabIndex(views?.length)}
                >
                  <div
                    className={`${styles.element} ${
                      selectedTabIndex === views?.length ? styles.active : ""
                    }`}
                  >
                    <Description
                      className={styles.icon}
                      style={{ color: "#6E8BB7" }}
                    />
                  </div>
                  <span>{t("template")}</span>
                </div>
                <PermissionWrapperV2 tableSlug={tableSlug} type="update">
                  <SettingsButton />
                </PermissionWrapperV2>
              </div>
            </Menu>
          </>
        }
      >
        <ViewTabSelector
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          views={views}
          setViews={setViews}
          selectedTable={selectedTable}
          settingsModalVisible={settingsModalVisible}
          setSettingsModalVisible={setSettingsModalVisible}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          setTab={setTab}
        />
      </FiltersBlock>

      <div
        className="title"
        style={{
          padding: "10px",
          background: "#fff",
          borderBottom: "1px solid #E5E9EB",
          marginBottom: "10px",
          marginLeft: "auto",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ColumnVisible
          selectedTabIndex={selectedTabIndex}
          views={views}
          columns={visibleColumns}
          relationColumns={visibleRelationColumns}
          isLoading={isVisibleLoading}
          form={visibleForm}
          text={"Columns"}
        />
        <CalendarGroupByButton
          selectedTabIndex={selectedTabIndex}
          text="Group"
          width="105px"
          views={views}
          columns={visibleColumns}
          relationColumns={visibleRelationColumns}
          isLoading={isVisibleLoading}
        />
      </div>

      {/* <FastFilter fieldsMap={fieldsMap} view={view} /> */}
      {loader ? (
        <PageFallback />
      ) : (
        <div className={styles.wrapper}>
          {(view?.quick_filters?.length > 0 ||
            (new_list[tableSlug] &&
              new_list[tableSlug].some((i) => i.checked))) && (
            <div className={styles.filters}>
              <p>{t("filters")}</p>
              <FastFilter view={view} fieldsMap={fieldsMap} isVertical />
            </div>
          )}

          <div className={styles.board}>
            <Container
              lockAxis="x"
              onDrop={onDrop}
              orientation="horizontal"
              dragHandleSelector=".column-header"
              dragClass="drag-card-ghost"
              dropClass="drag-card-ghost-drop"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "drag-cards-drop-preview",
              }}
              style={{ display: "flex", gap: 24 }}
            >
              {view?.attributes?.tabs?.map((tab) => (
                <Draggable key={tab.value}>
                  <BoardColumn
                    key={tab.value}
                    tab={tab}
                    data={data}
                    fieldsMap={fieldsMap}
                    view={view}
                    navigateToCreatePage={navigateToCreatePage}
                  />
                </Draggable>
              ))}
            </Container>
          </div>
        </div>
      )}
    </div>
  );
};

const queryGenerator = (groupField, filters = {}, updateView) => {
  if (!groupField)
    return {
      queryFn: () => {},
    };

  const filterValue = filters[groupField.slug];
  const computedFilters = filterValue ? { [groupField.slug]: filterValue } : {};

  if (groupField?.type === "PICK_LIST" || groupField?.type === "MULTISELECT") {
    return {
      queryKey: ["GET_GROUP_OPTIONS", groupField.id],
      queryFn: () =>
        groupField?.attributes?.options?.map((el) => ({
          label: el.label,
          value: el.value,
          slug: groupField?.slug,
        })),
    };
  }

  if (groupField?.type === "LOOKUP") {
    const queryFn = () =>
      constructorObjectService.getList(groupField.table_slug, {
        data: computedFilters ?? {},
      });

    return {
      queryKey: [
        "GET_OBJECT_LIST_ALL",
        { tableSlug: groupField.table_slug, filters: computedFilters },
      ],
      queryFn,
      select: (res) => {
        return res?.data?.response?.map((el) => ({
          label: getRelationFieldTabsLabel(groupField, el),
          value: el.guid,
          slug: groupField?.slug,
        }));
      },
    };
  }
};

export default BoardView;
