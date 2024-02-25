import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import {Box, Button, Menu, TableCell, Typography} from "@mui/material";
import React, {useState} from "react";
import HistoryRow from "./HistoryRow";
import styles from "./styles.module.scss";
import TableCard from "../../../TableCard";
import {CTable, CTableBody, CTableHead, CTableHeadRow} from "../../../CTable";
import ClearIcon from "@mui/icons-material/Clear";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function HistoriesTable({
  histories,
  setSelectedEnvironment,
  selectedVersions,
  setSelectedVersions,
  setSelectedMigrate,
  handleClose,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectVersion = (e, index) => {
    if (e.target.checked) {
      const versionsUntilIndex = histories.slice(0, index + 1);
      setSelectedVersions(versionsUntilIndex);
    } else {
      const versionsUntilIndex = histories.slice(0, index);
      setSelectedVersions(versionsUntilIndex);
    }
  };

  const data = [
    {
      id: 1,
      name: "v2.0.0",
      descrpt: "Created by you on Oct 27",
    },
    {
      id: 2,
      name: "v3.0.0",
      descrpt: "Created by you on May 27",
    },
    {
      id: 3,
      name: "v4.0.0",
      descrpt: "Created by you on Sept 7",
    },
    {
      id: 4,
      name: "v4.0.0",
      descrpt: "Created by you on Sept 7",
    },
  ];
  return (
    <div style={{height: 400, width: "100%", overflow: "auto"}}>
      <div className={styles.header}>
        <Typography variant="h4">History</Typography>
        <ClearIcon
          color="primary"
          onClick={handleClose}
          width="46px"
          style={{
            cursor: "pointer",
          }}
        />
      </div>
      <Box sx={{position: "sticky", top: 0}}>
        <Button
          className={styles.button}
          onClick={() => setSelectedMigrate(null)}>
          <ArrowBackRoundedIcon />
        </Button>
      </Box>

      <Tabs>
        <TabList style={{paddingLeft: "15px", position: "sticky", top: "40px"}}>
          <Tab>Releases</Tab>
          <Tab>History</Tab>
        </TabList>

        <TabPanel>
          <Box
            sx={{
              padding: "20px 20px",
              lineHeight: "26px",
              fontSize: "13px",
              height: "250px",
              overflow: "auto",
            }}>
            <h2 style={{fontSize: "22px"}}>Releases</h2>
            <p style={{color: "#999", fontWeight: "600"}}>
              1 previously released versions
            </p>

            {data?.map((item) => (
              <Box
                key={item?.id}
                sx={{
                  lineHeight: "28px",
                  fontSize: "12px",
                  marginTop: "15px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "0 0px 0 0px",
                }}>
                <Box>
                  <Box sx={{display: "flex"}}>
                    <h2 style={{fontSize: "18px"}}>{item?.name}</h2>
                    <Box
                      sx={{
                        background: "rgba(161, 184, 161, 0.3)",
                        color: "green",
                        padding: "0 8px",
                        borderRadius: "5px",
                        height: "24px",
                        marginLeft: "10px",
                        fontWeight: "700",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                      }}>
                      Live
                    </Box>
                  </Box>
                  <p style={{color: "#999", fontWeight: "500"}}>
                    {item?.descrpt}
                  </p>
                </Box>
                <Button
                  onClick={handleClick}
                  sx={{width: "20px", height: "40px"}}>
                  <MoreHorizIcon />
                </Button>
              </Box>
            ))}
          </Box>
        </TabPanel>

        <TabPanel>
          <TableCard withBorder borderRadius="md">
            <CTable
              removableHeight={0}
              tableStyle={{
                height: "auto",
              }}
              disablePagination={true}>
              <CTableHead>
                <CTableHeadRow>
                  <TableCell width={40}>Action</TableCell>
                  <TableCell width={160}>Action Type</TableCell>
                  <TableCell>Action Source</TableCell>
                  <TableCell width={200}>Label</TableCell>
                  <TableCell width={130}>Action</TableCell>
                </CTableHeadRow>
              </CTableHead>
              <CTableBody
                style={{
                  overflow: "auto",
                }}
                dataLength={histories?.length}>
                {histories?.map((history, index) => (
                  <HistoryRow
                    history={history}
                    index={index}
                    handleSelectVersion={handleSelectVersion}
                    selectedVersions={selectedVersions}
                  />
                ))}
              </CTableBody>
            </CTable>
          </TableCard>
        </TabPanel>
      </Tabs>

      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <Box sx={{width: "200px"}}>
          <Box
            sx={{
              width: "100%",
              padding: "8px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
            onClick={handleCloseMenu}>
            Publish Release
          </Box>
          <Box
            sx={{
              width: "100%",
              padding: "8px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
            onClick={handleCloseMenu}>
            Revert to this version
          </Box>
        </Box>
      </Menu>
    </div>
  );
}
