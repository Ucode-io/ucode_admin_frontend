import ReloadRelations from "@/components/ReloadRelations";
import {lazy, Suspense, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Chat from "../components/Chat";
import KeepAliveWrapper from "../components/KeepAliveWrapper";
import Template from "../components/LayoutSidebar/Components/Documents/Components/Template";
import Note from "../components/LayoutSidebar/Components/Documents/Note";
import EmailPage from "../components/LayoutSidebar/Components/Email";
import EmailDetailPage from "../components/LayoutSidebar/Components/Email/EmailDetailPage";
import FunctionsDetail from "../components/LayoutSidebar/Components/Functions/FunctionsDetail";
import MicroservicePage from "../components/LayoutSidebar/Components/MicroService";
import NotificationPage from "../components/LayoutSidebar/Components/Notification";
import NotificationForm from "../components/LayoutSidebar/Components/Notification/NotificationForm";
import ProjectSettingPage from "../components/LayoutSidebar/Components/Project";
import Queries from "../components/LayoutSidebar/Components/Query";
import Scenarios from "../components/LayoutSidebar/Components/Scenario";
import PageFallback from "../components/PageFallback";
import ReloadPage from "../components/ReloadComponent/index";
import ReloadWrapper from "../components/ReloadWrapper";
import AnalyticsLayout from "../layouts/AnalyticsLayout";
import CashboxLayout from "../layouts/CashboxLayout";
import MainLayout from "../layouts/MainLayout";
import SettingsLayout from "../layouts/SettingsLayout";
import DashboardList from "../views/Analytics/Dashboard";
import DashboardCreatePage from "../views/Analytics/Dashboard/DashboardCreatePage";
import DashboardSettings from "../views/Analytics/Dashboard/DashboardSettings";
import DashboardMainInfo from "../views/Analytics/Dashboard/DashboardSettings/DashboardMainInfo";
import VariableCreateForm from "../views/Analytics/Dashboard/DashboardSettings/VariableCreateForm";
import Variables from "../views/Analytics/Dashboard/DashboardSettings/Variables";
import DashboardDetailPage from "../views/Analytics/Dashboard/Detail";
import PanelCreateForm from "../views/Analytics/Dashboard/Detail/PanelForm";
import ApiKeysForm from "../views/ApiKeys/ApiKeysForm.jsx";
import ApiKeyPage from "../views/ApiKeys/index.jsx";
import Login from "../views/Auth/Login";
import Registration from "../views/Auth/Registration";
import CashboxAppointments from "../views/Cashbox/Appointments";
import AppointmentsForm from "../views/Cashbox/Appointments/Form";
import CashboxClosing from "../views/Cashbox/Closing";
import CashboxOpening from "../views/Cashbox/Opening";
import CompanyPage from "../views/Company";
import CompanyForm from "../views/Company/CompanyFormPage";
import AppsPage from "../views/Constructor/Apps";
import AppsForm from "../views/Constructor/Apps/AppsForm";
import MicrofrontendPage from "../views/Constructor/Microfrontend";
import MicrofrontendForm from "../views/Constructor/Microfrontend/MicrofrontendForm";
import ConstructorTablesFormPage from "../views/Constructor/Tables/Form";
import DatabasePage from "../views/DataBase";
import DatabaseConfiguration from "../views/DataBase/Configuration";
import EnvironmentPage from "../views/Environments";
import EnvironmentForm from "../views/Environments/EnvironmentFormPage";
import Connections from "../views/Matrix/Connections";
import Microfrontend from "../views/Microfrontend";
import MicrofrontendPlayground from "../views/MicrofrontendPlayground";
import ObjectsPage from "../views/Objects";
import ObjectsFormPage from "../views/Objects/ObjectsFormPage";
import PermissionDetail from "../views/Permissions";
import RoleDetail from "../views/Permissions/Roles/Detail";
import ProjectPage from "../views/Projects";
import ProjectForm from "../views/Projects/ProjectFormPage";
import RedirectPage from "../views/Redirect";
import RedirectFormPage from "../views/Redirect/RedirectFormPage";
import ResourceDetail from "../views/Resources/Detail";
import SmsPage from "../views/SmsOtp";
import SmsFormPage from "../views/SmsOtp/SmsFormPage";
import ReportSettings from "../views/Objects/PivotTable/ReportSettings";
import PivotTableView from "../views/Objects/PivotTableView";
import ClientUserForm from "../views/Users/UserFormPage";
import ClientUserPage from "../views/Users/UserPage";
import WebPage from "../views/WebPage";
import ApiEndpoint from "../components/LayoutSidebar/Components/Api";
import ApiEndpointDetail from "../components/LayoutSidebar/Components/Api/Components/ApiEndpointDetail";
import Invite from "../views/Auth/Invite";
import UsersList from "../views/Users/UsersList";
import VariableResources from "../components/LayoutSidebar/Components/Resources/VariableResource";
import VariableResourceForm from "../components/LayoutSidebar/Components/Resources/VariableResourceForm";
import TablesPage from "../views/Constructor/AllTables";
import MinioPage from "../components/LayoutSidebar/Components/Minio";
import MinioSinglePage from "../components/LayoutSidebar/Components/Minio/components/MinioSinglePage";

const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const AuthMatrix = lazy(() => import("../views/AuthMatrix"));
const ClientPlatform = lazy(() => import("../views/AuthMatrix/ClientPlatform"));
const ClientType = lazy(() => import("../views/AuthMatrix/ClientType"));
const CrossedPage = lazy(() => import("../views/AuthMatrix/Crossed"));
const RolesForm = lazy(() => import("../views/AuthMatrix/Crossed/Roles/Form"));
const Profile = lazy(() => import("../views/AuthMatrix/Crossed/Profile/index"));

const IntegrationsForm = lazy(() =>
  import("../views/AuthMatrix/Crossed/Integrations/Form")
);
const SessionsPage = lazy(() =>
  import("../views/AuthMatrix/Crossed/Integrations/Sessions")
);
const UsersForm = lazy(() => import("../views/Users/Form"));
const UsersPage = lazy(() => import("../views/Users/index"));
const MatrixPage = lazy(() => import("../views/Matrix"));
const MatrixDetail = lazy(() => import("../views/Matrix/MatrixDetail"));
const MatrixRolePage = lazy(() => import("../views/Matrix/MatrixRolePage"));

const Router = () => {
  const location = useLocation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const auth = useSelector((state) => state.auth);
  const companyDefaultLink = useSelector((state) => state.company?.defaultPage);
  const applications = useSelector((state) => state.application.list);
  const cashbox = useSelector((state) => state.cashbox.data);
  const [favicon, setFavicon] = useState("");
  const cashboxIsOpen = cashbox.is_open === "Открыто";

  const parts = auth?.clientType?.default_page
    ? auth?.clientType?.default_page?.split("/")
    : companyDefaultLink.split("/");

  const result =
    parts?.length && `/${parts[3]}/${parts[4]}/${parts[5]}/${parts[6]}`;

  const redirectLink = useMemo(() => {
    // if (location.pathname.includes("settings"))
    //   return "/settings/constructor/apps";
    // if (location.pathname.includes("cashbox")) return "/cashbox/appointments";
    // if (!applications.length || !applications[0].permission?.read)
    //   return "/settings/constructor/apps";
    // return "/settings/constructor/apps";
    return (
      auth?.clientType?.default_page?.length
        ? auth?.clientType?.default_page?.length
        : companyDefaultLink
    )
      ? result
      : `/main/c57eedc3-a954-4262-a0af-376c65b5a284`;
  }, [location.pathname, applications, result, companyDefaultLink]);
  console.log("partsparts", parts, redirectLink);
  if (!isAuth)
    return (
      <Suspense fallback={<p> Loading...</p>}>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Navigate to="/login " />} />
            <Route path="login" element={<Login />} />
            <Route path="invite-user" element={<Invite />} />
            <Route path="registration" element={<Registration />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    );

  return (
    <Routes>
      {/* <Route path="remote" element={<Suspense fallback="Loading..." > <SafeComponent><FileSystemModule /></SafeComponent></Suspense>} /> */}

      <Route
        path="/main"
        element={<MainLayout favicon={favicon} setFavicon={setFavicon} />}
      >
        <Route
          path=":appId/users-list"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersList />
            </Suspense>
          }
        />
        {console.log("redirectLink", redirectLink)}
        <Route index element={<Navigate to={redirectLink} />} />

        <Route path=":appId" element={<div></div>} />

        <Route path=":appId/chat" element={<Chat />}>
          <Route path=":chat_id" element={<Chat />} />
        </Route>
        <Route path=":appId/backet/:minioId">
          <Route index element={<MinioPage />} />
          <Route path=":fileId" element={<MinioSinglePage />} />
        </Route>
        <Route path=":appId/projects">
          <Route index element={<ProjectPage />} />
          <Route path="create" element={<ProjectForm />} />
          <Route path=":projectId" element={<ProjectForm />} />
        </Route>
        <Route path=":appId/redirects">
          <Route index element={<RedirectPage />} />
          <Route path="create" element={<RedirectFormPage />} />
          <Route path=":redirectId" element={<RedirectFormPage />} />
        </Route>
        <Route path=":appId/sms-otp">
          <Route index element={<SmsPage />} />
          <Route path="create" element={<SmsFormPage />} />
          <Route path=":redirectId" element={<SmsFormPage />} />
        </Route>
        <Route path=":appId/api-key">
          <Route index element={<ApiKeyPage />} />
          <Route path="create" element={<ApiKeysForm />} />
          <Route path=":apiKeyId" element={<ApiKeysForm />} />
        </Route>
        <Route path=":appId/environments">
          <Route index element={<EnvironmentPage />} />
          <Route path="create" element={<EnvironmentForm />} />
          <Route path=":envId" element={<EnvironmentForm />} />
        </Route>
        <Route path=":appId/company">
          <Route index element={<CompanyPage />} />
          <Route path=":companyId" element={<CompanyForm />} />
        </Route>

        <Route
          path=":appId/microfrontend-playground"
          element={<MicrofrontendPlayground />}
        />

        <Route
          path=":appId/page/:microfrontendId"
          element={<Microfrontend />}
        />

        <Route path=":appId/web-page/:webPageId" element={<WebPage />} />
        <Route
          path=":appId/report-setting/:reportSettingsId"
          element={<ReportSettings />}
        />
        <Route
          path=":appId/pivot-template/:pivotTemplateId"
          element={<PivotTableView />}
        />

        <Route path=":appId/user-page/:userMenuId">
          <Route index element={<ClientUserPage />} />
          <Route path="create" element={<ClientUserForm />} />
          <Route path=":userId" element={<ClientUserForm />} />
        </Route>

        <Route path=":appId/permission/:clientId">
          <Route index element={<PermissionDetail />} />
          <Route path="role/:roleId" element={<RoleDetail />} />
        </Route>

        {/* <Route path="constructor/microfrontend">
          <Route index element={<MicrofrontendPage />} />
          <Route path="create" element={<MicrofrontendForm />} />
          <Route path=":microfrontendId" element={<MicrofrontendForm />} />
        </Route> */}

        <Route path=":appId/microfrontend">
          <Route index element={<MicrofrontendPage />} />
          <Route path="create" element={<MicrofrontendForm />} />
          <Route path=":microfrontendId" element={<MicrofrontendForm />} />
        </Route>

        <Route path=":appId/tables">
          <Route index element={<TablesPage />} />
          <Route path="create" element={<MicrofrontendForm />} />
          {/* <Route path=":microfrontendId" element={<MicrofrontendForm />} /> */}
        </Route>

        <Route path="resources">
          <Route path="create" element={<ResourceDetail />} />
          <Route path=":resourceId" element={<ResourceDetail />} />

          <Route path="elt">
            <Route path="connections">
              <Route index element={<Connections />} />
              {/* <Route path="create" element={<ConnectionCreate />} /> */}
              {/* <Route path=":connectionId" element={<ConnectionDetail />} /> */}
            </Route>
            {/* <Route path="sources">
                <Route index element={<Sources />} />
                <Route path="create" element={<SourceDetail />} />
                <Route path=":sourceId" element={<SourceDetail />} />
              </Route>
              <Route path="destinations">
                <Route index element={<Destinations />} />
                <Route path="create" element={<DestinationDetail />} />
                <Route path=":destinationId" element={<DestinationDetail />} />
              </Route> */}
          </Route>
        </Route>

        <Route path=":appId/database/:resourceId/:tableSlug/:databaseId">
          <Route index element={<DatabasePage />} />
          <Route path="configuration" element={<DatabaseConfiguration />} />
        </Route>
        <Route path=":appId/scenario/:categoryId">
          <Route index element={<Scenarios />} />
          <Route path=":scenarioId" element={<Scenarios />} />
        </Route>
        <Route path=":appId/micro-service">
          <Route index element={<MicroservicePage />} />
        </Route>
        <Route path=":appId/email-setting">
          <Route index element={<EmailPage />} />
          <Route path="create" element={<EmailDetailPage />} />
          <Route path=":emailId" element={<EmailDetailPage />} />
        </Route>
        <Route path=":appId/project-setting">
          <Route index element={<ProjectSettingPage />} />
        </Route>
        <Route path=":appId/function">
          <Route path=":functionId" element={<FunctionsDetail />} />
        </Route>
        <Route path=":appId/notification/:categoryId">
          <Route index element={<NotificationPage />} />
          <Route path="create" element={<NotificationForm />} />
          <Route path=":notificationId" element={<NotificationForm />} />
        </Route>
        <Route path=":appId/queries">
          <Route path=":queryId" element={<Queries />} />
          <Route path="create" element={<Queries />} />
        </Route>
        <Route path=":appId/api-endpoints">
          <Route path=":categoryId">
            <Route path="create" element={<ApiEndpoint />} />
            <Route path=":endpointId">
              <Route index element={<ApiEndpoint />} />
              <Route path="preview" element={<ApiEndpointDetail />} />
            </Route>
          </Route>
        </Route>
        <Route path=":appId/variable-resources">
          <Route index element={<VariableResources />} />
          <Route path="create" element={<VariableResourceForm />} />
          <Route path=":apiKeyId" element={<VariableResourceForm />} />
        </Route>

        <Route path=":appId/docs">
          <Route path="note/:folderId">
            <Route path="create" element={<Note />} />
            <Route path=":noteId" element={<Note />} />
          </Route>
          <Route path="template/:folderId">
            <Route path="create" element={<Template />} />
            <Route path=":templateId" element={<Template />} />
          </Route>
        </Route>

        <Route
          path=":appId/object/:tableSlug"
          element={<ReloadWrapper component={ObjectsPage} />}
        />

        <Route
          path=":appId/object/:tableSlug/create/:formId"
          element={
            <KeepAliveWrapper>
              <ObjectsFormPage />
            </KeepAliveWrapper>
          }
        />
        <Route
          path=":appId/object/:tableSlug/:id"
          element={
            <KeepAliveWrapper>
              <ObjectsFormPage />
            </KeepAliveWrapper>
          }
        />

        <Route path="*" element={<Navigate to={redirectLink} />} />
      </Route>

      {/* ---------SETTINGS APP---------------- */}

      <Route path="settings" element={<SettingsLayout favicon={favicon} />}>
        <Route index element={<Navigate to={"/settings/constructor/apps"} />} />
        <Route path="constructor/apps" element={<AppsPage />} />
        <Route path="constructor/apps/create" element={<AppsForm />} />
        <Route path="constructor/apps/:appId" element={<AppsForm />} />
        {/* 
        <Route path="constructor/microfrontend">
          <Route index element={<MicrofrontendPage />} />
          <Route path="create" element={<MicrofrontendForm />} />
          <Route path=":microfrontendId" element={<MicrofrontendForm />} />
        </Route> */}

        <Route path="constructor/tables">
          <Route index element={<TablesPage />} />
          {/* <Route path="create" element={<MicrofrontendForm />} />
          <Route path=":microfrontendId" element={<MicrofrontendForm />} /> */}
        </Route>

        {/* <Route path="constructor/objects" element={<ConstructorTablesListPage />} /> */}
        <Route
          path="constructor/apps/:appId/objects/create"
          element={<ConstructorTablesFormPage />}
        />
        <Route
          path="constructor/tables/create"
          element={<ConstructorTablesFormPage />}
        />
        <Route
          path="constructor/apps/:appId/objects/:id/:slug"
          element={<ConstructorTablesFormPage />}
        />
        <Route
          path="constructor/tables/:id/:slug"
          element={<ConstructorTablesFormPage />}
        />
        <Route
          path="auth/users"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersPage />
            </Suspense>
          }
        />
        <Route
          path="auth/users/create"
          element={
            <Suspense fallback={<PageFallback />}>
              {/* <UsersForm /> */}
            </Suspense>
          }
        />
        <Route
          path="auth/users/:userId"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersForm />
            </Suspense>
          }
        />

        {/* -------------AUTH MATRIX------------ */}

        <Route
          path="auth/matrix/profile/crossed"
          element={
            <Suspense fallback={<PageFallback />}>
              <Profile />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId"
          element={
            <Suspense fallback={<PageFallback />}>
              <AuthMatrix />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/platform/:platformId"
          element={
            <Suspense fallback={<PageFallback />}>
              <ClientPlatform />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/client-type/:typeId"
          element={
            <Suspense fallback={<PageFallback />}>
              <ClientType />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed"
          element={
            <Suspense fallback={<PageFallback />}>
              <CrossedPage />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/user/create"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/user/:userId"
          element={
            <Suspense fallback={<PageFallback />}>
              <UsersForm />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/role/create"
          element={
            <Suspense fallback={<PageFallback />}>
              <RolesForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/role/:roleId"
          element={
            <Suspense fallback={<PageFallback />}>
              <RolesForm />
            </Suspense>
          }
        />

        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/integration/create"
          element={
            <Suspense fallback={<PageFallback />}>
              <IntegrationsForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId"
          element={
            <Suspense fallback={<PageFallback />}>
              <IntegrationsForm />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix/:projectId/:platformId/:typeId/crossed/integration/:integrationId/sessions"
          element={
            <Suspense fallback={<PageFallback />}>
              <SessionsPage />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix_v2"
          element={
            <Suspense fallback={<PageFallback />}>
              <MatrixPage />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix_v2/:typeId/:platformId"
          element={
            <Suspense fallback={<PageFallback />}>
              <MatrixDetail />
            </Suspense>
          }
        />
        <Route
          path="auth/matrix_v2/role/:roleId/:typeId"
          element={
            <Suspense fallback={<PageFallback />}>
              <MatrixRolePage />
            </Suspense>
          }
        />
      </Route>

      {/* ---------ANALYTICS APP---------------- */}

      <Route path="analytics" element={<AnalyticsLayout />}>
        <Route index element={<Navigate to={"/analytics/dashboard"} />} />

        <Route path="dashboard" element={<DashboardList />} />

        <Route
          path="dashboard/create/:formId"
          element={
            <KeepAliveWrapper>
              <DashboardCreatePage />
            </KeepAliveWrapper>
          }
        />
        <Route path="dashboard/:id" element={<DashboardDetailPage />} />

        <Route path="dashboard/:id/panel">
          <Route path=":panelId" element={<PanelCreateForm />} />
          <Route path="create" element={<PanelCreateForm />} />
        </Route>

        <Route path="dashboard/:id/settings" element={<DashboardSettings />}>
          <Route path="main" element={<DashboardMainInfo />} />
          <Route path="variables" element={<Variables />} />
          <Route path="variables/create" element={<VariableCreateForm />} />
          <Route
            path="variables/:variableId"
            element={<VariableCreateForm />}
          />
        </Route>

        <Route path="*" element={<Navigate to={"/analytics/dashboard"} />} />
      </Route>

      <Route path="/cashbox" element={<CashboxLayout />}>
        <Route
          index
          element={
            <Navigate
              to={!cashboxIsOpen ? "/cashbox/opening" : "/cashbox/appointments"}
            />
          }
        />

        {cashboxIsOpen ? (
          <>
            <Route path="closing" element={<CashboxClosing />} />

            <Route path="appointments" element={<CashboxAppointments />} />
            <Route
              path="appointments/:type/:id"
              element={
                <KeepAliveWrapper>
                  <AppointmentsForm />
                </KeepAliveWrapper>
              }
            />
          </>
        ) : (
          <Route path="opening" element={<CashboxOpening />} />
        )}

        <Route
          path="*"
          element={
            <Navigate
              to={!cashboxIsOpen ? "/cashbox/opening" : "/cashbox/appointments"}
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to={redirectLink} />} />
      <Route path="reload" element={<ReloadPage />} />
      <Route path="reloadRelations" element={<ReloadRelations />} />
    </Routes>
  );
};

export default Router;
