import { Save } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import Footer from "../../components/Footer";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import layoutService from "../../services/layoutService";
import { store } from "../../store";
import { showAlert } from "../../store/alert/alert.thunk";
import { sortSections } from "../../utils/sectionsOrderNumber";
import RelationSectionForModal from "./RelationSection/RelationSectionForModal";
import FormCustomActionButton from "./components/CustomActionsButton/FormCustomActionButtons";
import styles from "./style.module.scss";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import SummarySectionValuesForModal from "./ModalDetailPage/SummarySectionValuesForModal";

const ObjectsFormPageForModal = ({ tableSlugFromProps, menuItem, handleClose, fieldsMap, modal = false, selectedRow, dateInfo, fullScreen, setFullScreen = () => {} }) => {
  const { id: idFromParam, tableSlug: tableSlugFromParam, appId } = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const [editAcces, setEditAccess] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const { state = {} } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { navigateToForm } = useTabRouter();
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const menu = store.getState().menu;
  const invite = menu.menuItem?.data?.table?.is_login_table;
  const isInvite = menu.invite;
  const { i18n } = useTranslation();
  const [layout, setLayout] = useState({});

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { ...state, ...dateInfo, invite: isInvite ? invite : false },
  });
  const tableInfo = store.getState().menu.menuItem;

  const getAllData = async () => {
    setLoader(true);
    const getLayout = layoutService.getLayout(tableSlug, menuItem?.id);

    const getFormData = constructorObjectService.getById(tableSlug, id);

    try {
      const [{ data = {} }, layout] = await Promise.all([getFormData, getLayout]);
      setSections(sortSections(sections));
      setSummary(layout?.summary_fields ?? []);

      setLayout(layout);

      const relations =
        layout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable: relation.table_from?.slug === tableSlug ? relation.table_to?.slug : relation.table_from?.slug,
        }))
      );
      if (selectedTab?.type === "section") reset(data?.response ?? {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, appId);

    try {
      const [layout] = await Promise.all([getLayout]);

      setLayout(layout);
      setSections(sortSections(sections));

      const relations =
        layout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable: relation.table_from?.slug === tableSlug ? relation.table_to?.slug : relation.table_from?.slug,
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const update = (data) => {
    delete data.invite;
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, { data })
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries("GET_OBJECTS_LIST_WITH_RELATIONS", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        dispatch(showAlert("Successfully updated", "success"));
        if (modal) {
          handleClose();
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
        }
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };
  const create = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .create(tableSlug, { data })
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries("GET_OBJECTS_LIST_WITH_RELATIONS", tableSlug, {
          table_slug: tableSlug,
        });
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        if (modal) {
          handleClose();
          queryClient.refetchQueries("GET_OBJECTS_LIST_WITH_RELATIONS", tableSlug, {
            table_slug: tableSlug,
          });
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }

        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    if (id) {
      update(data);
    } else {
      create(data);
    }
  };

  useEffect(() => {
    if (!tableInfo) return;
    if (id) getAllData();
    else getFields();
  }, [id, tableInfo, selectedTabIndex, i18n?.language, selectedTab]);

  useEffect(() => {
    getFields();
  }, [id, tableInfo, selectedTabIndex, i18n?.language, selectedTab]);

  return (
    <div className={styles.formPage}>
      <SummarySectionValuesForModal computedSummary={summary} setSummary={setSummary} control={control} editAcces={editAcces} fieldsMap={fieldsMap} layout={layout} />

      <div className={styles.formArea}>
        <RelationSectionForModal
          getAllData={getAllData}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          relations={tableRelations}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          reset={reset}
          setFormValue={setFormValue}
          tableSlug={tableSlugFromProps}
          watch={watch}
          loader={loader}
          setSelectTab={setSelectTab}
          selectedTab={selectedTab}
          errors={errors}
          relatedTable={tableRelations[selectedTabIndex]?.relatedTable}
          id={id}
          fieldsMap={fieldsMap}
          editAcces={editAcces}
          setEditAccess={setEditAccess}
        />
      </div>
      <Footer
        style={{
          bottom: "-10px",
        }}
        extra={
          <>
            <SecondaryButton
              onClick={() => setFullScreen((prev) => !prev)}
              color=""
              style={{
                position: "absolute",
                left: "16px",
                border: "0px solid #2d6ce5",
                padding: "4px",
              }}
            >
              {fullScreen ? (
                <FullscreenExitIcon style={{ color: "#2d6ce5", width: "26px", height: "26px" }} />
              ) : (
                <FullscreenIcon style={{ color: "#2d6ce5", width: "26px", height: "26px" }} />
              )}
            </SecondaryButton>
            <SecondaryButton onClick={() => (modal ? handleClose() : navigate(-1))} color="error">
              Close
            </SecondaryButton>
            <FormCustomActionButton control={control?._formValues} tableSlug={tableSlug} id={id} />
            <PermissionWrapperV2 tableSlug={tableSlug} type={id ? "update" : "write"}>
              <PrimaryButton loader={btnLoader} id="submit" onClick={handleSubmit(onSubmit)}>
                <Save />
                Save
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      />
    </div>
  );
};

export default ObjectsFormPageForModal;
