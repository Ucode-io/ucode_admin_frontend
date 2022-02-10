import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Form from "../../components/Form/Form"
import FormItem from "../../components/Form/FormItem"
import FullScreenLoader from "../../components/FullScreenLoader"
import Header from "../../components/Header"
import CustomButton from "../../components/Buttons"
import Card from "../../components/Card"
import Button from "../../components/Button"

import "./style.scss"
import { useSelector } from "react-redux"
import Input from "../../components/Input"
import axios from "../../utils/axios"
import { useHistory } from "react-router"
import ChangePasswordAlert from "../../components/Alert/ChangePasswordAlert"
import { useDispatch } from "react-redux"
import { setUserVerified } from "../../redux/actions/authActions"
import moment from "moment"
import { showAlert } from "../../redux/reducers/alertReducer"
import RequiredStar from "../../components/RequiredStar"

const Profile = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()

  const username = useSelector((state) => state.auth.username)

  const [loader, setLoader] = useState(true)
  const [buttonLoader, setButtonLoader] = useState(false)
  const [passwordFieldDisabled, setPasswordFieldDisabled] = useState(true)
  const [userData, setUserData] = useState({})
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)

  const rule = {
    required: true,
    message: t("required.field.error"),
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = () => {
    axios
      .get("/staff-by-token")
      .then((res) => {
        res.status = res.role.status
        res.passport_issue_date = moment(res.passport_issue_date).format(
          "YYYY-MM-DD"
        )
        setUserData(res)
      })
      .finally(() => setLoader(false))
  }

  const onSubmit = (data) => {
    setButtonLoader(true)
    data.password = ""
    data.role_id = data.role.id
    data.organization_id = data.organization.id
    delete data.undefined
    saveChanges(data)
  }

  const changePassword = (data) => {
    if (!oldPassword || !newPassword) return setPasswordError(true)

    setButtonLoader(true)
    axios
      .post("/update-password", {
        old_password: oldPassword,
        new_password: newPassword,
      })
      .then((res) => {
        dispatch(setUserVerified(true))
        setPasswordFieldDisabled(true)
        setOldPassword("")
        setNewPassword("")
      })
      .catch((err) => {
        if (err?.status === 409)
          dispatch(showAlert("Avvalgi parol noto'g'ri kiritilgan"))
      })
      .finally(() => setButtonLoader(false))
  }

  const saveChanges = (data) => {
    axios
      .put(`/staff/${data.id}`, data)
      .then((res) => {
        history.push("/home/dashboard")
      })
      .finally(() => setButtonLoader(false))
  }

  if (loader) return <FullScreenLoader />

  return (
    <div className="Profile">
      <Form onSubmit={onSubmit} initialValues={userData}>
        <Header
          title={t("personal.cabinet")}
          endAdornment={
            passwordFieldDisabled
              ? [
                  <CustomButton
                    type="submit"
                    size="large"
                    shape="text"
                    color="text-primary-600"
                  >
                    {t("save")}
                  </CustomButton>,
                ]
              : []
          }
          loading={buttonLoader}
        ></Header>
        <div
          className="p-4 w-full box-border font-body"
          style={{ fontSize: "14px", lineHeight: "24px" }}
        >
          <div>
            <Card style={{ width: "720px" }} className="mb-5">
              <div className="flex profile-block">
                <div className="profile-photo">
                  <h1>{username[0].toUpperCase()}</h1>
                </div>
                <div className="line" />
                <div className="block w-full">
                  {/* -------------------LOGIN----------------------- */}
                  <div className="w-full flex items-center mb-5">
                    <div className="label input-label w-1/3">{t("login")}</div>
                    <div className="field w-2/3">
                      <Input disabled value={username} />
                    </div>
                  </div>

                  {passwordFieldDisabled ? (
                    <div className="w-full flex items-baseline">
                      <div className="label input-label">{t("password")}</div>
                      <div className="field">
                        <Button
                          className="mb-5"
                          color="primary"
                          onClick={() => setPasswordFieldDisabled(false)}
                        >
                          Parolni o'zgartirish
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* -------------------OLD PASSWORD-------------------- */}

                      <div className="w-full flex mb-4">
                        <div className="label w-1/3">{t("old.password")}</div>
                        <div className="field w-2/3">
                          <Input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            error={!oldPassword && passwordError}
                          />
                        </div>
                      </div>

                      {/* -------------------NEW PASSWORD-------------------- */}

                      <div className="w-full flex mb-4 items-baseline">
                        <div className="label input-label">
                          {t("new.password")}
                        </div>
                        <div className="field">
                          <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            error={!newPassword && passwordError}
                          />
                        </div>
                      </div>

                      <div className="w-full flex justify-end">
                        <Button
                          className="mb-5"
                          color="primary"
                          onClick={changePassword}
                          loading={buttonLoader}
                        >
                          Saqlash
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            <div style={{ width: "720px" }}>
              <Card title={t("service.info")}>
                {/* -------------------ORGANIZATION----------------- */}
                <div className="w-full flex items-baseline">
                  <div className="w-1/3 input-label">{t("organization")}</div>
                  <div className="w-2/3">
                    <FormItem>
                      <Input disabled value={userData?.organization?.name} />
                    </FormItem>
                  </div>
                </div>

                {/* -------------------ROLE----------------- */}
                <div className="w-full flex items-baseline">
                  <div className="w-1/3 input-label">{t("role")}</div>
                  <div className="w-2/3">
                    <FormItem>
                      <Input disabled value={userData?.role?.name} />
                    </FormItem>
                  </div>
                </div>

                {/* -------------------CITY----------------- */}
                <div className="w-full flex items-baseline">
                  <div className="w-1/3 input-label">{t("region.area")}</div>
                  <div className="w-2/3">
                    <FormItem>
                      <Input disabled value={userData?.city?.name ?? "---"} />
                    </FormItem>
                  </div>
                </div>

                {/* -------------------REGION----------------- */}
                <div className="w-full flex items-baseline">
                  <div className="w-1/3 input-label">{t("region")}</div>
                  <div className="w-2/3">
                    <FormItem>
                      <Input disabled value={userData?.region?.name ?? "---"} />
                    </FormItem>
                  </div>
                </div>
              </Card>

              <Card title={t("personal.info")} className="mt-5">
                {/* ---------FIRST_NAME--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("first.name")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="first_name" rule={rule}>
                        <Input id="first_name" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------LAST_NAME--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("last.name")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="last_name" rule={rule}>
                        <Input id="last_name" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------MIDDLE_NAME--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("middle.name")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="middle_name" rule={rule}>
                        <Input id="middle_name" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------INN--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("inn")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="inn" rule={rule}>
                        <Input type="number" id="inn" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------PINFL--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("PINFL")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="pinfl" rule={rule}>
                        <Input id="pinfl" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------PASSPORT--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">
                        {t("passport.series.and.number")}
                      </span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="passport_number" rule={rule}>
                        <Input id="passport_number" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------DATE OF ISSUE--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("date.of.issue")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="passport_issue_date" rule={rule}>
                        <Input type="date" id="passport_issue_date" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------PLACE OF ISSUE--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("place.of.issue")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="passport_issue_place" rule={rule}>
                        <Input id="passport_issue_place" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------TEL NUMBER--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("phone.number")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="phone_number" rule={rule}>
                        <Input id="phone_number" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------EMAIL--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("email")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="email" rule={rule}>
                        <Input id="email" />
                      </FormItem>
                    </div>
                  </div>
                </div>

                {/* ---------ADDRESS--------- */}
                <div>
                  <div className="w-full flex items-baseline">
                    <div className="w-1/3 flex items-center">
                      <RequiredStar />
                      <span className="input-label">{t("address")}</span>
                    </div>
                    <div className="w-2/3">
                      <FormItem name="address" rule={rule}>
                        <Input id="address" />
                      </FormItem>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default Profile
