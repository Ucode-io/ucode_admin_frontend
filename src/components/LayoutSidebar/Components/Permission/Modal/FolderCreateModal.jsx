import { Card, Modal, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import { store } from "../../../../../store";
import CreateButton from "../../../../Buttons/CreateButton";
import SaveButton from "../../../../Buttons/SaveButton";
import HFTextField from "../../../../FormElements/HFTextField";
import {
  useClientTypeCreateMutation,
  useClientTypeUpdateMutation,
} from "../../../../../services/clientTypeService";
import { useTablesListQuery } from "../../../../../services/tableService";
import FRow from "../../../../FormElements/FRow";
import HFCheckbox from "../../../../FormElements/HFCheckbox";
import HFSelect from "../../../../FormElements/HFSelect";

const FolderCreateModal = ({
  closeModal,
  clientType = {},
  modalType,
  refetch,
}) => {
  const company = store.getState().company;
  const createType = modalType === "CREATE";

  const { control, handleSubmit } = useForm({
    defaultValues: {
      project_id: company.projectId,
      id: clientType.guid,
      guid: clientType.guid,
      name: clientType.name ?? "",
      self_recover: clientType.self_recover ?? false,
      self_register: clientType.self_register ?? false,
      table_slug: clientType.table_slug ?? "",
    },
  });

  const { mutate: createClientType, isLoading: createLoading } =
    useClientTypeCreateMutation({
      onSuccess: () => {
        refetch();
        closeModal();
      },
    });

  const { mutate: updateClientType, isLoading: updateLoading } =
    useClientTypeUpdateMutation({
      onSuccess: () => {
        refetch();
        closeModal();
      },
    });

  const { data: projectTables } = useTablesListQuery({
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

  const onSubmit = (values) => {
    const data = {
      ...values,
      "project-id": company.projectId,
    };
    const params = {
      "project-id": company.projectId,
    };
    if (clientType.guid) updateClientType({ data, params });
    else createClientType({ params, data });
  };

  return (
    <div>
      <Modal open className="child-position-center" onClose={closeModal}>
        <Card className="PlatformModal">
          <div className="modal-header silver-bottom-border">
            <Typography variant="h4">
              {createType ? "Create folder" : "Edit folder"}
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

          <form className="form">
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
            <FRow label="Table" required>
              <HFSelect
                control={control}
                name="table_slug"
                placeholder="Table"
                fullWidth
                options={projectTables}
              />
            </FRow>
            <div className="btns-row">
              {createType ? (
                <CreateButton
                  onClick={handleSubmit(onSubmit)}
                  loading={createLoading || updateLoading}
                />
              ) : (
                <SaveButton
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

export default FolderCreateModal;
