import cls from "./styles.module.scss";
import {format} from "date-fns";
import {numberWithSpaces} from "../../../../utils/formatNumbers";
import {
  Done,
  HourglassTop,
  Block as BlockIcon,
  BackupTable as BackupTableIcon,
} from "@mui/icons-material";
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
import {useBillingTableProps} from "./useBillingTableProps";
import {Button} from "../Button";
import {AddIcon} from "@chakra-ui/icons";

const tableHeads = [
  "Date",
  "Project",
  "Fare",
  "Payment Type",
  "Type",
  "Status",
  "Currency",
  "Amount",
];

export const BillingTable = ({handClickBalance}) => {
  const {transactions, project, isLoading} = useBillingTableProps();

  return (
    <Box sx={{mt: 2}}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        Transactions
        <Button className={cls.btn} onClick={handClickBalance} primary>
          <Box display="flex" alignItems="center" gap="4px">
            <AddIcon />
            <span>Top Up</span>
          </Box>
        </Button>
      </Typography>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 1,
          maxHeight: "calc(100vh - 450px)",
          minHeight: `calc(100vh - ${transactions?.length ? "700px" : "450px"})`,
          border: "1px solid #dbe0e4",
          marginBottom: "15px",
        }}
        className="scrollbarNone">
        <Table
          sx={{
            position: "relative",
            borderTop: "0px",
            borderRadius: "8px",
          }}
          stickyHeader>
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
                      ":first-of-type": {
                        paddingLeft: "15px",
                      },
                      ":last-of-type": {
                        paddingRight: "15px",
                      },
                    },
                    // "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  }}>
                  <TableCell sx={{fontSize: "14px", padding: "8px"}}>
                    {format(new Date(row.created_at), "dd.MM.yyyy HH:mm")}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px", padding: "8px"}}>
                    {project?.title}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px", padding: "8px"}}>
                    {row.fare?.name ?? ""}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px", padding: "8px"}}>
                    {row.payment_type ?? ""}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px", padding: "8px"}}>
                    {row.transaction_type ?? ""}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px", padding: "8px"}}>
                    {row.payment_status === "accepted" ? (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "success.main",
                          fontSize: "14px",
                        }}>
                        <Done /> Paid
                      </Typography>
                    ) : row?.payment_status === "cancelled" ? (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "red",
                          fontSize: "16px",
                        }}>
                        <BlockIcon /> Cancelled
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "warning.main",
                          fontSize: "14px",
                        }}>
                        <HourglassTop /> Pending
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px"}}>
                    {row?.currency?.code}
                  </TableCell>
                  <TableCell sx={{fontSize: "14px"}}>
                    {numberWithSpaces(row.amount)}
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
                }}>
                No transactions are found.
                <Box sx={{marginTop: "12px"}}>
                  <BackupTableIcon style={{width: "40px", height: "30px"}} />
                </Box>
              </Box>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const TableHeadCell = ({children, ...props}) => {
  return (
    <TableCell
      sx={{
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
      {...props}>
      {children}
    </TableCell>
  );
};

const TableSkeleton = () => {
  return (
    <TableRow>
      <TableCell sx={{textAlign: "center", padding: "0"}}>
        <Skeleton height="53px" />
      </TableCell>
      <TableCell sx={{textAlign: "center", padding: "0"}}>
        <Skeleton height="53px" />
      </TableCell>
      <TableCell sx={{textAlign: "center", padding: "0"}}>
        <Skeleton height="53px" />
      </TableCell>
      <TableCell sx={{textAlign: "center", padding: "0"}}>
        <Skeleton height="53px" />
      </TableCell>
      <TableCell sx={{textAlign: "center", padding: "0"}}>
        <Skeleton height="53px" />
      </TableCell>
      <TableCell sx={{textAlign: "center", padding: "0"}}>
        <Skeleton height="53px" />
      </TableCell>
      <TableCell sx={{textAlign: "center", padding: "0"}}>
        <Skeleton height="53px" />
      </TableCell>
      <TableCell
        sx={{textAlign: "center", padding: "0", paddingRight: "0 !important"}}>
        <Skeleton height="53px" />
      </TableCell>
    </TableRow>
  );
};
