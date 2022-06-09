import { useSelector } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import KeepAliveWrapper from "../components/KeepAliveWrapper"
import ReloadWrapper from "../components/ReloadWrapper"
import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import Login from "../views/Auth/Login"
import Registration from "../views/Auth/Registration"
import ConstructorTablesListPage from "../views/Constructor/Tables"
import ConstructorTablesFormPage from "../views/Constructor/Tables/Form"
import ObjectsPage from "../views/Objects"
import ObjectsFormPage from "../views/Objects/ObjectsFormPage"

const Router = () => {
  const isAuth = useSelector((state) => state.auth.isAuthorizated)

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
        <Route path="settings/constructor/tables/:id/:slug" element={<ConstructorTablesFormPage />} />

        
        
        <Route path="object/:tableSlug" element={<ReloadWrapper component={ObjectsPage} />} />
       
        {/* <Route path="object/:tableSlug/create" element={<ObjectsFormPage />} />
        <Route path="object/:tableSlug/:id" element={<ReloadWrapper component={ObjectsFormPage} />} /> */}


        <Route path="object/:tableSlug/create/:formId" element={<KeepAliveWrapper><ObjectsFormPage /></KeepAliveWrapper>} />
        <Route path="object/:tableSlug/:id" element={<KeepAliveWrapper><ObjectsFormPage /></KeepAliveWrapper>} />



        <Route path="*" element={<Navigate to="/settings/constructor/tables" />} />
      </Route>
      <Route path="*" element={<Navigate to="/settings/constructor/tables" />} />
    </Routes>
  )
}

export default Router
