import { Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import FiltersBlock from "../../components/FiltersBlock";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import SearchInput from "../../components/SearchInput";
import TableCard from "../../components/TableCard";
import TableRowButton from "../../components/TableRowButton";
import { useEffect, useState } from "react";
import smsOtpService from "../../services/auth/smsOtpService";

const smsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const list = useSelector((state) => state.application.list);
  const loader = useSelector((state) => state.application.loader);
  const projectId = useSelector((state) => state.auth.projectId);
  const [smsOtp, setSmsOtp] = useState();
  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const params = {
    'project-id': projectId
  }

  const deleteTable = (id) => {
    smsOtpService.delete(params, id).then(() => {
      getList();
    });
  };


  const getList = () => {
    const params = {
      'project-id': projectId
    };
    smsOtpService
      .getList(params)
      .then((res) => {
        console.log('resssssssss', res?.items)
        setSmsOtp(res.items);
      })
      .catch((err) => {
        console.log("exportToJson error", err);
      });
  };

  useEffect(() => {
    getList();
  }, []);


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
          <h2>Sms otp setting</h2>
          <SearchInput />
        </div>
      </FiltersBlock>

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>Login</CTableCell>
            <CTableCell>Default Otp</CTableCell>
            <CTableCell>Number of Otp </CTableCell>
            <CTableCell>Password</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>

          <CTableBody loader={loader} columnsCount={4} dataLength={list.length}>
            {smsOtp?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.login}</CTableCell>
                <CTableCell>{element?.default_otp}</CTableCell>
                <CTableCell>{element?.number_of_otp}</CTableCell>
                <CTableCell>{element?.password}</CTableCell>
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
    </div>
  );
};

export default smsPage;
