import { Box } from "@mui/material";
import React, { useEffect } from "react";
import TableCard from "../../../../../components/TableCard";
import { CTable, CTableBody, CTableCell, CTableHead, CTableRow } from "../../../../../components/CTable";
import PermissionWrapperV2 from "../../../../../components/PermissionWrapper/PermissionWrapperV2";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import DeleteWrapperModal from "../../../../../components/DeleteWrapperModal";
import { Delete } from "@mui/icons-material";
import TableRowButton from "../../../../../components/TableRowButton";
import { useNavigate, useParams } from "react-router-dom";
import layoutService from "../../../../../services/layoutService";

function NewlayoutList(props) {
  const navigate = useNavigate();
  const { id } = useParams()

  useEffect(() => {
    layoutService.getList({id, data: {tableId: id}}).then((res) => {
      console.log('sssssssssss', res)
    });
  }, []);

  const layouts = [
    {
      id: "adsadsdsdads",
      order: 1,
      table_id: "EEEEEEEEEE",
      label: "Painter",
      type: "",
    },
    {
      id: "adsadsdsdads",
      order: 2,
      table_id: "EEEEEEEEEE",
      label: "Payments",
      type: "",
    },
    {
      id: "adsadsdsdads",
      order: 3,
      table_id: "EEEEEEEEEE",
      label: "Orders",
      type: "",
    },
    {
      id: "adsadsdsdads",
      order: 4,
      table_id: "EEEEEEEEEE",
      label: "Products",
      type: "",
    },
  ];

  const navigateToEditForm = (id) => {
    // // Construct the URL for the "NewLayoutSettings" page with the specified id
    // const url = `/settings/newlayoutsettings/${id}`;
    // tabRouter.navigateTab(url);
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", background: "#fff" }}>
      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Layouts</CTableCell>
            {/* <CTableCell width={60}></CTableCell> */}
            <PermissionWrapperV2 tabelSlug="app" type="delete">
              <CTableCell width={60} />
            </PermissionWrapperV2>
          </CTableHead>

          {/* <CTableBody  columnsCount={4} > */}
          {layouts?.map((element) => (
            <CTableRow key={element.id} onClick={() => navigateToEditForm(element.id)}>
              <CTableCell>{element?.order}</CTableCell>
              <CTableCell>{element?.label}</CTableCell>
              <PermissionWrapperV2 tabelSlug="app" type="delete">
                <CTableCell>
                  <DeleteWrapperModal>
                    <RectangleIconButton color="error">
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal>
                </CTableCell>
              </PermissionWrapperV2>
            </CTableRow>
          ))}
          <PermissionWrapperV2 tabelSlug="app" type="write">
            <TableRowButton colSpan={4} />
            {/* onClick={navigateToCreateForm}  */}
          </PermissionWrapperV2>
          {/* </CTableBody> */}
        </CTable>
      </TableCard>
    </Box>
  );
}

export default NewlayoutList;
