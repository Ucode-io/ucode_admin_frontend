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
  } = useResourcesProps();

  return (
    <Box>
      <ContentTitle>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
          <span>
            {generateLangaugeText(lang, i18n?.language, "Resources") ||
              "Resources"}
          </span>
          <Box>
            <Button onClick={handleAddClick}>{t("add_resource")}</Button>
          </Box>
        </Box>
      </ContentTitle>
      <ContentList
        handleClose={handleClose}
        sx={{marginTop: "36px"}}
        arr={computedResources}
        onItemClick={(row) => handleItemClick(row)}
        handleDelete={(row) => console.log(row)}
        isLoading={isLoading}
        canDelete
      />
    </Box>
  );
};
