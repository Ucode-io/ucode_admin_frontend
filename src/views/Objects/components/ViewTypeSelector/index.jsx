import { AccountTree, CalendarMonth, Description, Settings, TableChart } from "@mui/icons-material";
import { Button, Modal, Popover } from "@mui/material";
import { useMemo, useState } from "react";
import { useQueryClient } from "react-query";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import ViewSettings from "../ViewSettings";
import style from "./style.module.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ButtonsPopover from "../../../../components/ButtonsPopover";
import constructorViewService from "../../../../services/constructorViewService";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Container, Draggable } from "react-smooth-dnd";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import { store } from "../../../../store";
import { applyDrag } from "../../../../utils/applyDrag";
import { viewTypes } from "../../../../utils/constants/viewTypes";
import ViewTypeList from "../ViewTypeList";
import MoreButtonViewType from "./MoreButtonViewType";

const ViewTabSelector = ({ selectedTabIndex, setSelectedTabIndex, views = [] }) => {
  const { t } = useTranslation();
  const { tableSlug } = useParams();
  const projectId = useSelector((state) => state.auth.projectId);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));
  const [selectedView, setSelectedView] = useState(null);
  const [typeNewView, setTypeNewView] = useState(null);

  const permissionCheckedViews = useMemo(() => {
    return views.filter((view) => {
      if (view?.attributes?.view_permission?.view) return view;
    });
  }, [views]);

  const handleClick = (event) => {
    setSelectedView("NEW");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
    constructorViewService.delete(id).then(() => {
      navigate("/reload", {
        state: {
          redirectUrl: window.location.pathname,
        },
      });
    });
  };

  const selectedTable = store.getState().menu.menuItem;
  const permissions = useSelector((state) => state.auth.permissions);

  const onDrop = (dropResult) => {
    const result = applyDrag(permissionCheckedViews, dropResult);
    if (!result) return;
    const computedViews = result.map((el, index) => el.id);
    const data = {
      ids: computedViews,
      project_id: projectId,
      table_slug: tableSlug,
    };
    constructorViewService.changeViewOrder(data).then(() => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
    });
  };

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
            <IconGenerator className={style.icon} icon={selectedTable?.isChild ? selectedTable?.icon : selectedTable?.icon} />
            <h3>{selectedTable?.label ?? selectedTable?.title}</h3>
          </div>
        </div>
        <div className={style.appTabs}>
          <Container
            lockAxis="x"
            onDrop={onDrop}
            dropPlaceholder={{ className: "drag-row-drop-preview" }}
            style={{ display: "flex", alignItems: "center" }}
            getChildPayload={(i) => permissionCheckedViews[i]}
            orientation="horizontal"
          >
            {permissionCheckedViews.map((view, index) => (
              <Draggable key={view.id}>
                <div onClick={() => setSelectedTabIndex(index)} className={`${style.element} ${selectedTabIndex === index ? style.active : ""}`}>
                  {view.type === "TABLE" && <TableChart className={style.icon} />}
                  {view.type === "CALENDAR" && <CalendarMonth className={style.icon} />}
                  {view.type === "CALENDAR HOUR" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
                  {view.type === "GANTT" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
                  {view.type === "TREE" && <AccountTree className={style.icon} />}
                  {view.type === "BOARD" && <IconGenerator className={style.icon} icon="brand_trello.svg" />}
                  {view.type === "FINANCE CALENDAR" && <MonetizationOnIcon className={style.icon} />}
                  <span>{view.name ? view.name : view.type}</span>

                  {view?.attributes?.view_permission?.edit && (
                    <div className={style.popoverElement}>
                      {/* {selectedTabIndex === index && <ButtonsPopover className={""} onEditClick={() => openModal(view)} onDeleteClick={() => deleteView(view.id)} />} */}
                      {selectedTabIndex === index && <MoreButtonViewType onEditClick={() => openModal(view)} onDeleteClick={() => deleteView(view.id)} />}
                    </div>
                  )}
                </div>
              </Draggable>
            ))}
          </Container>
        </div>
        {/* <div className={style.element} onClick={openModal}>
          <Settings className={style.icon} />
        </div> */}

        <PermissionWrapperV2 tableSlug={tableSlug} type="view_create">
          <div className={style.element} aria-describedby={id} variant="contained" onClick={handleClick}>
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
          {/* <div className={style.viewTypes}>
            {computedViewTypes.map((type, index) => (
              <button
                onClick={() => {
                  handleClose();
                  openModal();
                  setSelectedView("NEW");
                  setTypeNewView(type.value);
                }}
              >
                {type.value === "TABLE" && <TableChart className={style.icon} />}
                {type.value === "CALENDAR" && <CalendarMonth className={style.icon} />}
                {type.value === "CALENDAR HOUR" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
                {type.value === "GANTT" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
                {type.value === "TREE" && <AccountTree className={style.icon} />}
                {type.value === "BOARD" && <IconGenerator className={style.icon} icon="brand_trello.svg" />}
                {type.value === "FINANCE CALENDAR" && <MonetizationOnIcon className={style.icon} />}
                {type.label}
              </button>
            ))}
          </div> */}

          <ViewTypeList computedViewTypes={computedViewTypes} handleClose={handleClose} openModal={openModal} setSelectedView={setSelectedView} setTypeNewView={setTypeNewView} />
        </Popover>
      </div>

      <Modal className={style.modal} open={settingsModalVisible} onClose={closeModal}>
        <ViewSettings closeModal={closeModal} isChanged={isChanged} setIsChanged={setIsChanged} viewData={selectedView} typeNewView={typeNewView} />
      </Modal>
    </>
  );
};

export default ViewTabSelector;
