import {Box, Button, Modal} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import FormCard from "../../components/FormCard";
import FRow from "../../components/FormElements/FRow";
import HFCheckbox from "../../components/FormElements/HFCheckbox";
import HFMultipleSelect from "../../components/FormElements/HFMultipleSelect";
import HFSelect from "../../components/FormElements/HFSelect";
import HFTextField from "../../components/FormElements/HFTextField";
import HFTextFieldWithMultiLanguage from "../../components/FormElements/HFTextFieldWithMultiLanguage";
import {LoginStrategy} from "../../mock/FolderSettings";
import constructorObjectService from "../../services/constructorObjectService";
import constructorTableService from "../../services/constructorTableService";
import constructorViewRelationService from "../../services/constructorViewRelationService";
import {showAlert} from "../../store/alert/alert.thunk";
import {constructorTableActions} from "../../store/constructorTable/constructorTable.slice";
import {createConstructorTableAction} from "../../store/constructorTable/constructorTable.thunk";
import {generateGUID} from "../../utils/generateID";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {getAllFromDB} from "../../utils/languageDB";
import style from "./style.module.scss";
import TextFieldWithMultiLanguage from "../../components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import { CloseButton } from "../../components/CloseButton";
import { CustomCheckbox } from "../../components/CustomCheckbox";

const TableCreateModal = ({
  exist = false,
  closeModal,
  loading,
  modalType,
  appId,
  selectedFolder,
  getMenuList = () => {},
  setSelectedFolder = () => {},
}) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { state = {} } = useLocation();
  const queryClient = useQueryClient();
  const [tableLan, setTableLan] = useState(null);
  const [authInfo, setAuthInfo] = useState(state?.tableInfo);
  const languages = useSelector((state) => state.languages.list);
  const tableSlug = selectedFolder?.data?.table?.slug;

  const { control, reset, getValues, setValue, handleSubmit, watch } = useForm({
    defaultValues: {
      show_in_menu: true,
      fields: [],
      menu_id: appId ?? selectedFolder?.id,
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

  const params = {
    language_setting: i18n?.language,
  };

  const tableName = useWatch({
    control,
    name: "label",
  });

  const { fields } = useFieldArray({
    control,
    name: "fields",
    keyName: "key",
  });

  const { fields: relations } = useFieldArray({
    control: control,
    name: "layoutRelations",
    keyName: "key",
  });

  const loginTable = useWatch({
    control,
    name: "is_login_table",
  });

  const login = useWatch({
    control,
    name: "attributes.auth_info.login",
  });

  const { data: computedTableFields } = useQuery(
    ["GET_OBJECT_LIST", tableSlug, i18n?.language],
    () => {
      if (!tableSlug) return false;
      return constructorObjectService.getList(
        tableSlug,
        {
          data: {},
        },
        params
      );
    },
    {
      enabled: Boolean(tableSlug),
      select: (res) => {
        return res?.data?.fields ?? [];
      },
    }
  );

  const loginRequired = useMemo(() => {
    if (login) {
      return true;
    } else {
      return false;
    }
  }, [login]);

  const computedLoginFields = useMemo(() => {
    return computedTableFields?.map((item) => ({
      label:
        item?.type === "LOOKUP" || item?.type === "LOOKUPS"
          ? item?.attributes?.[`label_${i18n?.language}`] ||
            item?.attributes?.[`label_to_${i18n?.language}`] ||
            item?.label
          : item?.attributes?.[`label_${i18n?.language}`] || item?.label,
      value: item?.slug ?? "",
    }));
  }, [computedTableFields]);

  const createConstructorTable = (data) => {
    // setBtnLoader(true);

    dispatch(
      createConstructorTableAction({
        ...data,
        label: Object.values(data?.attributes).find((item) => item),
      })
    )
      .unwrap()
      .then((res) => {
        if (
          selectedFolder?.parent_id === "c57eedc3-a954-4262-a0af-376c65b5a284"
        ) {
          queryClient.refetchQueries(["MENU_CHILD"]);
          closeModal();
        } else {
          console.log("entered second");
          getMenuList();
          closeModal();
        }
        // setPermission(res?.record_permission, res?.slug);
      })
      .catch(() => {
        // setBtnLoader(false);
      });
  };

  const updateConstructorTable = (data) => {
    // setBtnLoader(true);
    const updateTableData = constructorTableService.update(data, projectId);

    Promise.all([updateTableData])
      .then(() => {
        dispatch(constructorTableActions.setDataById(data));
        // navigate(-1);
      })
      .catch(() => setBtnLoader(false));
  };

  const getKeyCheck = async (id) => {
    const response = await constructorTableService.getListKey(id);

    if (response?.exists) {
      return false;
    } else return true;
  };

  const onSubmit = async (data) => {
    const computedData = {
      ...data,
      id: data?.id,
      show_in_menu: true,
      menu_id: selectedFolder?.id ?? "c57eedc3-a954-4262-a0af-376c65b5a284",
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

  const getData = async () => {
    // setLoader(true);

    try {
      const [tableData] = await Promise.all([
        await constructorViewRelationService.getList({ table_slug: tableSlug }),
      ]);

      const data = {
        ...tableData,
        ...getValues(),
      };

      reset({
        ...data,
        // ...values,
        slug: data?.slug,
        label: data?.label,
      });

      await getRelationFields();
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      // setLoader(false);
    }
  };

  useEffect(() => {
    if (Boolean(tableSlug)) {
      getData();
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setTableLan(formattedData?.find((item) => item?.key === "Table"));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setAuthInfo(state?.tableInfo?.attributes?.auth_info);
    reset(state?.tableInfo);
  }, []);

  return (
    <Modal open className="child-position-center" onClose={closeModal}>
      <div style={{ width: "540px" }}>
        <FormCard
          title={
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <span>
                {generateLangaugeText(tableLan, i18n?.language, "General") ||
                  "General"}
              </span>
              <CloseButton onClick={closeModal} />
            </Box>
          }
        >
          <Box
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <TextFieldWithMultiLanguage
              control={control}
              name="attributes.label"
              placeholder="Name"
              defaultValue={tableName}
              languages={languages}
              id={"create_table_name"}
              style={{ width: "100%", height: "36px" }}
              watch={watch}
            />
            <HFTextField
              control={control}
              name="slug"
              exist={exist}
              fullWidth
              placeholder="Enter key"
              required
              withTrim
              id={"create_table_key"}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "16px 0",
              gap: "20px",
            }}
            className={style.checkbox}
          >
            <CustomCheckbox
              id="login_table_check"
              control={control}
              name="is_login_table"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Login Table") ||
                "Login Table"}
            </CustomCheckbox>
            <CustomCheckbox
              control={control}
              name="is_cached"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Cache") ||
                "Cache"}
            </CustomCheckbox>
            <CustomCheckbox
              control={control}
              name="soft_delete"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Soft delete") ||
                "Soft delete"}
            </CustomCheckbox>
            <CustomCheckbox
              control={control}
              name="order_by"
              required
              size="sm"
            >
              {generateLangaugeText(tableLan, i18n?.language, "Sort") || "Sort"}
            </CustomCheckbox>
          </Box>

          {loginTable && (
            <Box
              display="grid"
              gap="16px"
              gridTemplateColumns="repeat(2, 1fr)"
              marginTop="16px"
            >
              {authInfo?.login_strategy?.length >= 1 && (
                <>
                  <Box>
                    {/* <FRow
                      label={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "User type"
                        ) || "User type"
                      }
                    /> */}
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.client_type_id"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "User type"
                        ) || "User type"
                      }
                      options={computedLoginFields}
                      required
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.role_id"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Roles"
                        ) || "Roles"
                      }
                      options={computedLoginFields}
                      required
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.login"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Login"
                        ) || "Login"
                      }
                      options={computedLoginFields}
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.password"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Password"
                        ) || "Password"
                      }
                      options={computedLoginFields}
                      required={loginRequired}
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.email"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Email"
                        ) || "Email"
                      }
                      options={computedLoginFields}
                    />
                  </Box>
                  <Box>
                    <HFSelect
                      control={control}
                      name="attributes.auth_info.phone"
                      fullWidth
                      placeholder={
                        generateLangaugeText(
                          tableLan,
                          i18n?.language,
                          "Phone"
                        ) || "Phone"
                      }
                      options={computedLoginFields}
                    />
                  </Box>
                </>
              )}

              <Box>
                <Box>
                  <HFMultipleSelect
                    id="login_strategy"
                    control={control}
                    name="attributes.auth_info.login_strategy"
                    fullWidth
                    placeholder={
                      generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Login strategy"
                      ) || "Login strategy"
                    }
                    options={LoginStrategy}
                  />
                </Box>
              </Box>
            </Box>
          )}

          <Box sx={{ width: "100%", textAlign: "end" }}>
            <Button
              onClick={handleSubmit(onSubmit)}
              sx={{
                marginRight: "auto",
                width: "120px",
                fontSize: "14px",
                fontWeight: "400",
              }}
              variant="contained"
            >
              Create
            </Button>
          </Box>
        </FormCard>
      </div>
    </Modal>
  );
};

export default TableCreateModal;
