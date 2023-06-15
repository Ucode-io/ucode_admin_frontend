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
import { useCustomErrorListQuery } from "../../../../../services/customErrorMessage";
import constructorObjectService from "../../../../../services/constructorObjectService";

const CustomErrors = ({ mainForm, getRelationFields }) => {
  const [drawerState, setDrawerState] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [loader, setLoader] = useState(false);
  const { id } = useParams();

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

  const getLanguageOptions = () => {
    constructorObjectService
      .getList("setting.languages", { data: {} })
      .then((res) => {
        console.log("res", res);
        setLanguages(res.data?.response);
      });
  };

  useEffect(() => {
    getLanguageOptions();
  }, []);

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

  const deleteField = (field, index) => {
    if (!id) updateRelations();
    else {
      constructorRelationService
        .delete(field.id)
        .then((res) => updateRelations());
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 1,
        label: "Table from",
        slug: "table_from.label",
      },
      {
        id: 2,
        label: "Table to",
        slug: "table_to.label",
      },
      {
        id: 3,
        label: "Relation type",
        slug: "type",
      },
    ],
    []
  );

  return (
    <TableCard>
      <DataTable
        data={relations}
        removableHeight={false}
        tableSlug={"app"}
        columns={columns}
        disablePagination
        loader={loader}
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
          relation={drawerState}
          closeSettingsBlock={() => setDrawerState(null)}
          getRelationFields={getRelationFields}
          formType={drawerState}
          height={`calc(100vh - 48px)`}
          languages={languages}
        />
      </Drawer>
    </TableCard>
  );
};

export default CustomErrors;
