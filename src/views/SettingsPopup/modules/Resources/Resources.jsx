import {Box} from "@mui/material";
import {ContentList} from "../../components/ContentList";
import {useResourcesProps} from "./useResourcesProps";

export const Resources = ({handleClose = () => {}}) => {
  const {
    computedResources,
    i18n,
    t,
    lang,
    isLoading,
    handleItemClick,
    handleAddClick,
    resources,
  } = useResourcesProps();

  return (
    <Box>
      <ContentList
        handleClose={handleClose}
        sx={{marginTop: "36px"}}
        arr={computedResources}
        onItemClick={(row) => handleItemClick(row)}
        handleDelete={(row) => console.log(row)}
        isLoading={isLoading}
        canDelete
        resources={resources}
      />
    </Box>
  );
};
