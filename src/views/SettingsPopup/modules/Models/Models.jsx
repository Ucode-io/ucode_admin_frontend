import cls from "./styles.module.scss";
import {useModelsProps} from "./useModelsProps";
import {Delete} from "@mui/icons-material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableRow,
} from "@/components/CTable";
import TableCard from "@/components/TableCard";
import SearchInput from "@/components/SearchInput";
import {ContentTitle} from "../../components/ContentTitle";
import {Box, Button, CircularProgress} from "@mui/material";
import clsx from "clsx";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ChartDb from "../../../ChartDb";
import ExternalDatabases from "./ExternalDatabases";
import {useState} from "react";
import {useQuery} from "react-query";
import conectionDatabaseService from "../../../../services/connectionDatabaseService";
import {useNavigate} from "react-router-dom";

export const Models = ({onClose}) => {
  const navigate = useNavigate();
  const {tables, loader, setSearchText, navigateToEditForm, deleteTable} =
    useModelsProps();
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [loadingId, setLoadingId] = useState();

  const {data: connectionTables, refetch} = useQuery(
    ["GET_CONNECTION_TABLES"],
    () => {
      return conectionDatabaseService.getTables(selectedConnection?.id);
    },
    {
      enabled: Boolean(selectedConnection?.id),
      select: (res) => res?.tables ?? [],
    }
  );

  const trackConnection = (ids) => {
    if (Array.isArray(ids)) {
      conectionDatabaseService
        .trackTable(selectedConnection?.id, {
          table_ids: ids,
        })
        .then((res) => refetch())
        .finally(() => {
          setLoadingId(null);
        });
    } else {
      setLoadingId(ids);
      conectionDatabaseService
        .trackTable(selectedConnection?.id, {
          table_ids: [ids],
        })
        .then((res) => refetch())
        .finally(() => {
          setLoadingId(null);
        });
    }
  };

  const renderTables = Boolean(selectedConnection?.id)
    ? connectionTables
    : tables?.tables;

  const notTrackedTablesIds = renderTables
    ?.filter((el) => !(el?.is_tracked || Boolean(el?.slug)))
    ?.map((el) => el.id);

  const deleteMenuTable = (element) => {
    deleteTable(element.id);

    navigate("/reloadRelations", {
      state: {
        redirectUrl: "/main/c57eedc3-a954-4262-a0af-376c65b5a284",
      },
    });
    onClose();
  };

  return (
    <>
      <Tabs>
        <TabList style={{ borderBottom: "none", marginBottom: "10px" }}>
          <Tab style={{ padding: "10px" }}>Models</Tab>
          <Tab style={{ padding: "10px" }}>ChartDB</Tab>
          {/* <Tab style={{padding: "10px"}}>External Databases</Tab> */}
        </TabList>
        <TabPanel>
          <div>
            <ContentTitle>
              <Box
                display={"flex"}
                justifyContent="space-between"
                alignItems={"center"}
              >
                <span>Таблицы</span>
                <Box display={"flex"} gap="10px">
                  <SearchInput
                    onChange={(val) => {
                      setSearchText(val);
                    }}
                  />
                  <ExternalDatabases
                    selectedConnection={selectedConnection}
                    setSelectedConnection={setSelectedConnection}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => trackConnection(notTrackedTablesIds)}
                    disabled={!notTrackedTablesIds?.length}
                  >
                    Track all
                  </Button>
                </Box>
              </Box>
            </ContentTitle>

            <TableCard
              type={"withoutPadding"}
              bodyClassname={cls.tableCardBody}
            >
              <CTable disablePagination removableHeight={false}>
                <CTableHead>
                  <CTableCell className={cls.tableHeadCell} width={10}>
                    №
                  </CTableCell>
                  <CTableCell className={cls.tableHeadCell}>Name</CTableCell>
                  <CTableCell className={cls.tableHeadCell}>
                    Description
                  </CTableCell>
                  <CTableCell className={cls.tableHeadCell}>Tracked</CTableCell>
                  <CTableCell className={cls.tableHeadCell} width={60} />
                </CTableHead>
                <CTableBody columnsCount={4} dataLength={1} loader={loader}>
                  {renderTables?.map((element, index) => (
                    <CTableRow key={element.id}>
                      <CTableCell
                        style={{ textAlign: "center" }}
                        className={cls.tBodyCell}
                      >
                        {index + 1}
                      </CTableCell>
                      <CTableCell className={cls.tBodyCell}>
                        {element.label || element?.table_name}
                      </CTableCell>
                      <CTableCell className={cls.tBodyCell}>
                        {element.description}
                      </CTableCell>

                      <CTableCell className={cls.tBodyCell}>
                        <Button
                          disabled={
                            element?.is_tracked || Boolean(element?.slug)
                          }
                          onClick={() => trackConnection(element?.id)}
                          color={
                            element?.is_tracked || Boolean(element?.slug)
                              ? "success"
                              : "primary"
                          }
                          variant={
                            element?.is_tracked || Boolean(element?.slug)
                              ? "contained"
                              : "outlined"
                          }
                        >
                          {loadingId === element.id ? (
                            <CircularProgress size={20} />
                          ) : element?.is_tracked ? (
                            "Tracked"
                          ) : (
                            "Track"
                          )}
                        </Button>
                      </CTableCell>

                      <CTableCell
                        className={clsx(cls.tBodyCell, cls.tBodyAction)}
                      >
                        <RectangleIconButton
                          id="delete_btn"
                          color="error"
                          size="small"
                          onClick={() => deleteMenuTable(element)}
                        >
                          <Delete color="error" />
                        </RectangleIconButton>
                      </CTableCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </TableCard>
          </div>
        </TabPanel>
        <TabPanel>
          <Box sx={{ height: "585px" }}>
            <ChartDb />
          </Box>
        </TabPanel>

        {/* <TabPanel>
          <Box sx={{height: "585px"}}>
            <ExternalDatabases />
          </Box>
        </TabPanel> */}
      </Tabs>
    </>
  );
};
