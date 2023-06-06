import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
} from "../../../components/CTable";
import FiltersBlock from "../../../components/FiltersBlock";
import HeaderSettings from "../../../components/HeaderSettings";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../../components/SearchInput";
import TableCard from "../../../components/TableCard";
import TableRowButton from "../../../components/TableRowButton";
import { useEffect, useState } from "react";
import microfrontendService from "../../../services/microfrontendService";

const MicrofrontendPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const deleteTable = (id) => {};

  const getMicrofrontendList = (e) => {
    microfrontendService.getList().then((res) => {
      console.log("res", res);
    });
  };

  useEffect(() => {
    getMicrofrontendList();
  }, []);

  return (
    <div>
      <HeaderSettings title={"Микрофронтенд"} />

      <FiltersBlock>
        <div className="p-1">
          <SearchInput />
        </div>
      </FiltersBlock>

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Название</CTableCell>
            <CTableCell>Описание</CTableCell>
            <CTableCell width={60}></CTableCell>
            <PermissionWrapperV2 tabelSlug="app" type="delete">
              <CTableCell width={60} />
            </PermissionWrapperV2>
          </CTableHead>

          <CTableBody
            loader={loader}
            columnsCount={4}
            dataLength={list?.length}
          >
            {/* {list?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element.name}</CTableCell>
                <CTableCell>{element.description}</CTableCell>
                <CTableCell>
                  {" "}
                  <RectangleIconButton color="white">
                    <FileDownloadIcon />
                  </RectangleIconButton>
                </CTableCell>
                <PermissionWrapperV2 tabelSlug="app" type="delete">
                  <PermissionWrapperApp permission={element.permission.delete}>
                    <CTableCell>
                      <DeleteWrapperModal
                        id={element.id}
                        onDelete={deleteTable}
                      >
                        <RectangleIconButton color="error">
                          <Delete color="error" />
                        </RectangleIconButton>
                      </DeleteWrapperModal>
                    </CTableCell>
                  </PermissionWrapperApp>
                </PermissionWrapperV2>
              </CTableRow>
            ))} */}
            <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton colSpan={4} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default MicrofrontendPage;
