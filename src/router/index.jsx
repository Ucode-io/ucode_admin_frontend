import { useSelector } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import Login from "../views/Auth/Login"
import Registration from "../views/Auth/Registration"
import ConstructorTablesListPage from "../views/Constructor/Tables"
import ConstructorTablesFormPage from "../views/Constructor/Tables/Form"
import ObjectsPage from "../views/Objects"
import ObjectsFormPage from "../views/Objects/ObjectsFormPage"

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
        <Route index element={<Navigate to="/settings/constructor/tables" />} />
        
        <Route path="settings/constructor/tables" element={<ConstructorTablesListPage />} />
        <Route path="settings/constructor/tables/create" element={<ConstructorTablesFormPage />} />
        <Route path="settings/constructor/tables/:id" element={<ConstructorTablesFormPage />} />

        
        <Route path="object/:tableSlug" element={<ObjectsPage />} />
        <Route path="object/:tableSlug/create" element={<ObjectsFormPage />} />
        <Route path="object/:tableSlug/:id" element={<ObjectsFormPage />} />



        <Route path="*" element={<Navigate to="/settings/constructor/tables" />} />
      </Route>
      <Route path="*" element={<Navigate to="/settings/constructor/tables" />} />
    </Routes>
  )
}

export default Router
