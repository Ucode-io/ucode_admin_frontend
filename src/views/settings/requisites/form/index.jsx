import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { useTheme } from "@material-ui/core/styles";
import RequisitesCreate from "./RequisitesCreate";
import { useFormik } from "formik";
import * as yup from "yup";
import { postRequisites, updateRequisite } from "services/requisites";


export default function BranchCreate() {
  

  // ====== variables ====== //
  const { t } = useTranslation();
  const history = useHistory();
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0)
  const params = useParams()

// =========  formik  =========== //

const initialValues = {
  account: "",
  account_name: "",
  account_number: "",
  accountant: "",
  address: "",
  code: "",
  code_nds: "",
  code_okpo: "",
  comments: "",
  company_id: "",
  contact: "",
  director: "",
  inn: "",
  mfo: "",
  name: "",
  oked: "",
  region: "",
  type_operation: "",
};

  // =========  POST and UPDATE Requisite  =========== //

const onSubmit = (values) => {
  values.inn = values.inn.toString()
  if(params.id === undefined){
    postRequisites(values)
    .then((res) => {
      if(res.status === 'CREATED'){
        history.goBack()
      }
    })
    .catch((err) => console.log('ERROR post requisite => ', err))
  }else{
    updateRequisite({...values})
    .then((res) => {
      console.log("UPDATE Requisite => ", res)
      if(res.status === 'OK'){
        history.goBack()
      }
    })
  }
}

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: yup.object({
      name: yup.string().required(t("required.field.error")),
      inn: yup.string().length(10, "Должно быть 10 цифр")
    })
  })


  // =========  routing  =========== //

  const routes = [
    {
      title: t(`Добавить реквизиты`),
      link: true,
      route: `/home/settings/branch`,
    },
  ];

  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button
      icon={SaveIcon}
      size="large"
      type="submit"
      loading={saveLoading}
    >
      {t("save")}
    </Button>,
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={headerButtons}
        />
        <RequisitesCreate formik={formik} />
      </>
    </form>
  );
}