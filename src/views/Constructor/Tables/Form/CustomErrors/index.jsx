import { Add } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import constructorRelationService from "../../../../../services/constructorRelationService";
import { Drawer } from "@mui/material";
import TableRowButton from "../../../../../components/TableRowButton";
import CustomErrorsSettings from "./CustomErrorsSettings";
import {
  useCustomErrorDeleteMutation,
  useCustomErrorListQuery,
} from "../../../../../services/customErrorMessageService";
import constructorObjectService from "../../../../../services/constructorObjectService";
import { store } from "../../../../../store";
import { useQueryClient } from "react-query";

const CustomErrors = ({ mainForm, getRelationFields }) => {
  const [drawerState, setDrawerState] = useState(null);
  const [loader, setLoader] = useState(false);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const authStore = store.getState().auth;

  console.log("tableSlug", id);

  const { fields: relations } = useFieldArray({
    control: mainForm.control,
    name: "relations",
    keyName: "key",
  });

  const { data: customErrors } = useCustomErrorListQuery({
    params: {
      table_id: id,
    },
  });

  console.log("customErrors", customErrors);

  const openEditForm = (field, index) => {
    setDrawerState(field);
  };

  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    setDrawerState(null);
    setLoader(false);
  };

  const { mutate: deleteCustomError, isLoading: deleteLoading } =
    useCustomErrorDeleteMutation({
      projectId: authStore.projectId,
      onSuccess: () => {
        queryClient.refetchQueries(["CUSTOM_ERROR_MESSAGE"]);
      },
    });

  const deleteField = (field, index) => {
    if (!id) updateRelations();
    else {
      deleteCustomError(field.id);
      // constructorRelationService
      //   .delete(field.id)
      //   .then((res) => updateRelations());
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Code",
        slug: "code",
      },
      {
        id: 2,
        label: "Action type",
        slug: "action_type",
      },
      {
        id: 3,
        label: "Message",
        slug: "message",
      },
    ],
    []
  );

  return (
    <TableCard>
      <DataTable
        data={customErrors?.custom_error_messages}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={loader || deleteLoading}
        onDeleteClick={deleteField}
        onEditClick={openEditForm}
        dataLength={1}
        additionalRow={
          <TableRowButton
            colSpan={columns.length + 2}
            onClick={() => setDrawerState("CREATE")}
          />
        }
      />

      <Drawer
        open={!!drawerState}
        anchor="right"
        onClose={() => setDrawerState(null)}
        orientation="horizontal"
      >
        <CustomErrorsSettings
          customError={drawerState}
          closeSettingsBlock={() => setDrawerState(null)}
          getRelationFields={getRelationFields}
          formType={drawerState}
          height={`calc(100vh - 48px)`}
          mainForm={mainForm}
        />
      </Drawer>
    </TableCard>
  );
};

export default CustomErrors;
