import { TextField } from "@mui/material";
import TableCard from "../../../components/TableCard";


const CashboxOpening = () => {
  return ( <div>
    <TableCard>

      <table style={{ width: '100%' }} >

        <thead>
          <tr>
            <th>Тип</th>
            <th>План</th>
            <th></th>
            <th>Факт</th>
            <th></th>
            <th>Разница</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>CA</td>
            <td><TextField fullWidth size="small" /></td>
            <td>-</td>
            <td><TextField fullWidth size="small" /></td>
            <td>=</td>
            <td><TextField fullWidth size="small" /></td>
          </tr>

        </tbody>

      </table>

    </TableCard>
  </div> );
}
 
export default CashboxOpening;