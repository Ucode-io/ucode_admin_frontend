import { useMicroFrontendDetailProps } from "./useMicroFrontendDetailProps"
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
import HFSelect from "@/components/FormElements/HFSelect";
import { ContentTitle } from "../../components/ContentTitle";
import { Box, Grid } from "@mui/material";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";

export const MicroFrontendDetail = () => {

  const {
    loader,
    microfrontendId,
    mainForm,
    onSubmit,
    resourceOptions,
    resourceId,
    repositories,
    branches,
    frameworkOptions,
    handleBackClick,
  } = useMicroFrontendDetailProps();

  if (loader) return <PageFallback />;

  return (
    <div>
      <ContentTitle 
        subtitle={microfrontendId ? mainForm.watch("name"): "Новый"}
        withBackBtn
        onBackClick={handleBackClick}
      >
        Микрофронтенд
      </ContentTitle>
      <Box mt={2}>
        <ContentTitle>Детали</ContentTitle>
      </Box>
      <form
        onSubmit={mainForm.handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FRow
              label={"Ресурс"}
              componentClassName="flex gap-2 align-center"
              required>
              <HFSelect
                disabledHelperText
                name="resource_id"
                control={mainForm.control}
                fullWidth
                options={resourceOptions}
                required
              />
            </FRow>
          </Grid>
          {resourceId !== "ucode_gitlab" && (
          <Grid item xs={6}>
            <FRow label="Репозиторий" required>
              {microfrontendId ? (
                <HFTextField
                  name="path"
                  control={mainForm.control}
                  disabled
                />
              ) : (
                <HFSelect
                  name="repo_name"
                  control={mainForm.control}
                  options={repositories ?? []}
                  required
                />
              )}
            </FRow>
          </Grid>
        )}
        {
          resourceId !== "ucode_gitlab" && (
            <Grid item xs={6}>
              <FRow label="Ветка" required>
                {microfrontendId ? (
                  <HFTextField
                    name="branch"
                    control={mainForm.control}
                    disabled
                  />
                ) : (
                  <HFSelect
                    name="branch"
                    control={mainForm.control}
                    options={branches}
                    required
                  />
                )}
              </FRow>
            </Grid>
          )
        }
        {resourceId === "ucode_gitlab" && (
          <Grid item xs={6}>
            <FRow
              label={"Ссылка"}
              componentClassName="flex gap-2 align-center"
              required>
              <HFTextField
                disabledHelperText
                name="path"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
          </Grid>
        )}
        <Grid item xs={6}>
          <FRow
            label={"Названия"}
            componentClassName="flex gap-2 align-center"
            required>
            <HFTextField
              disabledHelperText
              name="name"
              control={mainForm.control}
              fullWidth
              required
            />
          </FRow>
        </Grid>
        <Grid item xs={6}>
          <FRow label="Фреймворк" required>
            <HFSelect
              name="framework_type"
              control={mainForm.control}
              options={frameworkOptions}
              defaultValue="REACT"
              required
            />
          </FRow>
        </Grid>
        {resourceId === "ucode_gitlab" && (
          <Grid item xs={6}>
            <FRow label="Описания">
              <HFTextField
                name="description"
                control={mainForm.control}
                multiline
                rows={4}
                fullWidth
              />
            </FRow>
          </Grid>
        )}
        </Grid>
      </form>
      <PermissionWrapperV2 tableSlug="app" type="update">
        <SaveCancelBtns
          saveProps={{
            onClick: mainForm.handleSubmit(onSubmit),
          }}
          cancelProps={{
            onClick: handleBackClick,
          }}
        />
      </PermissionWrapperV2>
{/* 
      <Footer
        extra={
          <>
            <SecondaryButton
              onClick={() => navigate(microfrontendListPageLink)}
              color="error">
              Close
            </SecondaryButton>
            <PermissionWrapperV2 tableSlug="app" type="update">
              <PrimaryButton
                loader={btnLoader || createWebHookIsLoading}
                onClick={mainForm.handleSubmit(onSubmit)}>
                <Save /> Save
              </PrimaryButton>
            </PermissionWrapperV2>
          </>
        }
      /> */}
    </div>
  );
}
