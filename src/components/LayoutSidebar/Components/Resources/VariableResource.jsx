import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SearchInput from "../../../SearchInput";
import TableCard from "../../../TableCard";
import { CTable, CTableBody, CTableCell, CTableHead, CTableRow } from "../../../CTable";
import RectangleIconButton from "../../../Buttons/RectangleIconButton";
import PermissionWrapperV2 from "../../../PermissionWrapper/PermissionWrapperV2";
import useDownloader from "../../../../hooks/useDownloader";
import apiKeyService from "../../../../services/apiKey.service";
import exportToJsonService from "../../../../services/exportToJson";
import TableRowButton from "../../../TableRowButton";
import { useVariableResourceListQuery } from "../../../../services/resourceService";
import { Box } from "@mui/material";
import FiltersBlock from "../../../FiltersBlock";


const VariableResources = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: { variables } = {} } = useVariableResourceListQuery({
    params: {},
  });


  return (
    <Box>

    <FiltersBlock>
        <div
          className="p-1"
          style={{
            display: "flex",
            columnGap: "16px",
            alignItems: "center",
          }}
        >
          <h2>Variable Resources</h2>
          {/* <SearchInput /> */}
        </div>
      </FiltersBlock>

      <TableCard >
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Key</CTableCell>
            <CTableCell>Value</CTableCell>
          </CTableHead>

          <CTableBody loader={''} columnsCount={4} dataLength={2}>
              {variables?.map((element, index) => (
                <CTableRow 
                key={element.id}
                // onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.key}</CTableCell>
                <CTableCell>{element?.value}</CTableCell>
              </CTableRow>
              ))}
          </CTableBody>
        </CTable>
      </TableCard>
    </Box>
  );
};

export default VariableResources;
