import { AccountCircle, Lock } from "@mui/icons-material"
import { InputAdornment } from "@mui/material"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import PrimaryButton from "../../../components/Buttons/PrimaryButton"
import HFTextField from "../../../components/FormElements/HFTextField"
import authService from "../../../services/auth/authService"
import classes from "../style.module.scss"

const LoginForm = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  
  const [formType, setFormType] = useState('LOGIN')

  const { control, handleSubmit } = useForm()
  

  const multiCompanyLogin = (data) => {

    setLoading(true)

    authService.multiCompanyLogin(data).then(res => {
      console.log("RES ==>", res)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  const login = () => {

  }



  const onSubmit = (values) => {

    if(formType === "LOGIN") multiCompanyLogin(values)


  }
  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      // onSubmit={isCodeSent ? verifySmsCode : handleSubmit(onSubmit)}
      className={classes.form}
    >
      <Tabs
        direction={"ltr"}
        // selectedIndex={selectedTab}
        // onSelect={setSelectedTab}
      >
        <div style={{ padding: "0 20px" }}>
          <TabList>
            <Tab>{t("login")}</Tab>
            <Tab>{t("phone")}</Tab>
            <Tab>{t("E-mail")}</Tab>
          </TabList>

          <div className={classes.formArea} style={{ marginTop: "10px", height: `calc(100vh - 370px)` }}>
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
      </Tabs>
      <div className={classes.buttonsArea}>
        <PrimaryButton size="large" loader={loading} >
          {t("enter")}
        </PrimaryButton>
      </div>
    </form>
  )
}

export default LoginForm
