import { format } from "date-fns";
import { numberWithSpaces } from "../../../../utils/formatNumbers";
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

const tableHeads = ["Project", "Amount", "Type", "Date"];

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
          mb: 2,
          fontWeight: 600,
          color: "#000",
        }}
      >
        Transactions
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 1,
          minHeight: "calc(100vh - 650px)",
          marginBottom: "15px",
        }}
        className="scrollbarNone"
      >
        <Table
          sx={{
            position: "relative",
            borderTop: "0px",
            border: "1px solid #dbe0e4",
            borderRadius: "8px",
          }}
          stickyHeader
        >
          <TableHead>
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
                    "& .MuiTableCell-root": {
                      borderBottom: "1px solid #EAECF0",
                      background: isOdd(index + 1) ? "#F9FAFB" : "#fff",
                      ":first-of-type": {
                        paddingLeft: "15px",
                      },
                      ":last-of-type": {
                        paddingRight: "15px",
                      },
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: "14px", padding: "12px 8px" }}>
                    {project?.title}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px", padding: "12px 8px" }}>
                    {numberWithSpaces(row.amount)} {row.currency?.code || "UZS"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px", padding: "12px 8px" }}>
                    <Box
                      sx={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        fontSize: "13px",
                        fontWeight: 500,
                        backgroundColor:
                          row.transaction_type?.toLowerCase() === "subscription"
                            ? "#d1fae5"
                            : "#dbeafe",
                        color:
                          row.transaction_type?.toLowerCase() === "subscription"
                            ? "#059669"
                            : "#2563eb",
                      }}
                    >
                      {row.transaction_type || "Top up"}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px", padding: "12px 8px" }}>
                    {format(new Date(row.created_at), "dd.MM.yyyy, HH:mm")}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "150px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  fontSize: "16px",
                  border: "2px solid #dbe0e4",
                  borderTop: "0px",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                }}
              >
                No transactions are found.
                <Box sx={{ marginTop: "12px" }}>
                  <BackupTableIcon style={{ width: "40px", height: "30px" }} />
                </Box>
              </Box>
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
        background: "#fff",
        border: "none",
        borderBottom: "1px solid #dbe0e4",
        "&:last-of-type": {
          paddingRight: "15px",
          borderRadius: "0",
          borderTopRightRadius: "8px",
        },
        "&:first-of-type": {
          paddingLeft: "15px",
          borderRadius: "0",
          borderTopLeftRadius: "8px",
        },
        fontWeight: "bold",
        fontSize: "14px",
        boxShadow: "none !important",
        padding: "8px",
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
      <TableCell
        sx={{
          textAlign: "center",
          padding: "0",
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Skeleton height="53px" />
      </TableCell>
      <TableCell
        sx={{
          textAlign: "center",
          padding: "0",
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Skeleton height="53px" />
      </TableCell>
      <TableCell
        sx={{
          textAlign: "center",
          padding: "0",
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Skeleton height="53px" />
      </TableCell>
      <TableCell
        sx={{
          textAlign: "center",
          padding: "0",
          paddingRight: "0 !important",
          borderBottom: "1px solid #EAECF0",
        }}
      >
        <Skeleton height="53px" />
      </TableCell>
    </TableRow>
  );
};
