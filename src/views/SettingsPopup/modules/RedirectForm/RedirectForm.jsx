import {Save} from "@mui/icons-material";
import PrimaryButton from "@/components/Buttons/PrimaryButton";
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import Footer from "@/components/Footer";
import FormCard from "@/components/FormCard";
import FRow from "@/components/FormElements/FRow";
import HFTextField from "@/components/FormElements/HFTextField";
import HeaderSettings from "@/components/HeaderSettings";
import PageFallback from "@/components/PageFallback";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { useRedirectFormProps } from "./useRedirectFormProps";
import { ContentTitle } from "../../components/ContentTitle";
import { Box } from "@mui/material";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";

export const RedirectForm = () => {
  const {
    isLoading,
    redirectId,
    mainForm,
    onSubmit,
    navigate,
    createLoading,
    updateLoading,
    onBackClick,
  } = useRedirectFormProps();

  if (isLoading) return <PageFallback />;

  return (
    <div>
      <ContentTitle
        withBackBtn
        onBackClick={onBackClick}
        subtitle={redirectId ? mainForm.watch("name") : "Новый"}
      >
        Redirects
      </ContentTitle>

      <form onSubmit={mainForm.handleSubmit(onSubmit)}>
        <Box>
          <ContentTitle>Детали</ContentTitle>
          <FRow
            label={"From"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="defaultFrom"
              control={mainForm.control}
              fullWidth
              required
              disabled={true}
              style={{
                width: "40%",
              }}
            />
            <HFTextField
              disabledHelperText
              name="from"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
          <FRow
            label={"To"}
            componentClassName="flex gap-2 align-center"
            required
          >
            <HFTextField
              disabledHelperText
              name="defaultTo"
              control={mainForm.control}
              fullWidth
              required
              disabled={true}
              style={{
                width: "40%",
              }}
            />
            <HFTextField
              disabledHelperText
              name="to"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
        </Box>
      </form>

      <SaveCancelBtns
        cancelProps={{
          onClick: () => navigate(-1),
        }}
        saveProps={{
          onClick: mainForm.handleSubmit(onSubmit),
        }}
      />
    </div>
  );
};
