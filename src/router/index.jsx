import { useSelector } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import Login from "../views/Auth/Login"
import Registration from "../views/Auth/Registration"
import ObjectsListPage from "../views/Constructor/Tables"
import ObjectsFormPage from "../views/Constructor/Tables/Form"

const Router = () => {
  const isAuth = useSelector((state) => state.auth.isAuth)

  if (!isAuth)
    return (
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login " />} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/constructor/tables" />} />
        <Route path="constructor/tables" element={<ObjectsListPage />} />
        <Route path="constructor/tables/create" element={<ObjectsFormPage />} />
        <Route path="constructor/tables/:id" element={<ObjectsFormPage />} />

        <Route path="*" element={<Navigate to="constructor/tables" />} />
      </Route>
      <Route path="*" element={<Navigate to="constructor/tables" />} />
    </Routes>
  )
}

export default Router
