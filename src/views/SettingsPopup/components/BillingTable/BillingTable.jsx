import { format } from "date-fns";
import { numberWithSpaces } from "../../../../utils/formatNumbers";
import { 
  Done,
  HourglassTop,
  Block as BlockIcon,
  BackupTable as BackupTableIcon
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
import { useBillingTableProps } from "./useBillingTableProps";

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

export const BillingTable = () => {

  const { transactions, project, isLoading } = useBillingTableProps();

  return <Box sx={{mt: 4}}>
  <Typography variant="h6" sx={{mb: 2}}>
    Transactions
  </Typography>
  <TableContainer
    component={Paper}
    sx={{
      borderRadius: 1,
      borderTop: "1px solid #eee",
      // borderBottom: "1px solid #eee",
      height: "calc(100vh - 280px)",
    }}>
    <Table sx={{position: "relative"}} stickyHeader>
      <TableHead>
        <TableRow>
          {tableHeads?.map((item) => (
            <TableHeadCell>{item}</TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {
          isLoading ? (
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
                  "&:nth-of-type(odd)": {backgroundColor: "#f9f9f9"},
                }}>
                <TableCell sx={{fontSize: "14px"}}>
                  {format(new Date(row.created_at), "dd.MM.yyyy HH:mm")}
                </TableCell>
                <TableCell sx={{fontSize: "14px"}}>
                  {project?.title}
                </TableCell>
                <TableCell sx={{fontSize: "14px"}}>
                  {row.fare?.name ?? ""}
                </TableCell>
                <TableCell sx={{fontSize: "14px"}}>
                  {row.payment_type ?? ""}
                </TableCell>
                <TableCell sx={{fontSize: "14px"}}>
                  {row.transaction_type ?? ""}
                </TableCell>
                <TableCell sx={{fontSize: "14px"}}>
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
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                fontSize: "16px",
              }}>
              No transactions are found.
              <Box sx={{marginTop: "12px"}}>
                <BackupTableIcon
                  style={{width: "40px", height: "30px"}}
                />
              </Box>
            </Box>
          )
        }
        
      </TableBody>
    </Table>
  </TableContainer>
</Box>
}

const TableHeadCell = ({children, props}) => {
  return (
    <TableCell sx={{fontWeight: "bold", fontSize: "14px", boxShadow: "none !important"}} {...props}>
      {children}
    </TableCell>
  );
};

const TableSkeleton = () => {
  return <TableRow>
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
    <TableCell sx={{textAlign: "center", padding: "0", paddingRight: "0 !important"}}>
      <Skeleton height="53px" />
    </TableCell>
  </TableRow>
}