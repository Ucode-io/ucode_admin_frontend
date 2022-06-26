import { Card } from "@mui/material";



const TableCard = ({ children, disablePagination=false }) => {
  return ( <div style={{ padding: '16px' }}>
    <Card style={{ padding: disablePagination ? '16px': "16px 16px 10px 16px" }} >
      {children}
    </Card>
  </div> );
}
 
export default TableCard;