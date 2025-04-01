import { Box, List, ListItem, ListItemText, Skeleton } from "@mui/material";
import { RiPencilFill } from "react-icons/ri";
import DeleteWrapperModal from "../../../../components/DeleteWrapperModal";
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton";
import { Delete } from "@mui/icons-material";

export const ContentList = ({ 
    arr,
    onItemClick = () => {},
    additional = null,
    isLoading,
    selectedFieldKey = "name",
    canEdit,
    canDelete,
    handleDelete = () => {},
    handleEdit = () => {},
    ...props
  }) => {

  if(isLoading) {
    return <Box sx={{ marginTop: "36px" }}>
      <Skeleton height="49px" width="100%" />
      <Skeleton height="49px" width="100%" />
      <Skeleton height="49px" width="100%" />
      <Skeleton height="49px" width="100%" />
    </Box>
  }

  return (
    <List {...props}>
      {arr?.map((row) => {
        return (
          <ListItem
            key={row.id || row.guid || row.name}
            sx={{ borderBottom: "1px solid #E0E0E0", cursor: "pointer" }}
            onClick={() => onItemClick(row)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ListItemText>{row?.[selectedFieldKey]}</ListItemText>
              {(canEdit || canDelete) && (
                <Box display="flex" alignItems="center" gap="10px">
                  {canEdit && (
                    <RiPencilFill
                      cursor="pointer"
                      size={13}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(e, row);
                      }}
                      style={{
                        color: "#475467",
                      }}
                    />
                  )}
                  {canDelete && (
                    <Box className="extra_icon">
                      <DeleteWrapperModal onDelete={() => handleDelete(row)}>
                        <RectangleIconButton style={{ border: "none" }}>
                          <Delete
                            size={13}
                            style={{
                              color: "#475467",
                            }}
                          />
                        </RectangleIconButton>
                      </DeleteWrapperModal>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
}