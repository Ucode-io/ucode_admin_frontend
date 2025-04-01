import cls from "./styles.module.scss";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import { Add, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { Container, Draggable } from "react-smooth-dnd";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import { useRedirectProps } from "./useRedirectProps";
import { ContentTitle } from "../../components/ContentTitle";
import { Button } from "../../components/Button";
import { Box } from "@mui/material";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";

export const Redirect = () => {
  const {
    computedData,
    navigateToEditForm,
    navigateToCreateForm,
    deleteRedirectElement,
    onDrop,
  } = useRedirectProps();

  return (
    <div>
      <ContentTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Redirects</span>
          <Button primary onClick={navigateToCreateForm}>
            Add
          </Button>
        </Box>
      </ContentTitle>
      <CTable disablePagination removableHeight={0}>
        <CTableHead>
          <CTableCell className={cls.tableHeadCell} width={10}>
            №
          </CTableCell>
          <CTableCell className={cls.tableHeadCell}>From</CTableCell>
          <CTableCell className={cls.tableHeadCell}>To</CTableCell>
          <CTableCell>Created at</CTableCell>
          <CTableCell>Updated at</CTableCell>
          <CTableCell width={60}></CTableCell>
        </CTableHead>
        <CTableBody>
          {computedData?.map((element, index) => (
            <CTableRow
              key={element.id}
              onClick={() => navigateToEditForm(element.id)}
            >
              <CTableCell className={cls.tBodyCell}>{index + 1}</CTableCell>
              <CTableCell className={cls.tBodyCell}>{element?.from}</CTableCell>
              <CTableCell className={cls.tBodyCell}>{element?.to}</CTableCell>
              <CTableCell className={cls.tBodyCell}>
                {format(
                  new Date(element?.created_at),
                  "MMMM d, yyyy 'at' kk:mm"
                )}
              </CTableCell>
              <CTableCell className={cls.tBodyCell}>
                {format(
                  new Date(element?.updated_at),
                  "MMMM d, yyyy 'at' kk:mm"
                )}
              </CTableCell>
              <CTableCell className={cls.tBodyCell}>
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
        </CTableBody>
      </CTable>

      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "5px",
          border: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
            fontWeight: "bold",
          }}
        >
          <div
            className={cls.tableHeadCell}
            style={{
              width: 50,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            №
          </div>
          <div
            className={cls.tableHeadCell}
            style={{
              flex: 2,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            From
          </div>
          <div
            className={cls.tableHeadCell}
            style={{
              flex: 1,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            To
          </div>
          <div
            className={cls.tableHeadCell}
            style={{
              flex: 1,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            Created at
          </div>
          <div
            className={cls.tableHeadCell}
            style={{
              flex: 1,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            Updated at
          </div>
          <div style={{ width: 60 }}></div>
        </div>
        <Container
          groupName="subtask"
          onDrop={onDrop}
          dropPlaceholder={{ className: "drag-row-drop-preview" }}
        >
          {customComputedData?.map((element, index) => (
            <Draggable key={element.id}>
              <div
                onClick={() => navigateToEditForm(element.id)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <div
                  className={cls.tBodyCell}
                  style={{
                    width: 50,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {index + 1}
                </div>
                <div
                  className={cls.tBodyCell}
                  style={{
                    flex: 2,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {element?.from}
                </div>
                <div
                  className={cls.tBodyCell}
                  style={{
                    flex: 1,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {element?.to}
                </div>
                <div
                  className={cls.tBodyCell}
                  style={{
                    flex: 1,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {format(
                    new Date(element?.created_at),
                    "MMMM d, yyyy 'at' kk:mm"
                  )}
                </div>
                <div
                  className={cls.tBodyCell}
                  style={{
                    flex: 1,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {format(
                    new Date(element?.updated_at),
                    "MMMM d, yyyy 'at' kk:mm"
                  )}
                </div>
                <div
                  style={{
                    width: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RectangleIconButton
                    color="error"
                    onClick={() => {
                      deleteRedirectElement(element.id);
                    }}
                  >
                    <Delete color="error" />
                  </RectangleIconButton>
                </div>
              </div>
            </Draggable>
          ))}
        </Container>
      </div> */}
    </div>
  );
};
