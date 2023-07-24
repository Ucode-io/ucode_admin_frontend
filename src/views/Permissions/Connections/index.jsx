import { useParams } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../../components/TableCard";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import { store } from "../../../store";
import { useQuery, useQueryClient } from "react-query";
import { showAlert } from "../../../store/alert/alert.thunk";
import TableRowButton from "../../../components/TableRowButton";
import { useState } from "react";
import ConnectionCreateModal from "./ConnectionFormPage";
import connectionServiceV2, {
  useConnectionDeleteMutation,
} from "../../../services/auth/connectionService";

const ConnectionPage = () => {
  const { clientId } = useParams();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState();
  const [connectionId, setConnectionId] = useState();

  const { data: connections, isLoading } = useQuery(
    ["GET_CONNECTION_LIST"],
    () => {
      return connectionServiceV2.getList({ "client-type-id": clientId });
    }
  );

  const { mutateAsync: deleteRole, isLoading: createLoading } =
    useConnectionDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["GET_CONNECTION_LIST"]);
      },
    });

  const deleteRoleElement = (id) => {
    deleteRole(id);
  };
  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div>
      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Название</CTableCell>
            <CTableCell>Table slug</CTableCell>
            <CTableCell>View slug</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={5}
            dataLength={connections?.data?.response?.length}
          >
            {connections?.data?.response?.map((element, index) => (
              <CTableRow
                key={element.guid}
                onClick={() => {
                  setModalType("UPDATE");
                  setConnectionId(element.guid);
                }}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>{element?.table_slug}</CTableCell>
                <CTableCell>{element?.view_slug}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteRoleElement(element.guid);
                    }}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton colSpan={5} onClick={() => setModalType("NEW")} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>

      {modalType && (
        <ConnectionCreateModal
          closeModal={closeModal}
          modalType={modalType}
          connectionId={connectionId}
        />
      )}
    </div>
  );
};

export default ConnectionPage;
