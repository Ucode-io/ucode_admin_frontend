import { DragHandle, Payments, Remove } from "@mui/icons-material"
import { Divider } from "@mui/material"
import { useForm } from "react-hook-form"
import FRow from "../../../components/FormElements/FRow"
import HFTextField from "../../../components/FormElements/HFTextField"
import TableCard from "../../../components/TableCard"
import styles from "../Opening/style.module.scss"
import PaymeIcon from "../../../assets/icons/payme-icon.svg"
import CashIcon from "../../../assets/icons/cash-icon.svg"
import UzCardIcon from "../../../assets/icons/uzcard-icon.svg"
import HumoIcon from "../../../assets/icons/humo-icon.svg"
import ClickIcon from "../../../assets/icons/click-icon.svg"
import SVG from "react-inlinesvg"


const CashboxClosing = () => {
  const { control } = useForm()

  return (
    <div>
      <TableCard>
        <div className={styles.row}>
          <div className={styles.section}>
            <p className={styles.label}>Общая сумма</p>
            
            <div className={styles.value}>10 500 000</div>
          </div>

          <div className={styles.section}>
            <p className={styles.label}>Расход</p>

            <div className={styles.value}>-1 500 000</div>
          </div>
        </div>
      </TableCard>

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
                  <SVG src={ClickIcon} />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="1" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <Remove color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="2" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <DragHandle color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="3" fullWidth />
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.iconBlock}>
                <SVG src={UzCardIcon} />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="1" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <Remove color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="2" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <DragHandle color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="3" fullWidth />
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.iconBlock}>
                  <SVG src={HumoIcon} />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="1" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <Remove color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="2" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <DragHandle color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="3" fullWidth />
              </td>
            </tr>

            <tr>
              <td>
                <div className={styles.iconBlock}>
                  <SVG src={CashIcon} />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="1" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <Remove color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="2" fullWidth />
              </td>
              <td>
                <div className={styles.iconBlock}>
                  <DragHandle color="primary" />
                </div>
              </td>
              <td>
                <HFTextField control={control} name="3" fullWidth />
              </td>
            </tr>
          </tbody>
        </table>

        <Divider className={styles.divider} />

        <FRow label="Комментария">
          <HFTextField
            fullWidth
            control={control}
            name="4"
            multiline
            rows={4}
            placeholder="Enter a comment"
          />
        </FRow>
      </TableCard>
    </div>
  )
}

export default CashboxClosing
