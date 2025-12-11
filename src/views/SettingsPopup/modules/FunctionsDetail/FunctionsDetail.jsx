import PageFallback from "@/components/PageFallback";
import PermissionWrapperV2 from "@/components/PermissionWrapper/PermissionWrapperV2";
import { Box } from "@mui/material";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { useFunctionsDetailProps } from "./useFunctionsDetailProps";
import { CodeForm } from "./components/CodeForm";
import { ContentTitle } from "../../components/ContentTitle";
import { KnativeLogs } from "./components/KnativeLogs";
import { SaveCancelBtns } from "../../components/SaveCancelBtns";

export const FunctionsDetail = () => {
  const {
    functionId,
    navigate,
    btnLoader,
    loader,
    logsList,
    functionLan,
    i18n,
    mainForm,
    knativeForm,
    resourceId,
    resourceOptions,
    branches,
    branchesGitlab,
    createWebHookIsLoading,
    createFunctionIsLoading,
    updateFunctionIsLoading,
    isLoading,
    onSubmit,
    onSubmitKnative,
    resourcesOptions,
    handleBackClick,
  } = useFunctionsDetailProps();

  if (isLoading) return <PageFallback />;

  return (
    <div>
      <Tabs>
        <ContentTitle withBackBtn onBackClick={handleBackClick}>
          Faas функция
        </ContentTitle>
        <TabList>
          <Tab>
            {generateLangaugeText(functionLan, i18n?.language, "Details") ||
              "Details"}
          </Tab>
          <Tab>
            {generateLangaugeText(functionLan, i18n?.language, "Logs") ||
              "Logs"}
          </Tab>
        </TabList>
        <TabPanel>
          <CodeForm
            onSubmit={mainForm.handleSubmit(onSubmit)}
            control={mainForm.control}
            branches={branches}
            branchesGitlab={branchesGitlab}
            createWebHookIsLoading={createWebHookIsLoading}
            createFunctionIsLoading={createFunctionIsLoading}
            updateFunctionIsLoading={updateFunctionIsLoading}
            btnLoader={btnLoader}
            resourcesOptions={resourcesOptions}
            watch={mainForm.watch}
            resourceId={resourceId}
            functionId={functionId}
            handleClose={navigate}
            lang={functionLan}
            resourceOptions={resourceOptions}
            type={"function"}
          />
        </TabPanel>

        <TabPanel>
          <Box
            sx={{
              background: "#fff",
            }}
          >
            <form onSubmit={knativeForm.handleSubmit(onSubmitKnative)}>
              <KnativeLogs
                onSubmitKnative={onSubmitKnative}
                logsList={logsList}
                loader={loader}
                knativeForm={knativeForm}
              />
            </form>
          </Box>
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
          {/* <Footer
            extra={
              <>
                <SecondaryButton
                  onClick={() => navigate(microfrontendListPageLink)}
                  color="error">
                  Close
                </SecondaryButton>
                <PermissionWrapperV2 tableSlug="app" type="update">
                  <PrimaryButton
                    loader={
                      btnLoader ||
                      createWebHookIsLoading ||
                      createFunctionIsLoading ||
                      updateFunctionIsLoading
                    }
                    onClick={mainForm.handleSubmit(onSubmit)}>
                    <Save /> Save
                  </PrimaryButton>
                </PermissionWrapperV2>
              </>
            }
          /> */}
        </TabPanel>
      </Tabs>
    </div>
  );
};
