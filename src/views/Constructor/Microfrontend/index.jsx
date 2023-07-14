import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../../components/CTable";
import FiltersBlock from "../../../components/FiltersBlock";
import HeaderSettings from "../../../components/HeaderSettings";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../../components/SearchInput";
import TableCard from "../../../components/TableCard";
import TableRowButton from "../../../components/TableRowButton";
import { useEffect, useState } from "react";
import microfrontendService from "../../../services/microfrontendService";
import RectangleIconButton from "../../../components/Buttons/RectangleIconButton";
import DeleteWrapperModal from "../../../components/DeleteWrapperModal";
import { Delete } from "@mui/icons-material";

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

  const deleteTable = (id) => {
    microfrontendService.delete(id).then(() => {
      getMicrofrontendList();
    });
  };

  const getMicrofrontendList = () => {
    microfrontendService.getList().then((res) => {
      setList(res);
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
            <CTableCell>Cсылка</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={loader}
            columnsCount={4}
            dataLength={list?.functions?.length}
          >
            {list?.functions?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.name}</CTableCell>
                <CTableCell>{element?.description}</CTableCell>
                <CTableCell>{element?.path}</CTableCell>
                <CTableCell>
                  <RectangleIconButton color="error" onClick={deleteTable}>
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
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

export default MicrofrontendPage;
