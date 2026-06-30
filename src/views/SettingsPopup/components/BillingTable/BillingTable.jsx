import { format } from "date-fns";
import { numberWithSpaces } from "../../../../utils/formatNumbers";

const safeFormatDate = (value, pattern = "dd.MM.yyyy, HH:mm") => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return format(date, pattern);
};
import { BackupTable as BackupTableIcon } from "@mui/icons-material";
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useBillingTableProps } from "./useBillingTableProps";

const tableHeads = ["Project", "Amount", "Type", "Date", "Payment Status"];

export const BillingTable = () => {
  const { transactions, project, isLoading } = useBillingTableProps();

  function isOdd(number) {
    return number % 2 !== 0;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2.5,
          fontWeight: 600,
          color: "#1A202C",
          fontSize: "18px",
        }}
      >
        Transactions
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "8px",
          height: "calc(100vh - 400px)",
          marginBottom: "15px",
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
          border: "1px solid #E5E9EB",
          overflow: "auto",
        }}
        className="scrollbarNone"
      >
        <Table
          sx={{
            position: "relative",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
          stickyHeader
        >
          <TableHead borderBottom="1px solid #E5E9EB">
            <TableRow>
              {tableHeads?.map((item, index) => (
                <TableHeadCell key={index}>{item}</TableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <>
                <TableSkeleton />
                <TableSkeleton />
                <TableSkeleton />
              </>
            ) : Boolean(transactions?.length) ? (
              transactions?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#F8FAFC !important",
                      "& .MuiTableCell-root": {
                        backgroundColor: "transparent",
                      },
                    },
                    "& .MuiTableCell-root": {
                      borderBottom: "1px solid #EAECF0",
                      background:
                        row?.payment_status?.toLowerCase() === "cancelled"
                          ? "#FFF5F5"
                          : isOdd(index + 1)
                            ? "#FAFBFC"
                            : "#FFFFFF",
                      padding: "14px 16px",
                      fontSize: "14px",
                      color: "#1A202C",
                      "&:first-of-type": {
                        paddingLeft: "20px",
                      },
                      "&:last-of-type": {
                        paddingRight: "20px",
                      },
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      color: "#2D3748",
                    }}
                  >
                    {project?.title || "—"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1A202C",
                    }}
                  >
                    {numberWithSpaces(row.amount)} {row.currency?.code || "UZS"}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        backgroundColor:
                          row.transaction_type?.toLowerCase() === "subscription"
                            ? "#D1FAE5"
                            : "#DBEAFE",
                        color:
                          row.transaction_type?.toLowerCase() === "subscription"
                            ? "#065F46"
                            : "#1E40AF",
                        border: "none",
                      }}
                    >
                      {row.transaction_type || "Top up"}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#64748B",
                    }}
                  >
                    {safeFormatDate(row.created_at)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        backgroundColor:
                          row.payment_status?.toLowerCase() === "accepted"
                            ? "#D1FAE5"
                            : row.payment_status?.toLowerCase() === "cancelled"
                              ? "#FEE2E2"
                              : "#FEF3C7",
                        color:
                          row.payment_status?.toLowerCase() === "accepted"
                            ? "#065F46"
                            : row.payment_status?.toLowerCase() === "cancelled"
                              ? "#991B1B"
                              : "#92400E",
                        border: "none",
                      }}
                    >
                      {row.payment_status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    border: "none",
                    padding: "60px 20px",
                    textAlign: "center",
                    background: "#FFFFFF",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        backgroundColor: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 1,
                      }}
                    >
                      <BackupTableIcon
                        sx={{
                          fontSize: "32px",
                          color: "#94A3B8",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#475569",
                        marginTop: 1,
                      }}
                    >
                      No transactions found
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#94A3B8",
                        marginTop: -1,
                      }}
                    >
                      Your transaction history will appear here
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const TableHeadCell = ({ children, ...props }) => {
  return (
    <TableCell
      sx={{
        background: "#F8FAFC",
        border: "none",
        borderBottom: "2px solid #E5E9EB",
        "&:last-of-type": {
          paddingRight: "20px",
        },
        "&:first-of-type": {
          paddingLeft: "20px",
        },
        fontWeight: 500,
        fontSize: "14px",
        textTransform: "capitalize",
        letterSpacing: "0.5px",
        color: "#64748B",
        padding: "14px 16px",
        boxShadow: "none !important",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
      {...props}
    >
      {children}
    </TableCell>
  );
};

const TableSkeleton = () => {
  return (
    <TableRow>
      {[1, 2, 3, 4, 5].map((item) => (
        <TableCell
          key={item}
          sx={{
            padding: "14px 16px",
            borderBottom: "1px solid #EAECF0",
            "&:first-of-type": {
              paddingLeft: "20px",
            },
            "&:last-of-type": {
              paddingRight: "20px",
            },
          }}
        >
          <Skeleton
            height="20px"
            width="80%"
            sx={{
              borderRadius: "4px",
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};
