import { lazy, Suspense } from "react"
import { useSelector } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import KeepAliveWrapper from "../components/KeepAliveWrapper"
import PageFallback from "../components/PageFallback"
import ReloadWrapper from "../components/ReloadWrapper"
import AuthLayout from "../layouts/AuthLayout"
import MainLayout from "../layouts/MainLayout"
import Login from "../views/Auth/Login"
import Registration from "../views/Auth/Registration"
import ConstructorTablesListPage from "../views/Constructor/Tables"
import ConstructorTablesFormPage from "../views/Constructor/Tables/Form"
import ObjectsPage from "../views/Objects"
import ObjectsFormPage from "../views/Objects/ObjectsFormPage"

const AuthMatrix = lazy(() => import( "../views/AuthMatrix"))
const ClientPlatform = lazy(() => import( "../views/AuthMatrix/ClientPlatform"))
const ClientType = lazy(() => import( "../views/AuthMatrix/ClientType"))
const CrossedPage = lazy(() => import( "../views/AuthMatrix/Crossed"))
const RolesForm = lazy(() => import( "../views/AuthMatrix/Crossed/Roles/Form"))
const IntegrationsForm = lazy(() => import( "../views/AuthMatrix/Crossed/Integrations/Form"))
const SessionsPage = lazy(() => import("../views/AuthMatrix/Crossed/Integrations/Sessions"))
const UsersForm = lazy(() => import("../views/Users/Form"))
const UsersPage = lazy(() => import("../views/Users/index"))

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
        <Route path="object/:tableSlug" element={<ReloadWrapper component={ObjectsPage} />} />

        {/* <Route path="object/:tableSlug/create" element={<ObjectsFormPage />} />
        <Route path="object/:tableSlug/:id" element={<ReloadWrapper component={ObjectsFormPage} />} /> */}



        

        <Route path="object/:tableSlug/create/:formId" element={<KeepAliveWrapper><ObjectsFormPage /></KeepAliveWrapper>} />
        <Route path="object/:tableSlug/:id" element={<KeepAliveWrapper><ObjectsFormPage /></KeepAliveWrapper>} />
        
        
        
        <Route path="settings/constructor/tables" element={<ConstructorTablesListPage />} />
        <Route path="settings/constructor/tables/create" element={<ConstructorTablesFormPage />} />
        <Route path="settings/constructor/tables/:id/:slug" element={<ConstructorTablesFormPage />} />

        <Route path="settings/users" element={<Suspense fallback={<PageFallback />}><UsersPage /></Suspense>} />
        <Route path="settings/users/create" element={<Suspense fallback={<PageFallback />}><UsersForm /></Suspense>} />
        <Route path="settings/users/:userId" element={<Suspense fallback={<PageFallback />}><UsersForm /></Suspense>} />
        





        {/* -------------AUTH MATRIX------------ */}

        <Route path="settings/auth-matrix/:projectId" element={<Suspense fallback={<PageFallback />}><AuthMatrix /></Suspense>} />
        <Route path="settings/auth-matrix/:projectId/platform/:platformId" element={<Suspense fallback={<PageFallback />}><ClientPlatform /></Suspense>} />
        <Route path="settings/auth-matrix/:projectId/client-type/:typeId" element={<Suspense fallback={<PageFallback />}><ClientType /></Suspense>} />
        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed" element={<Suspense fallback={<PageFallback />}><CrossedPage /></Suspense>} />
       
        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed/user/create" element={<Suspense fallback={<PageFallback />}><UsersForm /></Suspense>} />
        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed/user/:userId" element={<Suspense fallback={<PageFallback />}><UsersForm /></Suspense>} />
       
       
        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed/role/create" element={<Suspense fallback={<PageFallback />}><RolesForm /></Suspense>} />
        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed/role/:roleId" element={<Suspense fallback={<PageFallback />}><RolesForm /></Suspense>} />

        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed/integration/create" element={<Suspense fallback={<PageFallback />}><IntegrationsForm /></Suspense>} />
        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId" element={<Suspense fallback={<PageFallback />}><IntegrationsForm /></Suspense>} />
        <Route path="settings/auth-matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId/sessions" element={<Suspense fallback={<PageFallback />}><SessionsPage /></Suspense>} />


        <Route path="*" element={<Navigate to="/settings/constructor/tables" />} />
      </Route>
      <Route path="*" element={<Navigate to="/settings/constructor/tables" />} />
    </Routes>
  )
}

export default Router
