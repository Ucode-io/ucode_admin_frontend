import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export const FaresTable = ({ isLoading, columns = [], headData }) => {

  return <Table sx={{ position: "relative" }}>
      <TableHead>
        <TableRow>
          <TableHeadCell styles={{textAlign: "left"}}>Name</TableHeadCell>
          {
            columns?.map((item, index) => {
              return <TableHeadCell key={item?.id}>
                {item?.name}
              </TableHeadCell>
            })
          }
        </TableRow>
      </TableHead>
    <TableBody>
      {
        headData?.map((item, index) => {
          return <TableRow
            key={index}
          >
            <TableCell sx={{fontWeight: 500}}>
              {item?.name}
            </TableCell>

            {
              columns?.map(col => (
                <TableCell key={col?.id} sx={{textAlign: "center"}}>
                  {col?.fare_item_prices?.find(el => el?.fare_item_id === item?.id)?.value}
                </TableCell>
              ))
            }
           
          </TableRow>
        })
      }
    </TableBody>
  </Table>
}


const TableHeadCell = ({ children, styles, ...props }) => {
  return (
    <TableCell
      sx={{
        fontSize: "14px",
        padding: "8px",
        textAlign: "center",
        fontWeight: 500,
        border: "none",
        color: "rgb(15, 23, 40)",
        ...styles
      }}
      {...props}
    >
      {children}
    </TableCell>
  );
};
