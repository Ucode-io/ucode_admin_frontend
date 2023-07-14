import { useLocation, useNavigate } from "react-router-dom";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "../../components/CTable";
import FiltersBlock from "../../components/FiltersBlock";
import HeaderSettings from "../../components/HeaderSettings";
import PermissionWrapperV2 from "../../components/PermissionWrapper/PermissionWrapperV2";
import TableCard from "../../components/TableCard";
import TableRowButton from "../../components/TableRowButton";
import RectangleIconButton from "../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";
import { store } from "../../store";
import { useQueryClient } from "react-query";
import { showAlert } from "../../store/alert/alert.thunk";
import {
  useRedirectDeleteMutation,
  useRedirectListQuery,
} from "../../services/redirectService";
import { format } from "date-fns";

const RedirectPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToEditForm = (id) => {
    navigate(`${location.pathname}/${id}`);
  };

  const navigateToCreateForm = () => {
    navigate(`${location.pathname}/create`);
  };

  const { data: redirects, isLoading: redirectLoading } =
    useRedirectListQuery();

  const { mutateAsync: deleteRedirect, isLoading: createLoading } =
    useRedirectDeleteMutation({
      onSuccess: () => {
        store.dispatch(showAlert("Успешно", "success"));
        queryClient.refetchQueries(["REDIRECT"]);
      },
    });

  const deleteRedirectElement = (id) => {
    deleteRedirect(id);
  };

  return (
    <div>
      <HeaderSettings title={"Redirects"} />

      <FiltersBlock>
        <div className="p-1">{/* <SearchInput /> */}</div>
      </FiltersBlock>

      <TableCard>
        <CTable disablePagination removableHeight={140}>
          <CTableHead>
            <CTableCell width={10}>№</CTableCell>
            <CTableCell>From</CTableCell>
            <CTableCell>To</CTableCell>
            <CTableCell>Created at</CTableCell>
            <CTableCell>Updated at</CTableCell>
            <CTableCell width={60}></CTableCell>
          </CTableHead>
          <CTableBody
            loader={redirectLoading}
            columnsCount={4}
            dataLength={redirects?.redirect_urls?.length}
          >
            {redirects?.redirect_urls?.map((element, index) => (
              <CTableRow
                key={element.id}
                onClick={() => navigateToEditForm(element.id)}
              >
                <CTableCell>{index + 1}</CTableCell>
                <CTableCell>{element?.from}</CTableCell>
                <CTableCell>{element?.to}</CTableCell>
                <CTableCell>
                  {format(
                    new Date(element?.created_at),
                    "MMMM d, yyyy 'at' kk:mm"
                  )}
                </CTableCell>
                <CTableCell>
                  {format(
                    new Date(element?.updated_at),
                    "MMMM d, yyyy 'at' kk:mm"
                  )}
                </CTableCell>
                <CTableCell>
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteRedirectElement(element.id);
                    }}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </CTableCell>
              </CTableRow>
            ))}
            <PermissionWrapperV2 tabelSlug="app" type="write">
              <TableRowButton colSpan={6} onClick={navigateToCreateForm} />
            </PermissionWrapperV2>
          </CTableBody>
        </CTable>
      </TableCard>
    </div>
  );
};

export default RedirectPage;
