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
import resourceVariableService from "../../../../services/resourceVariableService";
import queryClient from "../../../../queries";
import { useQuery, useQueryClient } from "react-query";


const VariableResources = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appId, apiKeyId } = useParams();
  const queryClient = useQueryClient();


  const { data: { variables } = {} } = useVariableResourceListQuery({
    id: appId,
    params: {},
  });


  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const getById = () => {
    apiKeyService
      .getById(authStore.projectId, apiKeyId)
      .then((res) => {
        mainForm.reset(res);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  const getList = () => {
    resourceVariableService
      .getList()
      .then((res) => {
        setApiKeys(res.data);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  const deleteTable = (id) => {
    resourceVariableService.delete(id).then(() => {
      queryClient.refetchQueries('RESOURCES_VARIABLE')
    });
  };

  useEffect(() => {
    if (apiKeyId) {
      getById();
    }
  }, [apiKeyId]);


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
            <CTableCell width={60}></CTableCell>
          </CTableHead>

          <CTableBody loader={''} columnsCount={4} dataLength={2}>
              {variables?.map((element, index) => (
                <CTableRow 
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.key}</CTableCell>
                <CTableCell>{element?.value}</CTableCell>
                <CTableCell>
                  <RectangleIconButton color="error" onClick={() => deleteTable(element?.id)}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
              ))}
              <PermissionWrapperV2 tableSlug="app" type="write">
              <TableRowButton colSpan={4} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </Box>
  );
};

export default VariableResources;
