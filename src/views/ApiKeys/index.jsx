import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import DeleteWrapperModal from "../../components/DeleteWrapperModal";
import FiltersBlock from "../../components/FiltersBlock";
import HeaderSettings from "../../components/HeaderSettings";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../components/SearchInput";
import TableCard from "../../components/TableCard";
import TableRowButton from "../../components/TableRowButton";
import UploadIcon from "@mui/icons-material/Upload";
import exportToJsonService from "../../services/exportToJson";
import useDownloader from "../../hooks/useDownloader";
import { useEffect, useRef, useState } from "react";
import fileService from "../../services/fileService";
import apiKeyService from "../../services/apiKey.service";

const ApiKeyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { download } = useDownloader();
  const list = useSelector((state) => state.application.list);
  const loader = useSelector((state) => state.application.loader);
  const projectId = useSelector((state) => state.auth.projectId);
  const clientTypeId = useSelector((state) => state.auth.clientType.id);
  const roleId = useSelector((state) => state.auth.roleInfo.id);
  const inputRef = useRef();
  const [apiKeys, setApiKeys] = useState();
  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };


  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const deleteTable = (id) => {
    // dispatch(deleteApplicationAction(id));
    apiKeyService.delete(projectId, id).then(() => {
      getList();
    });
  };

  const exportToJson = async (id) => {
    await exportToJsonService
      .postToJson({
        app_id: id,
      })
      .then((res) => {
        download({
          link: "https://" + res?.link,
          fileName: res?.link.split("/").pop(),
        });
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };
  const getList = () => {
    const params = {
      clientTypeId: clientTypeId,
      roleId: roleId,
    };
    apiKeyService
      .getList(projectId, params)
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

  const inputChangeHandler = (e) => {
    const file = e.target.files[0];

    const data = new FormData();
    data.append("file", file);

    fileService.upload(data).then((res) => {
      fileSend(res?.filename);
    });
  };

  const fileSend = (value) => {
    exportToJsonService.uploadToJson({
      file_name: value,
      // app_id: appId,
    });
  };

  return (
    <div>
      <FiltersBlock>
        <div
          className="p-1"
          style={{
            display: "flex",
            columnGap: "16px",
            alignItems: "center",
          }}
        >
          <h2>Api Keys</h2>
          <SearchInput />
        </div>
      </FiltersBlock>

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Name</CTableCell>
            <CTableCell>AppId</CTableCell>
            <CTableCell>App secret </CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>

          <CTableBody loader={loader} columnsCount={4} dataLength={list.length}>
            {apiKeys?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>{element?.app_id}</CTableCell>
                <CTableCell>{element?.app_secret}</CTableCell>
                {/* <PermissionWrapperV2 tabelSlug="app" type="delete">
                  <PermissionWrapperApp permission={element.permission.delete}> */}
                <CTableCell>
                  <DeleteWrapperModal id={element.id} onDelete={deleteTable}>
                    <RectangleIconButton color="error">
                      <Delete color="error" />
                    </RectangleIconButton>
                  </DeleteWrapperModal>
                </CTableCell>
                {/* </PermissionWrapperApp>
                </PermissionWrapperV2> */}
              </CTableRow>
            ))}
            <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton colSpan={4} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default ApiKeyPage;
