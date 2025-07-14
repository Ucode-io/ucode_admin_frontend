import {AccountTree, CalendarMonth, TableChart} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Box, Button, Modal, Popover } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import constructorViewService from "../../../../services/constructorViewService";
import { applyDrag } from "../../../../utils/applyDrag";
import {
  VIEW_TYPES_MAP,
  viewTypes,
} from "../../../../utils/constants/viewTypes";
import ViewSettings from "../ViewSettings";
import ViewTypeList from "../ViewTypeList";
import MoreButtonViewType from "./MoreButtonViewType";
import style from "./style.module.scss";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { viewsActions } from "../../../../store/views/view.slice";
import LanguageIcon from "@mui/icons-material/Language";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { detailDrawerActions } from "../../../../store/detailDrawer/detailDrawer.slice";
import { ViewCreate } from "../ViewCreate";
import MaterialUIProvider from "../../../../providers/MaterialUIProvider";
import FRow from "../../../../components/FormElements/FRow";
import HFSelect from "../../../../components/FormElements/HFSelect";
import constructorTableService from "../../../../services/constructorTableService";
import listToOptions from "../../../../utils/listToOptions";
import { useForm } from "react-hook-form";

const ViewTabSelector = ({
  relationView,
  selectedTabIndex,
  settingsModalVisible,
  setSettingsModalVisible,
  isChanged,
  setIsChanged,
  selectedView,
  defaultViewTab,
  setSelectedView,
  views = [],
  setTab,
  menuItem,
  setSelectedTabIndex = () => {},
}) => {
  const { t } = useTranslation();
  const { tableSlug, appId } = useParams();
  const projectId = useSelector((state) => state.auth.projectId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));
  const [typeNewView, setTypeNewView] = useState(null);
  const open = Boolean(anchorEl);
  const new_router = localStorage.getItem("new_router") === "true";
  const id = open ? "simple-popover" : undefined;
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const [selectedViewAnchor, setSelectedViewAnchor] = useState(null);
  const openViewSettings = (event) => {
    setSelectedViewAnchor(event.currentTarget);
  };
  const closeViewSettings = () => {
    setSelectedViewAnchor(null);
  };

  const [selectedViewTab, setSelectedViewTab] = useState(VIEW_TYPES_MAP.TABLE);
  const handleSelectViewType = (e, type) => {
    setSelectedViewTab(type);
    openViewSettings(e);
  };

  const handleClick = (event) => {
    setSelectedView("NEW");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openModal = (data) => {
    setIsChanged(false);
    setSettingsModalVisible(true);
    setSelectedView(data);
  };

  const closeModal = () => {
    setSettingsModalVisible(false);
    if (isChanged) queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
  };
  const deleteView = (id) => {
    constructorViewService.delete(id, tableSlug).then(() => {
      navigate("/reload", {
        state: {
          redirectUrl: window.location.pathname,
        },
      });
    });
  };

  const onDrop = (dropResult) => {
    const result = applyDrag(views, dropResult);
    if (!result) return;
    const computedViews = result.map((el, index) => el.id);
    const data = {
      ids: computedViews,
      project_id: projectId,
      table_slug: tableSlug,
    };
    constructorViewService.changeViewOrder(data, tableSlug).then(() => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

  const viewsList = useSelector((state) => state.groupField.viewsList);

  const table_slug = relationView
    ? viewsList?.[viewsList?.length - 1]?.table_slug
    : tableSlug;

  const { data } = useQuery(
    ["GET_TABLE_INFO", { viewsList }],
    () => {
      return constructorTableService.getTableInfo(table_slug, {
        data: {},
      });
    },
    {
      enabled: Boolean(table_slug),
      cacheTime: 10,
      select: (res) => {
        const fields = res?.data?.fields ?? [];

        return { fields };
      },
    }
  );

  const fields = data?.fields ?? [];

  const computedColumns = useMemo(() => {
    const filteredFields = fields?.filter(
      (el) => el?.type === "DATE" || el?.type === "DATE_TIME"
    );
    return listToOptions(filteredFields, "label", "slug");
  }, [fields]);

  const { control, watch, setError, clearErrors, setValue } = useForm({});

  return (
    <>
      <div className={style.selector} style={{ minWidth: "fit-content" }}>
        <div className={style.leftSide}>
          <div className={style.button}>
            <Button style={{ height: "100%" }} onClick={() => navigate(-1)}>
              <ArrowBackIcon style={{ color: "#000" }} />
            </Button>
          </div>

          <div className={style.title}>
            <IconGenerator
              className={style.icon}
              icon={menuItem?.isChild ? menuItem?.icon : menuItem?.icon}
            />
            <h3>{menuItem?.label ?? menuItem?.title}</h3>
          </div>
        </div>
        <div className={style.appTabs}>
          <Container
            lockAxis="x"
            onDrop={onDrop}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            style={{ display: "flex", alignItems: "center" }}
            getChildPayload={(i) => views[i]}
            orientation="horizontal"
          >
            {views.map((view, index) => (
              <Draggable key={view.id}>
                <div
                  onClick={() => {
                    dispatch(
                      viewsActions.setViewTab({
                        tableSlug: tableSlug,
                        tabIndex: index,
                      })
                    );
                    if (new_router) {
                      relationView
                        ? dispatch(detailDrawerActions.setDrawerTabIndex(index))
                        : dispatch(detailDrawerActions.setMainTabIndex(index));
                    } else {
                      setSelectedTabIndex(index);
                    }
                  }}
                  className={`${style.element} ${selectedTabIndex === index ? style.active : ""}`}
                >
                  {view.type === "TABLE" && (
                    <TableChart className={style.icon} />
                  )}
                  {view.type === "CALENDAR" && (
                    <CalendarMonth className={style.icon} />
                  )}
                  {view.type === "CALENDAR HOUR" && (
                    <IconGenerator
                      className={style.icon}
                      icon="chart-gantt.svg"
                    />
                  )}
                  {view.type === "GANTT" && (
                    <IconGenerator
                      className={style.icon}
                      icon="chart-gantt.svg"
                    />
                  )}
                  {view.type === "TREE" && (
                    <AccountTree className={style.icon} />
                  )}
                  {view.type === "BOARD" && (
                    <IconGenerator
                      className={style.icon}
                      icon="brand_trello.svg"
                    />
                  )}
                  {view.type === "FINANCE CALENDAR" && (
                    <MonetizationOnIcon className={style.icon} />
                  )}
                  {view.type === "TIMELINE" && (
                    <ClearAllIcon className={style.icon} />
                  )}
                  {view.type === "WEBSITE" && (
                    <LanguageIcon className={style.icon} />
                  )}
                  {view.type === "GRID" && (
                    <FiberNewIcon className={style.icon} />
                  )}
                  <span>
                    {(view?.attributes?.[`name_${i18n.language}`]
                      ? view?.attributes?.[`name_${i18n.language}`]
                      : view.type) ?? view?.name}
                  </span>

                  {view?.attributes?.view_permission?.edit && (
                    <div className={style.popoverElement}>
                      {selectedTabIndex === index && (
                        <MoreButtonViewType
                          onEditClick={() => openModal(view)}
                          onDeleteClick={() => deleteView(view.id)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </Draggable>
            ))}
          </Container>
        </div>

        <PermissionWrapperV2 tableSlug={tableSlug} type="view_create">
          <div
            className={style.element}
            aria-describedby={id}
            variant="contained"
            onClick={handleClick}
          >
            <AddIcon className={style.icon} style={{ color: "#000" }} />
            <strong style={{ color: "#000" }}>{t("add")}</strong>
          </div>
        </PermissionWrapperV2>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <ViewCreate
            views={views}
            computedViewTypes={computedViewTypes}
            handleClose={handleClose}
            openModal={openModal}
            setSelectedView={setSelectedView}
            setTypeNewView={setTypeNewView}
            handleSelectViewType={handleSelectViewType}
          />
          {/* <ViewTypeList
            views={views}
            computedViewTypes={computedViewTypes}
            handleClose={handleClose}
            openModal={openModal}
            setSelectedView={setSelectedView}
            setTypeNewView={setTypeNewView}
          /> */}
        </Popover>
        <Popover
          id={"view-settings"}
          open={!!selectedViewAnchor}
          anchorEl={selectedViewAnchor}
          onClose={closeViewSettings}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
            }}
          >
            <MaterialUIProvider>
              <FRow
                label={
                  selectedViewTab === "CALENDAR" ? "Date from" : "Time from"
                }
                required
              >
                <HFSelect
                  options={computedColumns}
                  control={control}
                  name="calendar_from_slug"
                  MenuProps={{ disablePortal: true }}
                  required={true}
                />
              </FRow>
              <FRow
                label={selectedViewTab === "CALENDAR" ? "Date to" : "Time to"}
                required
              >
                <HFSelect
                  options={computedColumns}
                  control={control}
                  name="calendar_to_slug"
                  MenuProps={{ disablePortal: true }}
                  required={true}
                />
              </FRow>
            </MaterialUIProvider>
          </Box>
        </Popover>
      </div>

      <Modal
        className={style.modal}
        open={settingsModalVisible}
        onClose={closeModal}
      >
        <ViewSettings
          closeModal={closeModal}
          defaultViewTab={defaultViewTab}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          viewData={selectedView}
          typeNewView={typeNewView}
          setTab={setTab}
          selectedView={selectedView}
        />
      </Modal>
    </>
  );
};

export default ViewTabSelector;
