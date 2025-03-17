import { useModelsProps } from "./useModelsProps";
import {Delete} from "@mui/icons-material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import TableCard from "@/components/TableCard";
import TableRowButton from "@/components/TableRowButton";
import HeaderSettings from "@/components/HeaderSettings";
import SearchInput from "@/components/SearchInput";
import FiltersBlock from "@/components/FiltersBlock";
import { ContentTitle } from "../../components/ContentTitle";

export const Models = () => {

  const {
    tables,
    loader,
    setSearchText,
    navigateToEditForm,
    deleteTable,
  } = useModelsProps();

  return (
    <>
      <div>
        <ContentTitle>Таблицы</ContentTitle>

        <FiltersBlock>
          <div className="p-1">
            <SearchInput
              onChange={(val) => {
                setSearchText(val);
              }}
            />
          </div>
        </FiltersBlock>
        <TableCard type={"withoutPadding"}>
          <CTable
            tableStyle={{
              borderRadius: "0px",
              border: "none",
            }}
            disablePagination
            removableHeight={120}>
            <CTableHead>
              <CTableCell width={10}>№</CTableCell>
              <CTableCell>Name</CTableCell>
              <CTableCell>Description</CTableCell>
              <CTableCell width={60} />
            </CTableHead>
            <CTableBody columnsCount={4} dataLength={1} loader={loader}>
              {tables?.tables?.map((element, index) => (
                <CTableRow key={element.id}>
                  <CTableCell>{index + 1}</CTableCell>
                  <CTableCell>{element.label}</CTableCell>
                  <CTableCell>{element.description}</CTableCell>

                  <CTableCell>
                    <RectangleIconButton
                      id="delete_btn"
                      color="error"
                      onClick={() => deleteTable(element.id)}>
                      <Delete color="error" />
                    </RectangleIconButton>
                  </CTableCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </TableCard>
      </div>
    </>
  );
};
