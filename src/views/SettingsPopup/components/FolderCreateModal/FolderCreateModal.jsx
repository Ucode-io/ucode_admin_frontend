import {Card, Modal, Typography} from "@mui/material";
import {useQuery, useQueryClient} from "react-query";
import {store} from "../../../../store";
import {useForm} from "react-hook-form";
import {
  useClientTypeCreateMutation,
  useClientTypeUpdateMutation,
} from "../../../../services/clientTypeService";
import {useTablesListQuery} from "../../../../services/tableService";
import clientTypeServiceV2 from "../../../../services/auth/clientTypeServiceV2";
import {useMemo} from "react";
import {Clear} from "@mui/icons-material";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";
import HFAutocomplete from "../../../../components/FormElements/HFAutocomplete";
import HFNumberField from "../../../../components/FormElements/HFNumberField";
import CreateButton from "../../../../components/Buttons/CreateButton";
import SaveButton from "../../../../components/Buttons/SaveButton";
import HFMultipleSelect from "../../../../components/FormElements/HFMultipleSelect";
import {useFieldsListQuery} from "../../../../services/constructorFieldService";

export const FolderCreateModal = ({closeModal, clientType = {}, modalType}) => {
  const company = store.getState().company;
  const queryClient = useQueryClient();
  const createType = modalType === "CREATE";
  const projectId = store.getState().company.projectId;

  const {control, handleSubmit, setValue, watch} = useForm({
    defaultValues: {
      project_id: company.projectId,
      id: clientType.id,
      guid: clientType.guid,
      name: clientType.name ?? "",
      default_page: clientType.default_page ?? "",
      self_recover: clientType.self_recover ?? false,
      self_register: clientType.self_register ?? false,
      table_slug: clientType.table_slug ?? "",
      columns: clientType?.columns ?? [],
    },
  });

  const {mutate: createClientType, isLoading: createLoading} =
    useClientTypeCreateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CLIENT_TYPE_PERMISSION"]);
        closeModal();
      },
    });

  const {mutate: updateClientType, isLoading: updateLoading} =
    useClientTypeUpdateMutation({
      onSuccess: () => {
        queryClient.refetchQueries(["GET_CLIENT_TYPE_PERMISSION"]);
        closeModal();
      },
    });

  const {data: projectTables} = useTablesListQuery({
    params: {
      is_login_table: true,
    },
    queryParams: {
      select: (res) =>
        res.tables?.map((el) => ({
          label: el?.label,
          value: el?.slug,
        })),
    },
  });

  const {isLoading: isLoading2} = useQuery(
    ["GET_CLIENT_TYPE_BY_ID", clientType?.id],
    () => {
      return clientTypeServiceV2.getById(clientType?.id);
    },
    {
      enabled: !!clientType?.id,
      onSuccess: (res) => {
        setValue("session_limit", res?.data?.response?.session_limit);
      },
    }
  );

  const {data: fieldsData} = useFieldsListQuery(
    {
      queryParams: {
        enabled: Boolean(watch("table_slug")),
      },
      params: {
        table_slug: watch("table_slug"),
        "project-id": projectId,
      },
    },
    watch("table_slug")
  );

  const onSubmit = (values) => {
    const data = {
      ...values,
      session_limit: values?.session_limit ? values?.session_limit : 50,

      "project-id": company.projectId,
    };
    const params = {
      "project-id": company.projectId,
    };
    if (clientType.id) updateClientType({data, params});
    else createClientType({params, data});
  };

  const tableOptions = useMemo(() => {
    return projectTables?.map((item) => ({
      value: item.id ?? item?.value,
      label: item.label,
    }));
  }, [projectTables]);

  const computedFieldsListOptions = useMemo(() => {
    return fieldsData?.fields?.map((field) => ({
      label: field?.label || field?.view_fields?.[0]?.label,
      value: field?.id,
    }));
  }, [fieldsData]);

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {createType ? "Create folder" : "Edit folder"}
            </Typography>
            <Clear
              color="primary"
              onClick={closeModal}
              width="46px"
              style={{
                cursor: "pointer",
              }}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <FRow label="Title">
              <HFTextField
                autoFocus
                fullWidth
                label="Title"
                control={control}
                name="name"
                required
              />
            </FRow>
            <FRow label="Default page link">
              <HFTextField
                autoFocus
                fullWidth
                label="Default page link"
                control={control}
                name="default_page"
              />
            </FRow>
            <HFCheckbox
              label="Self recover"
              control={control}
              name="self_recover"
            />
            <HFCheckbox
              label="Self register"
              control={control}
              name="self_register"
            />
            <FRow label="Table">
              <HFAutocomplete
                name="table_slug"
                control={control}
                placeholder="Table"
                fullWidth
                options={tableOptions}
              />
            </FRow>

            <FRow label="Session limit">
              <HFNumberField
                name="session_limit"
                control={control}
                placeholder="session limit"
                fullWidth
                options={tableOptions}
              />
            </FRow>

            {Boolean(clientType?.table_slug) && (
              <FRow label="Fields">
                <HFMultipleSelect
                  name="columns"
                  control={control}
                  options={computedFieldsListOptions}
                  placeholder="Fields List"
                />
              </FRow>
            )}
            <div className="btns-row">
              {createType ? (
                <CreateButton
                  id="createClientType"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              ) : (
                <SaveButton
                  id="saveFolder"
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
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
