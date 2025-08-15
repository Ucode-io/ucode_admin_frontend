import {Delete} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useQuery, useQueryClient} from "react-query";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../../components/CTable";
import PermissionWrapperV2 from "../../../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../../../components/TableCard";
import TableRowButton from "../../../../components/TableRowButton";
import connectionServiceV2, {
  useConnectionDeleteMutation,
} from "../../../../services/auth/connectionService";
import {store} from "../../../../store";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {getAllFromDB} from "../../../../utils/languageDB";
import ConnectionCreateModal from "../../../Permissions/Connections/ConnectionFormPage";

function ConnectionsModal() {
  const {clientId} = useParams();
  const queryClient = useQueryClient();
  const [modalType, setModalType] = useState();
  const [connectionId, setConnectionId] = useState();
  const {i18n} = useTranslation();
  const [settingLan, setSettingLan] = useState();
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

  useEffect(() => {
    let isMounted = true;

    getAllFromDB().then((storedData) => {
      if (isMounted && storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));
        setSettingLan(formattedData?.find((item) => item?.key === "Setting"));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{height: "calc(100vh - 100px)"}}>
      <TableCard cardStyles={{height: "calc(100vh - 200px)"}}>
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

      {modalType && (
        <ConnectionCreateModal
          settingLan={settingLan}
          closeModal={closeModal}
          modalType={modalType}
          connectionId={connectionId}
        />
      )}
    </div>
  );
}

export default ConnectionsModal;
