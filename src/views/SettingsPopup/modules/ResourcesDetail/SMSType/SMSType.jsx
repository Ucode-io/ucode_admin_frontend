import { Box, Button } from "@mui/material"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { generateLangaugeText } from "../../../../../utils/generateLanguageText"
import ResourceeEnvironments from "../ResourceEnvironment";
import AllowList from "../AllowList";
import Form from "../Form";
import { ContentTitle } from "../../../components/ContentTitle";
import { useSMSTypeProps } from "./useSMSTypeProps";
import TableView from "../../../../table-redesign/table-view";

export const SMSType = ({
  settingLan,
  i18n,
  control,
  selectedEnvironment,
  setSelectedEnvironment,
  projectEnvironments,
  isEditPage,
  configureLoading,
  updateLoading,
  watch,
  setValue,
  setSettingsSearchParams,
  resourceType,
  resource_type,
  clickHouseList,
  createLoading,
  reconnectResource,
  resourceId,
  reconnectLoading,
  variables,
}) => {

  const {
    visibleColumns,
    visibleRelationColumns,
    views,
    fieldsMap,
    refetch,
    tableLan,
    currentPage,
    setCurrentPage,
    filterVisible,
    setFilterVisible,
    control: tableControl,
    reset,
    setFormValue,
    getValues,
    watch: tableWatch,
    visibleForm,
    sortedDatas,
    setSortedDatas,
    menuItem,
    fields,
    formVisible,
    setFormVisible,
    filters,
    checkedColumns,
    searchText,
    selectedObjects,
    setSelectedObjects,
    selectedView,
  } = useSMSTypeProps({ i18n });

  return (
    <Box height="100%">
      <Tabs style={{ height: "100%" }}>
        <ContentTitle
          withBackBtn
          onBackClick={() => setSettingsSearchParams({ tab: "resources" })}
          style={{ marginBottom: 0 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              {generateLangaugeText(
                settingLan,
                i18n?.language,
                "Resource settings"
              ) || "Resource settings"}
            </span>
            {/* <Box>
              {(resourceType === "CLICK_HOUSE"
                ? !isEditPage
                : resource_type !== 2 ||
                  (resource_type === 2 &&
                    !isEditPage &&
                    clickHouseList?.length === 0)) && (
                <Button
                  bg="primary"
                  type="submit"
                  sx={{ fontSize: "14px", margin: "0 10px" }}
                  isLoading={createLoading}
                >
                  {generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Save changes"
                  ) || "Save changes"}
                </Button>
              )}

              {isEditPage && variables?.type !== "REST" && (
                <Button
                  sx={{
                    color: "#fff",
                    background: "#38A169",
                    marginRight: "10px",
                  }}
                  hidden={!isEditPage}
                  color={"success"}
                  variant="contained"
                  onClick={() => reconnectResource({ id: resourceId })}
                  isLoading={reconnectLoading}
                >
                  {generateLangaugeText(
                    settingLan,
                    i18n?.language,
                    "Reconnect"
                  ) || "Reconnect"}
                </Button>
              )}
            </Box> */}
          </Box>
        </ContentTitle>
        <TabList>
          <Tab>
            {generateLangaugeText(
              settingLan,
              i18n?.language,
              "Resource settings"
            ) || "Resource settings"}
          </Tab>
          <Tab>
            {generateLangaugeText(settingLan, i18n?.language, "SMS Template") ||
              "SMS Template"}
          </Tab>
        </TabList>
        <TabPanel>
          <Box sx={{ display: "flex", height: "100%" }}>
            {isEditPage && (
              <ResourceeEnvironments
                control={control}
                selectedEnvironment={selectedEnvironment}
                setSelectedEnvironment={setSelectedEnvironment}
              />
            )}
            <Form
              settingLan={settingLan}
              control={control}
              selectedEnvironment={selectedEnvironment}
              btnLoading={configureLoading || updateLoading}
              setSelectedEnvironment={setSelectedEnvironment}
              projectEnvironments={projectEnvironments}
              isEditPage={isEditPage}
              watch={watch}
              setValue={setValue}
            />
            <AllowList />
          </Box>
        </TabPanel>
        <TabPanel>
          <TableView
            fieldsMap={fieldsMap}
            refetchViews={refetch}
            tableLan={tableLan}
            visibleColumns={visibleColumns}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            visibleRelationColumns={visibleRelationColumns}
            visibleForm={visibleForm}
            currentView={views[0]}
            filterVisible={filterVisible}
            setFilterVisible={setFilterVisible}
            getValues={getValues}
            selectedTabIndex={1}
            isTableView={true}
            reset={reset}
            sortedDatas={sortedDatas}
            menuItem={menuItem}
            fields={fields}
            setFormValue={setFormValue}
            control={tableControl}
            setFormVisible={setFormVisible}
            formVisible={formVisible}
            filters={filters}
            checkedColumns={checkedColumns}
            view={views[0]}
            setSortedDatas={setSortedDatas}
            searchText={searchText}
            selectedObjects={selectedObjects}
            setSelectedObjects={setSelectedObjects}
            selectedView={selectedView}
            watch={tableWatch}
            height="auto"
            tableSlugProp="sms_template"
          />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
