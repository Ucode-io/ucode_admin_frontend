import {Box} from "@mui/material";
import {useResourcesProps} from "./useResourcesProps";
import {ContentTitle} from "../../components/ContentTitle";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {ContentList} from "../../components/ContentList";
import {Button} from "../../components/Button";

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
        sx={{ marginTop: "36px" }}
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
