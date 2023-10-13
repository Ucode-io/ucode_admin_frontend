import { Save } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../components/Buttons/SecondaryButton";
import FiltersBlock from "../../components/FiltersBlock";
import Footer from "../../components/Footer";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import useTabRouter from "../../hooks/useTabRouter";
import constructorObjectService from "../../services/constructorObjectService";
import layoutService from "../../services/layoutService";
import { store } from "../../store";
import { showAlert } from "../../store/alert/alert.thunk";
import { sortSections } from "../../utils/sectionsOrderNumber";
import NewRelationSection from "./RelationSection/NewRelationSection";
import SummarySectionValue from "./SummarySection/SummarySectionValue";
import FormCustomActionButton from "./components/CustomActionsButton/FormCustomActionButtons";
import FormPageBackButton from "./components/FormPageBackButton";
import styles from "./style.module.scss";
import { useTranslation } from "react-i18next";

const ObjectsFormPage = ({
  tableSlugFromProps,
  handleClose,
  modal = false,
  selectedRow,
  dateInfo,
}) => {
  const { id: idFromParam, tableSlug: tableSlugFromParam } = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

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

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
  } = useForm({
    defaultValues: { ...state, ...dateInfo, invite: isInvite ? invite : false },
  });

  const tableInfo = store.getState().menu.menuItem;

  const getAllData = async () => {
    setLoader(true);
    const getLayout = layoutService.getList({
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    const getFormData = constructorObjectService.getById(tableSlug, id);

    try {
      const [{ data = {} }, { layouts: layout = [] }] = await Promise.all([
        getFormData,
        getLayout,
      ]);
      setSections(sortSections(sections));
      setSummary(
        layout?.find((el) => el.is_default === true)?.summary_fields ?? []
      );

      const defaultLayout = layout?.find((el) => el.is_default === true);

      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );

      if (!selectedTab?.relation_id) reset(data?.response ?? {});
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getList({
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [{ layouts: layout = [] }] = await Promise.all([getLayout]);
      const defaultLayout = layout?.find((el) => el.is_default === true);
      setSections(sortSections(sections));

      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
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
        dispatch(showAlert("Successfully updated", "success"));
        handleClose();
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
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        if (modal) {
          handleClose();
        } else {
          handleClose();
          navigate(-1);
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }

        dispatch(showAlert("Successfully updated!", "success"));

        // if (tableRelations?.length) navigateToForm(tableSlug, "EDIT", res.data?.data);
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => setBtnLoader(false));
  };

  const onSubmit = (data) => {
    if (id) update(data);
    else {
      create(data);
    }
  };

  useEffect(() => {
    if (!tableInfo) return;
    if (id) getAllData();
    else getFields();
  }, [id, tableInfo, selectedTabIndex]);

  useEffect(() => {
    getFields();
  }, [id, tableInfo, selectedTabIndex, i18n?.language]);

  // const getSubtitleValue = useMemo(() => {
  //   return watch(tableInfo?.data?.table?.subtitle_field_slug);
  // }, [tableInfo]);
  return (
    <div className={styles.formPage}>
      <FiltersBlock summary={true} sections={sections} hasBackground={true}>
        <FormPageBackButton />

        <div className={styles.subTitle}>{/* <h3>Test</h3> */}</div>

        <SummarySectionValue
          computedSummary={summary}
          control={control}
          sections={sections}
          setFormValue={setFormValue}
        />
      </FiltersBlock>
      <div className={styles.formArea}>
        <NewRelationSection
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
          relatedTable={tableRelations[selectedTabIndex]?.relatedTable}
          id={id}
        />
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton onClick={() => navigate(-1)} color="error">
              Close
            </SecondaryButton>
            <FormCustomActionButton
              control={control?._formValues}
              tableSlug={tableSlug}
              id={id}
            />
            <PermissionWrapperV2
              tableSlug={tableSlug}
              type={id ? "update" : "write"}
            >
              <PrimaryButton
                loader={btnLoader}
                id="submit"
                onClick={handleSubmit(onSubmit)}
              >
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

export default ObjectsFormPage;
