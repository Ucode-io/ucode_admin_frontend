import { Box, Card, Modal, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { store } from "../../store";
import {
  useConnectionCreateMutation,
  useConnectionGetByIdQuery,
  useConnectionUpdateMutation,
} from "../../services/auth/connectionService";
import { useTablesListQuery } from "../../services/constructorTableService";
import { useFieldsListQuery } from "../../services/constructorFieldService";
import { useRelationsListQuery } from "../../services/constructorRelationService";
import { generateLangaugeText } from "../../utils/generateLanguageText";
import useDebounce from "../../hooks/useDebounce";
import HFTextField from "../../components/FormElements/HFTextField";
import FRow from "../../components/FormElements/FRow";
import HFSelect from "../../components/FormElements/HFSelect";
import SaveButton from "../../components/Buttons/SaveButton";
import CreateButton from "../../components/Buttons/CreateButton";
import { showAlert } from "../../store/alert/alert.thunk";

const MAIN_TABLE_PAGE_LIMIT = 20;

const ConnectionCreateModal = ({
  closeModal,
  modalType,
  connectionId,
  settingLan,
  clientTypeId,
}) => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const envId = store.getState().company.environmentId;
  const projectId = store.getState().company.projectId;
  const [relations, setRelations] = useState([]);

  const { control, handleSubmit, reset, watch, getValues } = useForm({
    defaultValues: {
      name: "",
      table_slug: "",
      view_slug: "",
      client_type_id: clientTypeId,
      "project-id": projectId,
      guid: "",
    },
  });

  const tableSlug = watch("table_slug");
  const mainTableSlug = watch("main_table_slug");

  const { isLoading } = useConnectionGetByIdQuery({
    id: connectionId,
    queryParams: {
      enabled: Boolean(modalType === "UPDATE"),
      onSuccess: (res) => {
        reset(res.data.response);
      },
    },
  });

  const { mutateAsync: createConnection, isLoading: createLoading } =
    useConnectionCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CONNECTION_LIST"]);
        store.dispatch(showAlert("Успешно", "success"));
        closeModal();
      },
    });
  const { mutateAsync: updateConnection, isLoading: updateLoading } =
    useConnectionUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CONNECTION_LIST"]);
        store.dispatch(showAlert("Успешно", "success"));
        closeModal();
      },
    });

  const onSubmit = (data) => {
    const relation = relations?.find((i) => i.slug === getValues().table_slug);
    if (modalType === "NEW") {
      createConnection({ ...data, field_slug: relation?.field_slug });
    } else {
      updateConnection({ ...data, guid: connectionId });
    }
  };

  const [mainTablePage, setMainTablePage] = useState(1);
  const [mainTableSearch, setMainTableSearch] = useState("");
  const [mainTableOptions, setMainTableOptions] = useState([]);

  const { data: mainTablesData, isFetching: isFetchingMainTables } =
    useTablesListQuery({
      params: {
        envId: envId,
        search: mainTableSearch || undefined,
        limit: MAIN_TABLE_PAGE_LIMIT,
        offset: (mainTablePage - 1) * MAIN_TABLE_PAGE_LIMIT,
      },
    });

  useEffect(() => {
    if (!mainTablesData?.tables) return;
    const mapped = mainTablesData.tables.map((item) => ({
      label: item?.label,
      value: item?.slug,
    }));
    setMainTableOptions((prev) =>
      mainTablePage === 1 ? mapped : [...prev, ...mapped],
    );
  }, [mainTablesData, mainTablePage]);

  const mainTableHasMore =
    (mainTablesData?.count ?? 0) > mainTableOptions.length;

  const handleMainTableScrollToBottom = () => {
    if (mainTableHasMore && !isFetchingMainTables) {
      setMainTablePage((prev) => prev + 1);
    }
  };

  const handleMainTableSearch = useDebounce((value) => {
    setMainTablePage(1);
    setMainTableSearch(value);
  }, 300);

  const selectedMainTableOption = useMemo(() => {
    if (!mainTableSlug) return null;
    return (
      mainTableOptions.find((opt) => opt.value === mainTableSlug) ?? {
        label: mainTableSlug,
        value: mainTableSlug,
      }
    );
  }, [mainTableOptions, mainTableSlug]);

  const { data: fieldsData } = useFieldsListQuery(
    {
      queryParams: {
        enabled: Boolean(tableSlug),
      },
      params: {
        table_slug: tableSlug,
        "project-id": projectId,
      },
    },
    tableSlug,
  );

  const { data: relationsData } = useRelationsListQuery({
    queryParams: {
      enabled: Boolean(mainTableSlug),
    },
    params: {
      table_slug: mainTableSlug,
      relation_slug: mainTableSlug,
      "project-id": projectId,
    },
    tableSlug: mainTableSlug,
  });

  const computedFilteredRelations = useMemo(() => {
    if (!relationsData?.relations) return;
    const array = [];
    let from = "";
    relationsData?.relations.forEach((element) => {
      if (element?.table_from?.slug === mainTableSlug) from = "to";
      else if (element?.table_to?.slug === mainTableSlug) from = "from";
      if (element?.[`table_${from}`]) {
        element[`table_${from}`].field_slug = element?.[`field_${from}`];
        element[`table_${from}`].type = element?.type;
        array.push(element[`table_${from}`]);
      }
    });
    setRelations(array ?? []);
    return array ?? [];
  }, [relationsData]);

  const computedViewOptions = useMemo(() => {
    return fieldsData?.fields?.map((item) => ({
      label: item?.label,
      value: item?.slug,
    }));
  }, [fieldsData]);

  const computedTableSlug = useMemo(() => {
    if (!computedFilteredRelations) return [];
    return computedFilteredRelations?.map((item) => ({
      label: item?.label,
      value: item?.slug,
    }));
  }, [computedFilteredRelations]);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4" color="white">
              {modalType === "NEW"
                ? generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Create connection",
                  ) || "Create connection"
                : generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Edit connection",
                  ) || "Edit connection"}
            </Typography>
            <ClearIcon
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>

          <form action="" className="form">
            <FRow
              label={
                generateLangaugeText(
                  settingLan,
                  i18n?.language,
                  "Table slug",
                ) || "Table slug"
              }
            >
              <HFTextField
                fullWidth
                label="Value"
                control={control}
                name="name"
                required
              />
            </FRow>
            <FRow
              label={
                generateLangaugeText(
                  settingLan,
                  i18n?.language,
                  "Main table slug",
                ) || "Main table slug"
              }
            >
              <Controller
                control={control}
                name="main_table_slug"
                rules={{ required: "This is required field" }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <Select
                      value={value ? selectedMainTableOption : null}
                      options={mainTableOptions}
                      isLoading={isFetchingMainTables}
                      isClearable
                      placeholder="Table"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (base) => ({ ...base, minHeight: 40 }),
                      }}
                      onChange={(opt) => onChange(opt ? opt.value : "")}
                      onInputChange={(input, { action }) => {
                        if (action === "input-change") {
                          handleMainTableSearch(input);
                        }
                      }}
                      onMenuScrollToBottom={handleMainTableScrollToBottom}
                      filterOption={null}
                      noOptionsMessage={() =>
                        isFetchingMainTables ? "Loading..." : "No tables"
                      }
                    />
                    {error?.message && (
                      <p
                        style={{
                          color: "#d32f2f",
                          fontSize: 12,
                          margin: "4px 0 0 0",
                        }}
                      >
                        {error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </FRow>
            <FRow
              label={
                generateLangaugeText(
                  settingLan,
                  i18n?.language,
                  "Table slug",
                ) || "Table slug"
              }
            >
              <HFSelect
                fullWidth
                label="Table"
                control={control}
                name="table_slug"
                options={computedTableSlug}
                required
              />
            </FRow>
            <FRow
              label={
                generateLangaugeText(
                  settingLan,
                  i18n?.language,
                  "Field slug",
                ) || "Field slug"
              }
            >
              <HFSelect
                fullWidth
                label="Table"
                control={control}
                name="view_slug"
                options={computedViewOptions}
                required
              />
            </FRow>

            <div className="btns-row">
              {modalType === "NEW" ? (
                <CreateButton
                  title={
                    generateLangaugeText(settingLan, i18n?.language, "Add") ||
                    "Add"
                  }
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              ) : (
                <SaveButton
                  title={
                    generateLangaugeText(settingLan, i18n?.language, "Save") ||
                    "Save"
                  }
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              )}
            </div>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default ConnectionCreateModal;
