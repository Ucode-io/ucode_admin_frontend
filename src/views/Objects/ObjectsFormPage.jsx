import { Save } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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

const ObjectsFormPage = ({
  tableSlugFromProps,
  handleClose,
  modal = false,
  selectedRow,
  dateInfo,
}) => {
  const {id: idFromParam, tableSlug: tableSlugFromParam, appId} = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const {state = {}} = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {navigateToForm} = useTabRouter();
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
  const {i18n} = useTranslation();

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
    getValues,
    formState: {errors},
  } = useForm({
    defaultValues: {...state, ...dateInfo, invite: isInvite ? invite : false},
  });
  const tableInfo = store.getState().menu.menuItem;

  const getAllData = async () => {
    setLoader(true);
    const getLayoutData = layoutService.getLayout(tableSlug, appId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    const getFormData = id && constructorObjectService.getById(tableSlug, id);

    try {
      const [{data = {}}, layoutData] = await Promise.all([
        getFormData,
        getLayoutData,
      ]);

      // Access dynamic keys of layoutData
      const layoutKeys = Object.keys(layoutData);

      setSections(sortSections(sections));
      setSummary(layoutData.summary_fields ?? []);

      const defaultLayout = layoutData;

      const relations =
        defaultLayout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) || [];

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
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, appId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [layoutData] = await Promise.all([getLayout]);
      const defaultLayout = layoutData;

      setSections(sortSections(sections));
      console.log("layoutData", layoutData);
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
      .update(tableSlug, {data})
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
            user_id: isUserId,
          }
        );
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
      .create(tableSlug, {data})
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          }
        );
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        dispatch(showAlert("Successfully created", "success"));
        if (modal) {
          handleClose();
          queryClient.refetchQueries(
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            tableSlug,
            {
              table_slug: tableSlug,
            }
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }

        dispatch(showAlert("Successfully updated!", "success"));
        // if (tableRelations?.length) navigateToForm(tableSlug, "EDIT", res.data?.data);
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
  }, [id, tableInfo, selectedTabIndex]);

  // useEffect(() => {
  //   getFields();
  // }, [id, tableInfo, selectedTabIndex, i18n?.language]);

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
          getAllData={getAllData}
          selectedTabIndex={selectedTabIndex}
          setSelectedTabIndex={setSelectedTabIndex}
          relations={tableRelations ?? []}
          control={control}
          getValues={getValues}
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
        />
      </div>
      <Footer
        extra={
          <>
            <SecondaryButton
              onClick={() => (modal ? handleClose() : navigate(-1))}
              color="error"
            >
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
