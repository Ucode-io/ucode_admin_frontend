import { Save } from "@mui/icons-material"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import Select from "react-select";
import { Box } from "@mui/material"
import { useApiKeysDetail } from "./useApiKeysDetail"
import { ContentTitle } from "../../components/ContentTitle"
import HeaderSettings from "@/components/HeaderSettings"
import FiltersBlock from "@/components/FiltersBlock"
import DateForm from "@/components/DateForm"
import FormCard from "@/components/FormCard"
import FRow from "@/components/FormElements/FRow"
import HFTextField from "@/components/FormElements/HFTextField"
import HFSelect from "@/components/FormElements/HFSelect"
import Footer from "@/components/Footer"
import { Button } from "../../components/Button"
import ActivityFeedTable from "@/components/LayoutSidebar/Components/ActivityFeedButton/components/ActivityFeedTable"
import TokensTable from "@/components/LayoutSidebar/Components/ActivityFeedButton/components/TokensTable"
import { customStyles } from "../../../../components/Status";

export const ApiKeysDetail = () => {

  const {
    t,
    selectedTab,
    appId,
    mainForm,
    setSelectedTab,
    inputValue,
    setInputValue,
    setDate,
    date,
    onSubmit,
    apiKeyId,
    btnLoader,
    setHistories,
    view,
    edit,
    create,
    getClientPlatformList,
    getRoleList,
    platformList,
    apiKey,
    onBackBtnClick,
  } = useApiKeysDetail()

  return <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <Tabs style={{height: "100%"}} selectedIndex={selectedTab} direction={"ltr"}>
      <ContentTitle withBackBtn onBackClick={onBackBtnClick} subtitle={appId ? mainForm.watch("name") : "Новый"}>
        {
          t("details")
        }
      </ContentTitle>
      <TabList>
        <Tab onClick={() => setSelectedTab(0)}>Api Key</Tab>
        <Tab onClick={() => setSelectedTab(1)}>Log</Tab>
        <Tab onClick={() => setSelectedTab(2)}>Tokens</Tab>
      </TabList>
      {selectedTab === 1 && (
        <FiltersBlock
          style={{
            justifyContent: "end",
          }}>
          <Select
            inputValue={inputValue}
            onInputChange={(newInputValue, {action}) => {
              setInputValue(newInputValue);
            }}
            options={[
              {label: "text", value: "re"},
              {label: "jo", value: "re"},
            ]}
            menuPortalTarget={document.body}
            isClearable
            isSearchable
            isDisabled
            components={{
              // ClearIndicator: () =>
              //     inputValue?.length && (
              //         <div
              //             style={{
              //                 marginRight: "10px",
              //                 cursor: "pointer",
              //             }}
              //             onClick={(e) => {
              //                 e.stopPropagation();
              //             }}
              //         >
              //             <ClearIcon />
              //         </div>
              //     ),
              DropdownIndicator: null,
            }}
            onChange={(newValue, {action}) => {
              //   changeHandler(newValue);
            }}
            menuShouldScrollIntoView
            styles={customStyles}
            onPaste={(e) => {}}
            isOptionSelected={(option, value) =>
              value.some((val) => val.guid === value)
            }
            blurInputOnSelect
          />
          <DateForm
            onChange={setDate}
            date={date}
            views={["month", "year"]}
          />
        </FiltersBlock>
      )}
      <TabPanel height="100%">
        <form
          onSubmit={mainForm.handleSubmit(onSubmit)}
          className="pt-2"
        >
          <Box maxWidth="500px">
            <FRow
              label={"Name"}
              componentClassName="flex gap-2 align-center"
              required>
              <HFTextField
                disabled={Boolean(edit || view)}
                disabledHelperText
                name="name"
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
            <FRow
              label={"Platform"}
              componentClassName="flex gap-2 align-center"
              required>
              <HFSelect
                isClearable={create}
                disabled={Boolean(edit || view)}
                disabledHelperText
                name="client_platform_id"
                options={platformList}
                control={mainForm.control}
                fullWidth
                required
              />
            </FRow>
            {apiKeyId && (
              <>
                <FRow
                  label={"App ID"}
                  componentClassName="flex gap-2 align-center"
                  required>
                  <HFTextField
                    disabledHelperText
                    name="app_id"
                    control={mainForm.control}
                    fullWidth
                    required
                    disabled
                  />
                </FRow>
                <FRow
                  label="Monthly limit"
                  componentClassName="flex gap-2 align-center"
                  required>
                  <HFTextField
                    disabledHelperText
                    name="monthly_request_limit"
                    control={mainForm.control}
                    fullWidth
                    required
                    disabled
                  />
                </FRow>
                <FRow
                  label="RPS limit"
                  componentClassName="flex gap-2 align-center"
                  required>
                  <HFTextField
                    disabledHelperText
                    name="rps_limit"
                    control={mainForm.control}
                    fullWidth
                    required
                    disabled
                  />
                </FRow>
                <FRow
                  label="Used count"
                  componentClassName="flex gap-2 align-center"
                  required>
                  <HFTextField
                    disabledHelperText
                    name="used_count"
                    control={mainForm.control}
                    fullWidth
                    required
                    disabled
                  />
                </FRow>
              </>
            )}
          </Box>
        </form>
        <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", maxWidth: "500px", }}>
          {Boolean(
            edit || create
          ) && (
            <Button
              primary
              loader={btnLoader}
              onClick={mainForm.handleSubmit(onSubmit)}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Save />
                <span>Save</span>
              </Box>
            </Button>
          )}
        </Box>
      </TabPanel>
      <TabPanel>
        <ActivityFeedTable
          setHistories={setHistories}
          type="padding"
          requestType="API_KEY"
          apiKey={apiKey}
          actionByVisible={false}
          dateFilters={date}
        />
      </TabPanel>
      <TabPanel>
        <TokensTable
          mainForm={mainForm}
          setHistories={setHistories}
          type="padding"
          requestType="API_KEY"
          apiKey={apiKey}
          actionByVisible={false}
          dateFilters={date}
        />
      </TabPanel>
    </Tabs>
  </Box>

}
