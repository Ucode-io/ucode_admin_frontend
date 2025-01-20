import Fields from "./Fields";
import Layout from "./Layout";
import Actions from "./Actions";
import MainInfo from "./MainInfo";
import Relations from "./Relations";
import {Save} from "@mui/icons-material";
import {useEffect, useState} from "react";
import CustomErrors from "./CustomErrors";
import {useQueryClient} from "react-query";
import {useTranslation} from "react-i18next";
import {useForm, useWatch} from "react-hook-form";
import Footer from "../../../../components/Footer";
import {useDispatch, useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {listToMap} from "../../../../utils/listToMap";
import {generateGUID} from "../../../../utils/generateID";
import menuService from "../../../../services/menuService";
import {showAlert} from "../../../../store/alert/alert.thunk";
import PageFallback from "../../../../components/PageFallback";
import layoutService from "../../../../services/layoutService";
import HeaderSettings from "../../../../components/HeaderSettings";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import menuSettingsService from "../../../../services/menuSettingsService";
import SecondaryButton from "../../../../components/Buttons/SecondaryButton";
import constructorFieldService from "../../../../services/constructorFieldService";
import {permissionsActions} from "../../../../store/permissions/permissions.slice";
import constructorRelationService from "../../../../services/constructorRelationService";
import constructorCustomEventService from "../../../../services/constructorCustomEventService";
import constructorViewRelationService from "../../../../services/constructorViewRelationService";
import {constructorTableActions} from "../../../../store/constructorTable/constructorTable.slice";
import {createConstructorTableAction} from "../../../../store/constructorTable/constructorTable.thunk";
import constructorTableService, {
  useTableByIdQuery,
} from "../../../../services/constructorTableService";

const ConstructorTablesFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id, tableSlug, appId} = useParams();
  const queryClient = useQueryClient();
  const projectId = useSelector((state) => state.auth.projectId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const {i18n} = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [exist, setExist] = useState(false);
  const [authInfo, setAuthInfo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuItem, setMenuItem] = useState(null);
  const permissions = useSelector((state) =>
    Object.entries(state.permissions?.permissions).map(([key, value]) => ({
      table_slug: key,
      ...value,
    }))
  );

  const mainForm = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      app_id: appId,
      summary_section: {
        id: generateGUID(),
        label: "Summary",
        fields: [],
        icon: "",
        order: 1,
        column: "SINGLE",
        is_summary_section: true,
      },
      label: "",
      description: "",
      slug: "",
      icon: "",
    },
    mode: "all",
  });
  const values = useWatch({
    control: mainForm?.control,
  });

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

  const {isLoading} = useTableByIdQuery({
    id: id,
    queryParams: {
      enabled: !!id,
      onSuccess: (res) => {
        setAuthInfo(res?.attributes?.auth_info);
        mainForm.reset(res);
        setLoader(false);
      },
    },
  });

  const getData = async () => {
    setLoader(true);

    try {
      const [tableData, {custom_events: actions = []}] = await Promise.all([
        await constructorViewRelationService.getList({table_slug: tableSlug}),
        await constructorCustomEventService.getList(
          {table_slug: tableSlug},
          tableSlug
        ),
        await layoutService
          .getList(
            {"table-slug": tableSlug, language_setting: i18n?.language},
            tableSlug
          )
          .then((res) => {
            mainForm.setValue("layouts", res?.layouts ?? []);
          }),
      ]);

      const data = {
        ...tableData,
        ...mainForm.getValues(),
        fields: [],
        actions,
      };

      mainForm.reset({
        ...data,
        ...values,
        slug: data?.slug || values?.slug,
        label: data?.label || values?.label,
      });

      await getRelationFields();
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoader(false);
    }
  };

  const getRelationFields = async () => {
    return new Promise(async (resolve) => {
      const getFieldsData = constructorFieldService.getList(
        {
          table_id: id,
        },
        tableSlug
      );

      const getRelations = constructorRelationService.getList(
        {
          table_slug: tableSlug,
          relation_table_slug: tableSlug,
        },
        tableSlug
      );
      const [{relations = []}, {fields = []}] = await Promise.all([
        getRelations,
        getFieldsData,
      ]);
      mainForm.setValue("fields", fields);
      const relationsWithRelatedTableSlug = relations?.map((relation) => ({
        ...relation,
        relatedTableSlug:
          relation.table_to?.slug === tableSlug ? "table_from" : "table_to",
      }));

      const layoutRelations = [];
      const tableRelations = [];

      relationsWithRelatedTableSlug?.forEach((relation) => {
        if (
          (relation.type === "Many2One" &&
            relation.table_from?.slug === tableSlug) ||
          (relation.type === "One2Many" &&
            relation.table_to?.slug === tableSlug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === tableSlug)
        ) {
          layoutRelations.push(relation);
        } else {
          tableRelations.push(relation);
        }
      });

      const layoutRelationsFields = layoutRelations.map((relation) => ({
        ...relation,
        id: `${relation[relation.relatedTableSlug]?.slug}#${relation.id}`,
        attributes: {
          fields: relation.view_fields ?? [],
        },
        label:
          (relation?.label ?? relation[relation.relatedTableSlug]?.label)
            ? relation[relation.relatedTableSlug]?.label
            : relation?.title,
      }));

      mainForm.setValue("relations", relations);
      mainForm.setValue("relationsMap", listToMap(relations));
      mainForm.setValue("layoutRelations", layoutRelationsFields);
      mainForm.setValue("tableRelations", tableRelations);
      resolve();
    });
  };

  const createType = async (data) => {
    await menuSettingsService
      .create({
        parent_id:
          menuItem?.id || appId || "c57eedc3-a954-4262-a0af-376c65b5a284",
        type: "TABLE",
        table_id: data?.id,
        label: data?.label,
        attributes: data?.attributes,
        icon: data?.icon,
      })
      .then(() => {
        queryClient.refetchQueries(["MENU"], menuItem?.id);
        navigate(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createConstructorTable = (data) => {
    setBtnLoader(true);

    dispatch(
      createConstructorTableAction({
        ...data,
        label: Object.values(data?.attributes).find((item) => item),
      })
    )
      .unwrap()
      .then((res) => {
        createType(res);
        setPermission(res?.record_permission, res?.slug);
        navigate("main/c57eedc3-a954-4262-a0af-376c65b5a28");
      })
      .catch(() => setBtnLoader(false));
  };

  const updateConstructorTable = (data) => {
    setBtnLoader(true);
    const updateTableData = constructorTableService.update(data, projectId);

    Promise.all([updateTableData])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data));
        navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const getKeyCheck = async (id) => {
    const response = await constructorTableService.getListKey(id);

    if (response?.exists) {
      setExist(true);
      return false;
    } else return true;
  };

  const onSubmit = async (data) => {
    const computedData = {
      ...data,
      id: data?.id,
      show_in_menu: true,
    };

    if (data?.id) {
      updateConstructorTable(computedData);
    } else {
      const keyExists = await getKeyCheck(data?.slug);
      if (keyExists) {
        createConstructorTable(computedData);
      } else {
        dispatch(showAlert(`Table with key ${data?.slug} already exist`));
      }
    }
  };

  const setPermission = (permission, table_slug) => {
    const newPermission = {table_slug, ...permission};
    const res = [...permissions, newPermission];

    dispatch(permissionsActions.setPermissions(res));
  };

  useEffect(() => {
    if (!id) setLoader(false);
    else getData();
  }, [id]);

  if (loader) return <PageFallback />;

  return (
    <>
      <div className="pageWithStickyFooter">
        {id ? (
          <>
            <Tabs selectedIndex={selectedTab} direction={"ltr"}>
              <HeaderSettings
                title="Objects"
                subtitle={id ? mainForm.getValues("label") : "Add"}
                icon={mainForm.getValues("icon")}
                backButtonLink={-1}
                sticky>
                <TabList>
                  <Tab onClick={() => setSelectedTab(0)}>Details</Tab>
                  <Tab onClick={() => setSelectedTab(1)}>Layouts</Tab>
                  <Tab onClick={() => setSelectedTab(2)}>Fields</Tab>
                  {id && <Tab onClick={() => setSelectedTab(3)}>Relations</Tab>}
                  {id && <Tab onClick={() => setSelectedTab(4)}>Actions</Tab>}
                  {id && (
                    <Tab onClick={() => setSelectedTab(5)}>Custom errors</Tab>
                  )}
                </TabList>
              </HeaderSettings>

              <TabPanel>
                <MainInfo
                  authData={authInfo}
                  control={mainForm.control}
                  watch={mainForm.watch}
                />
              </TabPanel>

              <TabPanel>
                <Layout
                  mainForm={mainForm}
                  getRelationFields={getRelationFields}
                  getData={getData}
                  setSelectedTabLayout={setSelectedTab}
                />
              </TabPanel>

              <TabPanel>
                <Fields
                  getRelationFields={getRelationFields}
                  mainForm={mainForm}
                  slug={tableSlug}
                />
              </TabPanel>

              {id && (
                <TabPanel>
                  <Relations
                    mainForm={mainForm}
                    getRelationFields={getRelationFields}
                  />
                </TabPanel>
              )}
              {id && (
                <TabPanel>
                  <Actions mainForm={mainForm} />
                </TabPanel>
              )}
              {id && (
                <TabPanel>
                  <CustomErrors mainForm={mainForm} />
                </TabPanel>
              )}
              {/* <Actions eventLabel={mainForm.getValues("label")} /> */}
            </Tabs>
          </>
        ) : (
          <>
            <HeaderSettings
              title={id ? mainForm.getValues("label") : "Create table"}
              icon={mainForm.getValues("icon")}
              backButtonLink={-1}
              sticky></HeaderSettings>

            <MainInfo
              control={mainForm.control}
              watch={mainForm.watch}
              exist={exist}
              setExist={setExist}
              getData={getData}
            />
          </>
        )}
      </div>

      {selectedTab === 1 ? (
        ""
      ) : (
        <Footer
          extra={
            <>
              <SecondaryButton onClick={() => navigate(-1)} color="error">
                Close
              </SecondaryButton>
              <PrimaryButton
                loader={btnLoader}
                onClick={mainForm.handleSubmit(onSubmit)}
                loading={btnLoader}>
                <Save /> Save
              </PrimaryButton>
            </>
          }
        />
      )}
    </>
  );
};

export default ConstructorTablesFormPage;
