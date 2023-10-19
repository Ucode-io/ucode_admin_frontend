import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Drawer,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import ClearIcon from "@mui/icons-material/Clear";
import {useState} from "react";
import {useQueryLogById} from "../../../../../services/queryService";
import {useParams} from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import ReactJson from "react-json-view";

const tableStyles = {
  borderRadius: "0px",
  borderLeft: "none",
  borderBottomLeftRadius: "0px !important",
  borderBottom: "1px solid #ccc",
  background: "#fff",
  overflow: "hidden",
};

const QueryLogs = ({}) => {
  const {queryId} = useParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  console.log("selectedRow", selectedRow);
  const handleRowClick = (row) => {
    setIsDrawerOpen(true);
    setSelectedRow(row);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRow(null);
  };
  const rows = [
    {
      id: 1,
      request: "John Doe",
      response: 30,
      userData: {
        login: "login",
        email: "email",
        phone: "phone",
        name: "name",
      },
      duration: "Admin User",
    },
    {
      id: 2,
      request: "John Doe",
      response: 30,
      userData: {
        login: "login",
        email: "email",
        phone: "phone",
        name: "name",
      },
      duration: "Admin User",
    },
    {
      id: 3,
      request: "John Doe",
      response: 30,
      userData: {
        login: "login",
        email: "email",
        phone: "phone",
        name: "name",
      },
      duration: "Admin User",
    },
    {
      id: 4,
      request: "Jonathan Doe",
      response: 30,
      userData: {
        login: "login",
        email: "email",
        phone: "phone",
        name: "name",
      },
      duration: "Admin User",
    },
    {
      id: 5,
      request: "Lucy Doe",
      response: 30,
      userData: {
        login: "login",
        email: "email",
        phone: "phone",
        name: "name",
      },
      duration: "Admin User",
    },
    {
      id: 6,
      request: "Gearge Doe",
      response: 30,
      userData: {
        login: "login",
        email: "email",
        phone: "phone",
        name: "name",
      },
      duration: "Admin User",
    },
    {
      id: 7,
      request: "Benjamin Doe",
      response: 30,
      userData: {
        login: "login",
        email: "email",
        phone: "phone",
        name: "name",
      },
      duration: "Admin User",
    },
  ];

  const {data: logs} = useQueryLogById({
    id: queryId,
    queryParams: {
      cacheTime: false,
      onSuccess: (res) => {
        console.log("res", res);
      },
    },
  });

  function syntaxHighlight(json) {
    if (typeof json != "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json
      ?.replace(/&/g, "&amp;")
      ?.replace(/</g, "&lt;")
      ?.replace(/>/g, "&gt;");
    return json?.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = "number";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "key";
          } else {
            cls = "string";
          }
        } else if (/true|false/.test(match)) {
          cls = "boolean";
        } else if (/null/.test(match)) {
          cls = "null";
        }
        return '<span class="' + cls + '">' + match + "</span>";
      }
    );
  }

  return (
    <>
      <Box p="16px">
        <Box sx={{display: "flex", alignItems: "center"}}>
          <Box
            size="small"
            sx={{
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#eeee",
              marginRight: "10px",
            }}
          >
            <AccessTimeIcon />
          </Box>
          <Typography fontSize={"18px"} fontWeight="700" textAlign="end">
            Activity Feed
          </Typography>
        </Box>
        <Paper sx={{width: "100%", overflow: "hidden"}}>
          <TableContainer sx={{margin: "10px", maxHeight: 340}}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                    width={30}
                  >
                    Request
                  </TableCell>
                  <TableCell
                    width={100}
                    align="right"
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                  >
                    Response
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                    width={100}
                    align="right"
                  >
                    User Data
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableStyles,
                      fontSize: "14px",
                    }}
                    width={100}
                    align="right"
                  >
                    Duration
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs?.logs?.map((row) => (
                  <TableRow
                    sx={{cursor: "pointer"}}
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                  >
                    <TableCell
                      key={row.id}
                      align={row.align}
                      component="th"
                      scope="row"
                      sx={{
                        ...tableStyles,
                      }}
                    >
                      {row.request?.action_type}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...tableStyles,
                      }}
                      align="right"
                    >
                      {row.response?.length > 10
                        ? `${row?.response?.substring(0, 25)}...`
                        : row?.response}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...tableStyles,
                      }}
                      align="right"
                    >
                      {row.user_data?.login ??
                        row?.user_data?.email ??
                        row?.user_data?.phone ??
                        row?.user_data?.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...tableStyles,
                      }}
                      align="right"
                    >
                      {row?.duration} s
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer}>
        <Box p="16px" style={{width: 500}}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontSize={"24px"} fontWeight="600" textAlign="end">
              Activity Feed
            </Typography>
            <Button sx={{background: "none"}} onClick={handleCloseDrawer}>
              <ClearIcon
                sx={{width: "40px", fontSize: "24px", color: "#000"}}
              />
            </Button>
          </Box>
          <Box sx={{padding: "20px 0px 0 0"}}>
            <Typography fontSize={"16px"} fontWeight="600">
              Request:
            </Typography>
            <Box>
              {/* <CodeMirror
                style={{borderRadius: "10px", overflow: "hidden"}}
                value={JSON.stringify(selectedRow?.request, null, 2)}
                height="200px"
                width="100%"
                color="#00C387"
                theme={"dark"}
              /> */}

              <ReactJson
                src={selectedRow?.request}
                style={{
                  height: "250px",
                  overflow: "scroll",
                  borderRadius: "8px",
                }}
                theme="monokai"
                collapsed={false}
                enableClipboard={true}
              />
              {/* <Typography>{}</Typography> */}
            </Box>
          </Box>
          <Box sx={{padding: "20px 0px 0 0"}}>
            <Typography fontSize={"16px"} fontWeight="600">
              Response:
            </Typography>
            {selectedRow && (
              <Box>
                {/* <CodeMirror
                  style={{borderRadius: "10px", overflow: "hidden"}}
                  value={JSON.stringify(
                    JSON.parse(selectedRow?.response),
                    undefined,
                    2
                  )}
                  width="100%"
                  height="200px"
                  color="#00C387"
                  theme={"dark"}
                /> */}
                <ReactJson
                  src={JSON.parse(selectedRow?.response)}
                  style={{
                    height: "250px",
                    overflow: "scroll",
                    borderRadius: "8px",
                  }}
                  theme="monokai"
                  collapsed={false}
                  enableClipboard={true}
                />
              </Box>
            )}
          </Box>
          <Box sx={{padding: "20px 0px 0 0"}}>
            <Typography fontSize={"16px"} fontWeight="600">
              UserData:
            </Typography>
            {selectedRow && (
              <Box>
                <Typography fontSize={"15px"}>
                  {selectedRow.user_data?.login ??
                    selectedRow?.user_data?.email ??
                    selectedRow?.user_data?.phone}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{padding: "20px 0px 0 0"}}>
            <Typography fontSize={"16px"} fontWeight="600">
              Duration:
            </Typography>
            {selectedRow && (
              <Box>
                <Typography fontSize={"15px"}>
                  {selectedRow.duration} s
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default QueryLogs;
