import FormCard from "../../../../components/FormCard";
import style from "./style.module.scss"
import ReceiptBorder from "../../../../assets/images/receipt-border.png"
import Logo from "../../../../assets/images/medion-logo.svg"
import { Divider } from "@mui/material";

const AppointmentsForm = () => {
  return ( <div className={style.page} >

    <div className={style.content}>

      <FormCard title="Список услуг" maxWidth='auto' >

      </FormCard>

    </div>


    <div className={style.receipt} >
      <img src={ReceiptBorder} alt="border" className={style.border} />
      <img src={ReceiptBorder} alt="border" className={style.borderBottom} />
      

      <div className={style.logoBlock} >
        <img src={Logo} alt="logo" />
      </div>

      <Divider className={style.divider} />


      <div className={style.section} >
        <div className={style.row} >
          <b>Medion Clinics</b>
        </div>

        <div className={style.row} >
          <b>Дата: </b>05.04.2021 10:00:00
        </div>
      </div>

      <Divider className={style.divider} />

      <div className={style.section} >
        <div className={style.row} >
          <b>1. Рентген</b>
        </div>

        <div className={style.row} >
          <div>2 x 199 000</div>
          <div className={style.dashed} />
          <b>398 000</b>
        </div>

        <div className={style.row} >
          <div>в т.ч. НДС 15%</div>
          <div className={style.dashed} />
          <b>29 850</b>
        </div>
      </div>

    </div>

  </div> );
}
 
export default AppointmentsForm;