import {Delete} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CancelButton from "@/components/Buttons/CancelButton";
import HFTextField from "@/components/FormElements/HFTextField";
import constructorViewService from "@/services/constructorViewService";
import { quickFiltersActions } from "@/store/filter/quick_filter";
import cls from "./styles.module.scss";
import TextFieldWithMultiLanguage from "@/components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import { NavigateSettings } from "../NavigateSettings";
import { useViewContext } from "@/providers/ViewProvider";

export const ViewForm = ({
  initialValues,
  typeNewView,
  closeForm,
  defaultViewTab,
  refetchViews,
  setIsChanged,
  viewData,
}) => {
  // const { tableSlug, appId } = useParams();
  const { tableSlug, view } = useViewContext();

  const [btnLoader, setBtnLoader] = useState(false);
  const [isBalanceExist, setIsBalanceExist] = useState(false);
  const [deleteBtnLoader, setDeleteBtnLoader] = useState(false);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const nameMulti = initialValues?.attributes?.[`name_${i18n?.language}`];

  const attributes = initialValues?.attributes;

  const languages = useSelector((state) => state.languages.list);

  const storageItem = localStorage.getItem("newUi");
  const newUi = JSON.parse(
    !storageItem || storageItem === "undefined" || storageItem === "false"
      ? "false"
      : "true",
  );

  const form = useForm();
  const type = form.watch("type");
  const relationObjInput = form.watch("relation_obj");
  const numberFieldInput = form.watch("number_field");

  useEffect(() => {
    if (relationObjInput && numberFieldInput) {
      setIsBalanceExist(true);
    }
  }, [relationObjInput, numberFieldInput]);

  const computeFinancialAcc = (values, groupByField, data) => {
    if (values === undefined) return { chart_of_accounts: [] };

    const computedFormat = values.map((row) => {
      return {
        group_by: row.group_by,
        field_slug: groupByField,
        chart_of_account: Object.entries(row)
          .filter(([key]) => key !== "group_by")
          .map(([key, value]) => {
            return {
              object_id: key,
              options: value
                .filter((option) => !!option)
                ?.map((option) => ({
                  ...option,
                  filters: option.filterFields?.map((filterField) => ({
                    field_id: filterField.field_id,
                    value: option.filters?.[filterField.field_id],
                  })),
                })),
            };
          }),
      };
    });
    return {
      chart_of_accounts: computedFormat,
      percent: {
        type: data.typee,
        field_id: data.typee === "field" ? data.filed_idss : null,
      },
      // send balance field if relation_obj is selected
      ...(isBalanceExist && {
        balance: {
          table_slug:
            data?.relation_obj?.split("#")?.[0] !== "undefined"
              ? data?.relation_obj?.split("#")?.[0]
              : undefined,
          table_id:
            data?.relation_obj?.split("#")?.[1] !== "undefined"
              ? data?.relation_obj?.split("#")?.[1]
              : undefined,
          field_id:
            data?.number_field?.split("#")?.[1] !== "undefined"
              ? data?.number_field?.split("#")?.[1]
              : undefined,
          field_slug:
            data?.number_field?.split("#")?.[0] !== "undefined"
              ? data?.number_field?.split("#")?.[0]
              : undefined,
        },
      }),
    };
  };

  useEffect(() => {
    form.reset({
      ...view,
      filters: [],
    });
  }, [initialValues, tableSlug, form, typeNewView]);

  useEffect(() => {
    form.reset({ ...form.getValues(), number_field: "" });
  }, [relationObjInput, attributes]);

  const onSubmit = (values) => {
    setBtnLoader(true);
    const computedValues = {
      ...view,
      columns: view.columns,
      attributes: {
        ...view.attributes,
        ...computeFinancialAcc(
          values.chartOfAccounts,
          values?.group_by_field_selected?.slug,
          values,
        ),

        ...values?.attributes,
        group_by_columns:
          values.attributes.group_by_columns
            ?.filter((el) => el.is_checked)
            .map((el) => el.id) ?? [],
      },
      name:
        values?.attributes?.[`name_${i18n.language}`] ??
        Object.values(values?.attributes).find(
          (item) => typeof item === "string",
        ),
    };

    if (initialValues === "NEW") {
      constructorViewService
        .create(tableSlug, computedValues)
        .then(() => {
          closeForm();
          refetchViews();
          setIsChanged(true);
        })
        .finally(() => {
          setBtnLoader(false);
        });
    } else {
      constructorViewService
        .update(tableSlug, computedValues)
        .then(() => {
          closeForm();
          refetchViews();
          setIsChanged(true);
        })
        .finally(() => {
          setBtnLoader(false);
          dispatch(
            quickFiltersActions.setQuickFiltersCount(
              values?.attributes?.quick_filters?.filter(
                (item) => item?.is_checked,
              )?.length,
            ),
          );
        });
    }
    closeForm();
  };

  const deleteView = () => {
    setDeleteBtnLoader(true);
    constructorViewService
      .delete(initialValues.id, tableSlug)
      .then(() => {
        closeForm();
        refetchViews();
        setIsChanged(true);
      })
      .catch(() => setDeleteBtnLoader(false));
  };

  useEffect(() => {
    if (nameMulti) {
      form.setValue(`attributes.name_${i18n?.language}`, nameMulti);
    }
  }, [nameMulti]);

  return (
    <div className={cls.formSection}>
      <div className={cls.viewForm}>
        <Tabs defaultIndex={defaultViewTab}>
          <div className={cls.section}>
            <TabList className={cls.tabs}>
              <Tab className={cls.tab} selectedClassName={cls.active}>
                Information
              </Tab>

              <Tab className={cls.tab} selectedClassName={cls.active}>
                Navigation
              </Tab>
              {type === "FINANCE CALENDAR" && <Tab>Chart of accounts</Tab>}
            </TabList>
            <TabPanel>
              <div className={cls.section}>
                <div className={cls.sectionBody}>
                  {viewData?.type === "WEBSITE" && (
                    <div className={cls.formRow}>
                      <Box style={{ display: "flex", gap: "6px" }}>
                        <HFTextField
                          control={form.control}
                          name={`attributes.web_link`}
                          placeholder={`Website link`}
                          fullWidth
                        />
                      </Box>
                    </div>
                  )}
                  <div className={cls.formRow}>
                    <TextFieldWithMultiLanguage
                      control={form.control}
                      name={`attributes.name`}
                      placeholder="Name"
                      // defaultValue={tableName}
                      languages={languages}
                      style={{ width: "100%", height: "36px" }}
                      watch={form?.watch}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <NavigateSettings form={form} />
            </TabPanel>
          </div>
        </Tabs>
      </div>

      <div className={cls.formFooter}>
        {initialValues !== "NEW" &&
          initialValues?.attributes?.view_permission?.delete &&
          !newUi && (
            <CancelButton
              loading={deleteBtnLoader}
              onClick={deleteView}
              title={"Delete"}
              icon={<Delete />}
            />
          )}
        <Button
          variant="contained"
          onClick={form.handleSubmit(onSubmit)}
          loading={btnLoader}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
