import { AccountTree, CalendarMonth, TableChart } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Button, Modal, Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Container, Draggable } from "react-smooth-dnd";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import constructorViewService from "../../../../services/constructorViewService";
import { store } from "../../../../store";
import { applyDrag } from "../../../../utils/applyDrag";
import { viewTypes } from "../../../../utils/constants/viewTypes";
import ViewSettings from "../ViewSettings";
import ViewTypeList from "../ViewTypeList";
import MoreButtonViewType from "./MoreButtonViewType";
import style from "./style.module.scss";
import ClearAllIcon from '@mui/icons-material/ClearAll';
import menuService from "../../../../services/menuService";

const ViewTabSelector = ({
  selectedTabIndex,
  setSelectedTabIndex,
  settingsModalVisible,
  setSettingsModalVisible,
  isChanged,
  setIsChanged,
  selectedView,
  defaultViewTab,
  setSelectedView,
  views = [],
  setTab,
}) => {
  const { t } = useTranslation();
  const { tableSlug } = useParams();
  const projectId = useSelector((state) => state.auth.projectId);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const computedViewTypes = viewTypes?.map((el) => ({ value: el, label: el }));
  const [typeNewView, setTypeNewView] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const { i18n } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    if (searchParams.get("menuId")) {
      menuService
      .getByID({
        menuId: searchParams.get("menuId"),
      })
      .then((res) => {
        setMenuItem(res);
      });
    }
  }, []);

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
            <IconGenerator className={style.icon} icon={menuItem?.isChild ? menuItem?.icon : menuItem?.icon} />
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
                <div onClick={() => setSelectedTabIndex(index)} className={`${style.element} ${selectedTabIndex === index ? style.active : ""}`}>
                  {view.type === "TABLE" && <TableChart className={style.icon} />}
                  {view.type === "CALENDAR" && <CalendarMonth className={style.icon} />}
                  {view.type === "CALENDAR HOUR" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
                  {view.type === "GANTT" && <IconGenerator className={style.icon} icon="chart-gantt.svg" />}
                  {view.type === "TREE" && <AccountTree className={style.icon} />}
                  {view.type === "BOARD" && <IconGenerator className={style.icon} icon="brand_trello.svg" />}
                  {view.type === "FINANCE CALENDAR" && <MonetizationOnIcon className={style.icon} />}
                  {view.type === "TIMELINE" && <ClearAllIcon className={style.icon}/>}
                  <span>{(view?.attributes?.[`name_${i18n.language}`] ? view?.attributes?.[`name_${i18n.language}`] : view.type) ?? view?.name}</span>

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
          <ViewTypeList views={views} computedViewTypes={computedViewTypes} handleClose={handleClose} openModal={openModal} setSelectedView={setSelectedView} setTypeNewView={setTypeNewView} />
        </Popover>
      </div>

      <Modal className={style.modal} open={settingsModalVisible} onClose={closeModal}>
        <ViewSettings
          closeModal={closeModal}
          defaultViewTab={defaultViewTab}
          isChanged={isChanged}
          setIsChanged={setIsChanged}
          viewData={selectedView}
          typeNewView={typeNewView}
          setTab={setTab}
        />
      </Modal>
    </>
  );
};

export default ViewTabSelector;
