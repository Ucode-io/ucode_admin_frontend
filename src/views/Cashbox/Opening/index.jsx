import { DragHandle, Payments, Remove } from "@mui/icons-material"
import { Divider } from "@mui/material"
import { useForm } from "react-hook-form"
import FRow from "../../../components/FormElements/FRow"
import HFTextField from "../../../components/FormElements/HFTextField"
import TableCard from "../../../components/TableCard"
import styles from "./style.module.scss"

const CashboxOpening = () => {
  const { control } = useForm()

  return (
    <div>
      <TableCard>
        <table className={styles.table}>
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
              <td>
                <div className={styles.iconBlock}>
                  <Payments color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="1" fullWidth  />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <Remove color="primary" />
                </div>
              </td>
              <td>
              <HFTextField control={control} name="2" fullWidth  />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <DragHandle color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="3" fullWidth  />
              </td>
            </tr>
          </tbody>
        </table>

        <Divider className={styles.divider} />

        <FRow label="Комментария" >
          <HFTextField fullWidth control={control} name="4" multiline rows={4} placeholder="Enter a comment" />
        </FRow>

      </TableCard>
    </div>
  )
}

export default CashboxOpening
