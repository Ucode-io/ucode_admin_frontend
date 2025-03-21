import HeaderSettings from "@/components/HeaderSettings";
import TableCard from "@/components/TableCard";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import { Add, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import { Container, Draggable } from "react-smooth-dnd";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import { useRedirectProps } from "./useRedirectProps";
import { ContentTitle } from "../../components/ContentTitle";

export const Redirect = () => {

  const {
    computedData,
    navigateToEditForm,
    navigateToCreateForm,
    deleteRedirectElement,
    onDrop,
  } = useRedirectProps()

  return (
    <div>
      <ContentTitle>Redirects</ContentTitle>

      <div
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
            style={{
              width: 50,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            №
          </div>
          <div
            style={{
              flex: 2,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            From
          </div>
          <div
            style={{
              flex: 1,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            To
          </div>
          <div
            style={{
              flex: 1,
              borderRight: "1px solid rgba(0, 0, 0, 0.12)",
              padding: "8px",
            }}
          >
            Created at
          </div>
          <div
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
          {computedData?.map((element, index) => (
            <Draggable key={element.id}>
              <div
                onClick={() => navigateToEditForm(element.id)}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <div
                  style={{
                    width: 50,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {index + 1}
                </div>
                <div
                  style={{
                    flex: 2,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {element?.from}
                </div>
                <div
                  style={{
                    flex: 1,
                    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
                    padding: "8px",
                  }}
                >
                  {element?.to}
                </div>
                <div
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
          <SecondaryButton
            type="button"
            style={{ width: "100%", marginTop: "10px" }}
            onClick={navigateToCreateForm}
          >
            <Add />
            Add
          </SecondaryButton>
        </Container>
      </div>
    </div>
  );
};
