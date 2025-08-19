import {Add} from "@mui/icons-material";
import { useMemo, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";
import { CTableCell, CTableRow } from "../../../../../components/CTable";
import DataTable from "../../../../../components/DataTable";
import TableCard from "../../../../../components/TableCard";
import constructorRelationService from "../../../../../services/constructorRelationService";
import { generateGUID } from "../../../../../utils/generateID";
import styles from "../Fields/style.module.scss";
import { Box, Drawer } from "@mui/material";
import RelationSettings from "./RelationSettings";
import TableRowButton from "../../../../../components/TableRowButton";
import { RelationPopover } from "./components/RelationPopover";

const Relations = ({mainForm, getRelationFields, tableLan}) => {

  const isNewRouter = localStorage.getItem("new_router") === "true";
  const [drawerState, setDrawerState] = useState(null);
  const [loader, setLoader] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  const { tableSlug } = useParams();
  const { fields: relations } = useFieldArray({
    control: mainForm.control,
    name: "relations",
    keyName: "key",
  });
  const { id } = useParams();

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerState(null);
  };

  const openEditForm = (field, index, e) => {
    setAnchorEl(e.target);
    setDrawerState(field);
  };
  const updateRelations = async () => {
    setLoader(true);

    await getRelationFields();

    setDrawerState(null);
    setLoader(false);
  };
  const deleteField = (field, index) => {
    if (isNewRouter) {
      constructorRelationService
        .delete(field.id, tableSlug)
        .then((res) => updateRelations());
    } else {
      if (!id) updateRelations();
      else {
        constructorRelationService
          .delete(field.id, tableSlug)
          .then((res) => updateRelations());
      }
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

  const createAnchorEl = useRef(null);

  const openAddForm = () => {
    setAnchorEl(createAnchorEl.current);
    setDrawerState("CREATE");
  };

  return (
    <Box ref={createAnchorEl}>
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
          checkPermission={false}
          dataLength={1}
          additionalRow={
            <TableRowButton
              colSpan={columns.length + 2}
              onClick={openAddForm}
            />
          }
        />
        <RelationPopover
          anchorEl={anchorEl}
          onClose={handleClose}
          tableLan={tableLan}
          relation={drawerState}
          closeSettingsBlock={() => handleClose()}
          getRelationFields={getRelationFields}
          formType={drawerState}
          open={Boolean(anchorEl)}
        />

        {/* <Drawer
          open={!!drawerState}
          anchor="right"
          onClose={() => setDrawerState(null)}
          orientation="horizontal"
        >
          <RelationSettings
            tableLan={tableLan}
            relation={drawerState}
            closeSettingsBlock={() => setDrawerState(null)}
            getRelationFields={getRelationFields}
            formType={drawerState}
            height={`calc(100vh - 48px)`}
          />
        </Drawer> */}
      </TableCard>
    </Box>
  );
};

export default Relations;
