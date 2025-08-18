import {useParams} from "react-router-dom";
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
import {Delete} from "@mui/icons-material";
import {store} from "../../../store";
import {useQuery, useQueryClient} from "react-query";
import {showAlert} from "../../../store/alert/alert.thunk";
import TableRowButton from "../../../components/TableRowButton";
import {useState} from "react";
import ConnectionCreateModal from "./ConnectionFormPage";
import connectionServiceV2, {
  useConnectionDeleteMutation,
} from "../../../services/auth/connectionService";
import {useTranslation} from "react-i18next";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {useSelector} from "react-redux";

const ConnectionPage = ({settingLan}) => {
  const {clientId} = useParams();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState();
  const [connectionId, setConnectionId] = useState();
  const {i18n} = useTranslation();
  const auth = useSelector((state) => state.auth);

  const {data: connections, isLoading} = useQuery(
    ["GET_CONNECTION_LIST", clientId],
    () => {
      return connectionServiceV2.getList(
        {client_type_id: clientId},
        {"Environment-id": auth.environmentId}
      );
    },
    {
      cacheTime: 10,
      enabled: !!clientId,
    }
  );

  const {mutateAsync: deleteRole, isLoading: createLoading} =
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
    <div style={{height: "calc(100vh - 100px)"}}>
      <TableCard cardStyles={{height: "calc(100vh - 200px)"}}>
        <h2
          style={{
            marginBottom: "15px",
          }}>
          {generateLangaugeText(settingLan, i18n?.language, "Connection") ||
            "Connection"}
        </h2>
        <CTable disablePagination removableHeight={false}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>
              {generateLangaugeText(settingLan, i18n?.language, "Name") ||
                "Name"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(settingLan, i18n?.language, "Table slug") ||
                "Table slug"}
            </CTableCell>
            <CTableCell>
              {generateLangaugeText(settingLan, i18n?.language, "View slug") ||
                "View slug"}
            </CTableCell>
            {connections?.data?.response.length ? (
              <CTableCell width={60}></CTableCell>
            ) : null}
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={5}
            dataLength={connections?.data?.response?.length}>
            {connections?.data?.response?.map((element, index) => (
              <CTableRow
                key={element.guid}
                onClick={() => {
                  setModalType("UPDATE");
                  setConnectionId(element.guid);
                }}>
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>{element?.table_slug}</CTableCell>
                <CTableCell>{element?.view_slug}</CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteRoleElement(element.guid);
                    }}>
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

      {Boolean(modalType) && (
        <ConnectionCreateModal
          settingLan={settingLan}
          closeModal={closeModal}
          modalType={modalType}
          connectionId={connectionId}
        />
      )}
    </div>
  );
};

export default ConnectionPage;
