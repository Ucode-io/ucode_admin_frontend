import { AccountCircle, Lock } from "@mui/icons-material"
import { InputAdornment } from "@mui/material"
import { useMemo } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { useDispatch } from "react-redux"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import HFSelect from "../../../components/FormElements/HFSelect"
import HFTextField from "../../../components/FormElements/HFTextField"
import authService from "../../../services/auth/authService"
import clientTypeServiceV2 from "../../../services/auth/clientTypeServiceV2"
import { loginAction } from "../../../store/auth/auth.thunk"
import listToOptions from "../../../utils/listToOptions"
import classes from "../style.module.scss"

const LoginForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [companies, setCompanies] = useState([])
  const [clientTypes, setClientTypes] = useState([])

  const [formType, setFormType] = useState("LOGIN")
  const { control, handleSubmit, watch } = useForm()


  const selectedCompanyID = watch('company_id')
  const selectedProjectID = watch('project_id')

  const computedCompanies = useMemo(() => {
    return listToOptions(companies, "name")
  }, [companies])


  const computedProjects = useMemo(() => {
    const company = companies.find(company => company.id === selectedCompanyID)
    return listToOptions(company?.projects, "name")
  }, [companies, selectedCompanyID])

  
  // const computedClientTypes = useMemo(() => {
  //   return listToOptions(clientTypes?.filter(el => el.project_id === selectedProjectID), "name", "name")
  // }, [selectedProjectID, clientTypes])


  const { data: computedClientTypes = [] } = useQuery(["GET_CLIENT_TYPE_LIST", {project_id: selectedProjectID}], () => {
    return clientTypeServiceV2.getList({project_id: selectedProjectID})
  }, {
    enabled: !!selectedProjectID,
    select: (res => res.data.response?.map(row => ({
      label: row.name,
      value: row.guid,
    })))
  })

  const multiCompanyLogin = (data) => {
    setLoading(true)

    authService
      .multiCompanyLogin(data)
      .then((res) => {
        setLoading(false)

        setClientTypes(res.client_types)
        setCompanies(res.companies)
        setFormType("MULTI_COMPANY")
      })
      .catch(() => setLoading(false))
  }

  const login = () => {
    
  }

  const onSubmit = (values) => {
    if (formType === "LOGIN") multiCompanyLogin(values)
    else dispatch(loginAction(values))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Tabs direction={"ltr"}>
        {formType === "LOGIN" ? (
          <div style={{ padding: "0 20px" }}>
            <TabList>
              <Tab>{t("login")}</Tab>
              <Tab>{t("phone")}</Tab>
              <Tab>{t("E-mail")}</Tab>
            </TabList>

            <div
              className={classes.formArea}
              style={{ marginTop: "10px", height: `calc(100vh - 370px)` }}
            >
              <TabPanel>
                <div className={classes.formRow}>
                  <p className={classes.label}>{t("login")}</p>
                  <HFTextField
                    required
                    control={control}
                    name="username"
                    size="large"
                    fullWidth
                    placeholder={t("enter.login")}
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle style={{ fontSize: "30px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className={classes.formRow}>
                  <p className={classes.label}>{t("password")}</p>
                  <HFTextField
                    required
                    control={control}
                    name="password"
                    type="password"
                    size="large"
                    fullWidth
                    placeholder={t("enter.password")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock style={{ fontSize: "30px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </TabPanel>
            </div>
          </div>
        ) : (
          <div style={{ padding: "0 20px" }}>
            <div
              className={classes.formArea}
              style={{ marginTop: "10px", height: `calc(100vh - 350px)` }}
            >
              <div className={classes.formRow}>
                <p className={classes.label}>{t("company")}</p>
                <HFSelect
                  required
                  control={control}
                  name="company_id"
                  size="large"
                  placeholder={t("enter.company")}
                  options={computedCompanies}
                />
              </div>
              <div className={classes.formRow}>
                <p className={classes.label}>{t("project")}</p>
                <HFSelect
                  required
                  control={control}
                  name="project_id"
                  size="large"
                  placeholder={t("enter.project")}
                  options={computedProjects}
                />
              </div>
              <div className={classes.formRow}>
                <p className={classes.label}>{t("client_type")}</p>
                <HFSelect
                  required
                  control={control}
                  name="client_type"
                  size="large"
                  placeholder={t("enter.client_type")}
                  options={computedClientTypes}
                />
              </div>
            </div>
          </div>
        )}
      </Tabs>
      <div className={classes.buttonsArea}>
        <PrimaryButton size="large" loader={loading}>
          {t("enter")}
        </PrimaryButton>
      </div>
    </form>
  )
}

export default LoginForm
