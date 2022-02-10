import FullScreenLoader from "../components/Skeleton"
import Loadable from "react-loadable"

const Dashboard = Loadable({
  loader: () => import("../views/dashboard/index"),
  loading: FullScreenLoader,
})
const Clients = Loadable({
  loader: () => import("../views/clients"),
  loading: FullScreenLoader,
})
const ClientsCreate = Loadable({
  loader: () => import("../views/clients/Create"),
  loading: FullScreenLoader,
})
const Profile = Loadable({
  loader: () => import("../views/profile"),
  loading: FullScreenLoader,
})
const Orders = Loadable({
  loader: () => import("../views/orders"),
  loading: FullScreenLoader,
})
const OrderForm = Loadable({
  loader: () => import("../views/orders/form"),
  loading: FullScreenLoader,
})

const ShipperSettings = Loadable({
  loader: () => import("../views/settings/ShipperSettings"),
  loading: FullScreenLoader,
})

const ShipperBranches = Loadable({
  loader: () => import("../views/settings/branches/index"),
  loading: FullScreenLoader,
})
const ShipperBranchesForm = Loadable({
  loader: () => import("../views/settings/branches/form/index.jsx"),
  loading: FullScreenLoader,
})
const ShipperSettingsCreate = Loadable({
  loader: () => import("../views/settings/ShipperSettings/Create"),
  loading: FullScreenLoader,
})
const Stocks = Loadable({
  loader: () => import("../views/marketing/stocks"),
  loading: FullScreenLoader,
})

const StockCreate = Loadable({
  loader: () => import("../views/marketing/stocks/form"),
  loading: FullScreenLoader,
})

const Banners = Loadable({
  loader: () => import("../views/marketing/banners"),
  loading: FullScreenLoader,
})
const BannerFrom = Loadable({
  loader: () => import("../views/marketing/banners/form"),
  loading: FullScreenLoader,
})
const Reviews = Loadable({
  loader: () => import("../views/marketing/reviews"),
  loading: FullScreenLoader,
})
const Newsletter = Loadable({
  loader: () => import("../views/marketing/newsletter"),
  loading: FullScreenLoader,
})
const NewsletterCreate = Loadable({
  loader: () => import("../views/marketing/newsletter/form"),
  loading: FullScreenLoader,
})
const Menu = Loadable({
  loader: () => import("../views/menu"),
  loading: FullScreenLoader,
})
const MenuItems = Loadable({
  loader: () => import("../views/menu/menuItems"),
  loading: FullScreenLoader,
})
const ProductCreate = Loadable({
  loader: () => import("../views/menu/productCreate"),
  loading: FullScreenLoader,
})
const CategoryCreate = Loadable({
  loader: () => import("../views/menu/categoryCreate/index"),
  loading: FullScreenLoader,
})
const News = Loadable({
  loader: () => import("../views/catalog/news"),
  loading: FullScreenLoader,
})
const NewsCreate = Loadable({
  loader: () => import("../views/catalog/news/form"),
  loading: FullScreenLoader,
})
const CompanyCategory = Loadable({
  loader: () => import("../views/catalog/company_category"),
  loading: FullScreenLoader,
})
const CompanyCategoryCreate = Loadable({
  loader: () => import("../views/catalog/company_category/form"),
  loading: FullScreenLoader,
})
const Banner = Loadable({
  loader: () => import("../views/catalog/banner"),
  loading: FullScreenLoader,
})
const BannerCreate = Loadable({
  loader: () => import("../views/catalog/banner/form"),
  loading: FullScreenLoader,
})
const Courier = Loadable({
  loader: () => import("../views/personal/courier"),
  loading: FullScreenLoader,
})
const CourierCreate = Loadable({
  loader: () => import("../views/personal/courier/form"),
  loading: FullScreenLoader,
})
const Operator = Loadable({
  loader: () => import("../views/personal/operator"),
  loading: FullScreenLoader,
})
const OperatorCreate = Loadable({
  loader: () => import("../views/personal/operator/form"),
  loading: FullScreenLoader,
})
const ReportsCourier = Loadable({
  loader: () => import("../views/reports/courier/index"),
  loading: FullScreenLoader,
})

const ReportsBranch = Loadable({
  loader: () => import("../views/reports/branch/index"),
  loading: FullScreenLoader,
})

const ReportsUser = Loadable({
  loader: () => import("../views/reports/users/index"),
  loading: FullScreenLoader,
})

const CourierType = Loadable({
  loader: () => import("../views/personal/courierType"),
  loading: FullScreenLoader,
})
const CourierTypeCreate = Loadable({
  loader: () => import("../views/personal/courierType/form"),
  loading: FullScreenLoader,
})
const Fares = Loadable({
  loader: () => import("../views/settings/rates"),
  loading: FullScreenLoader,
})
const TariffCreate = Loadable({
  loader: () => import("../views/settings/rates/form"),
  loading: FullScreenLoader,
})
const GeoFence = Loadable({
  loader: () => import("../views/settings/geofence"),
  loading: FullScreenLoader,
})
const GeoFenceCreate = Loadable({
  loader: () => import("../views/settings/geofence/form"),
  loading: FullScreenLoader,
})
const BranchUser = Loadable({
  loader: () => import("../views/shipperCompany/branchUsers"),
  loading: FullScreenLoader,
})
const BranchUserCreate = Loadable({
  loader: () => import("../views/shipperCompany/branchUsers/form"),
  loading: FullScreenLoader,
})
const Settlement = Loadable({
  loader: () => import("../views/shipperCompany/settlements"),
  loading: FullScreenLoader,
})
const SettlementCreate = Loadable({
  loader: () => import("../views/shipperCompany/settlements/form"),
  loading: FullScreenLoader,
})

const ShipperBranchesUsersForm = Loadable({
  loader: () => import("../views/settings/branches/form/users/form"),
  loading: FullScreenLoader,
})

export default [
  {
    component: Dashboard,
    path: "/dashboard",
    exact: true,
    title: "Dashboard",
    permission: "dashboard",
  },
  {
    component: Clients,
    path: "/personal/clients",
    exact: true,
    title: "clients",
    permission: "clients",
  },
  {
    component: ClientsCreate,
    path: "/personal/clients/create",
    exact: true,
    title: "client-create",
    permission: "clients",
  },
  {
    component: ClientsCreate,
    path: "/personal/clients/:id",
    exact: true,
    title: "client-edit",
    permission: "clients",
  },

  {
    component: CourierType,
    path: "/courier/courier-type",
    exact: true,
    title: "CourierType",
    permission: "courier_type",
  },
  {
    component: CourierTypeCreate,
    path: "/courier/courier-type/create",
    exact: true,
    title: "CourierTypeCreate",
    permission: "courier_type",
  },
  {
    component: CourierTypeCreate,
    path: "/courier/courier-type/:id",
    exact: true,
    title: "CourierTypeEdit",
    permission: "courier_type",
  },
  {
    component: Profile,
    path: "/profile",
    exact: true,
    title: "Profile",
    permission: "profile",
  },
  {
    component: Orders,
    path: "/orders",
    exact: true,
    title: "orders",
    permission: "orders",
  },
  {
    component: OrderForm,
    path: "/orders/create",
    exact: true,
    title: "orderCreate",
    permission: "orders",
  },
  {
    component: OrderForm,
    path: "/orders/:id",
    exact: true,
    title: "orderCreate",
    permission: "orders",
  },
  {
    component: Menu,
    path: "/company/shipper-company/menu",
    exact: true,
    title: "menu",
    permission: "menu",
  },
  {
    component: MenuItems,
    path: "/company/shipper-company/menu/:shipper_id/:menu_id",
    exact: true,
    title: "menu",
    permission: "menu",
  },
  {
    component: CategoryCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/category/create",
    exact: true,
    title: "categoryCreate",
    permission: "menu",
  },
  {
    component: CategoryCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/category/:id",
    exact: true,
    title: "categoryEdit",
    permission: "menu",
  },
  {
    component: ProductCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/product/create",
    exact: true,
    title: "productCreate",
    permission: "menu",
  },
  {
    component: ProductCreate,
    path: "/company/shipper-company/:shipper_id/menu/:menu_id/product/:id",
    exact: true,
    title: "productEdit",
    permission: "menu",
  },
  {
    component: ShipperSettings,
    path: "/company/shipper-company",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  // Shipper branch crud
  {
    component: ShipperBranches,
    path: "/company/shipper-company/:id/branches",
    exact: true,
    title: "shipperCompanyBranches",
    permission: "settings",
  },
  {
    component: ShipperBranches,
    path: "/company/shipper-company/:id/branches",
    exact: true,
    title: "shipperCompanyBranches",
    permission: "settings",
  },

  {
    component: ShipperBranchesForm,
    path: "/company/shipper-company/:id/branches/create",
    exact: true,
    title: "shipperCompanyBranchesCreate",
    permission: "settings",
  },

  {
    component: ShipperBranchesForm,
    path: "/company/shipper-company/:id/branches/:branch_id",
    exact: true,
    title: "shipperCompanyBranchesEdit",
    permission: "settings",
  },
  {
    component: ShipperBranchesUsersForm,
    path: "/company/shipper-company/:id/branches/:branch_id/users/:user_id",
    exact: true,
    title: "shipperCompanyBranchesUserUpdate",
    permission: "settings",
  },
  {
    component: ShipperSettingsCreate,
    path: "/company/shipper-company/create",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: ShipperSettingsCreate,
    path: "/company/shipper-company/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: Stocks,
    path: "/marketing/stocks",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: StockCreate,
    path: "/marketing/stocks/create",
    exact: true,
    title: "StockCreate",
    permission: "settings",
  },
  {
    component: StockCreate,
    path: "/marketing/stocks/create/:id",
    exact: true,
    title: "StockUpdate",
    permission: "settings",
  },
  {
    component: Banner,
    path: "/marketing/banners",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: BannerCreate,
    path: "/marketing/banners/create",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: BannerCreate,
    path: "/marketing/banners/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: Reviews,
    path: "/marketing/reviews",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: Newsletter,
    path: "/marketing/newsletter",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: NewsletterCreate,
    path: "/marketing/newsletter/create",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: NewsletterCreate,
    path: "/marketing/newsletter/:id",
    exact: true,
    title: "ShipperSettings",
    permission: "settings",
  },
  {
    component: News,
    path: "/marketing/news",
    exact: true,
    title: "News",
    permission: "news",
  },
  {
    component: NewsCreate,
    path: "/marketing/news/create",
    exact: true,
    title: "NewsCreate",
    permission: "news",
  },
  {
    component: ReportsCourier,
    path: "/reports/courier",
    exact: true,
    title: "Reports",
    permission: "news",
  },
  {
    component: ReportsBranch,
    path: "/reports/restaurants",
    exact: true,
    title: "Reports",
    permission: "news",
  },
  {
    component: ReportsUser,
    path: "/reports/users",
    exact: true,
    title: "Reports",
    permission: "news",
  },
  {
    component: ReportsCourier,
    path: "/reports/cities",
    exact: true,
    title: "Reports",
    permission: "news",
  },
  {
    component: NewsCreate,
    path: "/marketing/news/:id",
    exact: true,
    title: "NewsEdit",
    permission: "news",
  },
  {
    component: CompanyCategory,
    path: "/marketing/company_category",
    exact: true,
    title: "CompanyCategories",
    permission: "company_category",
  },
  {
    component: CompanyCategoryCreate,
    path: "/marketing/company_category/create",
    exact: true,
    title: "CompanyCategoriesCreate",
    permission: "company_category",
  },
  {
    component: CompanyCategoryCreate,
    path: "/marketing/company_category/:id",
    exact: true,
    title: "CompanyCategoriesEdit",
    permission: "company_category",
  },
  {
    component: Banner,
    path: "/catalog/banner",
    exact: true,
    title: "Banner",
    permission: "banner",
  },
  {
    component: BannerCreate,
    path: "/catalog/banner/create",
    exact: true,
    title: "BannerCreate",
    permission: "banner",
  },
  {
    component: BannerCreate,
    path: "/catalog/banner/:id",
    exact: true,
    title: "BannerEdit",
    permission: "banner",
  },
  {
    component: Courier,
    path: "/courier/list",
    exact: true,
    title: "Courier",
    permission: "courier",
  },
  {
    component: CourierCreate,
    path: "/courier/list/create",
    exact: true,
    title: "CourierCreate",
    permission: "courier",
  },
  {
    component: CourierCreate,
    path: "/courier/list/:id",
    exact: true,
    title: "CourierEdit",
    permission: "courier",
  },
  {
    component: Operator,
    path: "/operator",
    exact: true,
    title: "Operator",
    permission: "operator",
  },
  {
    component: OperatorCreate,
    path: "/operator/create",
    exact: true,
    title: "OperatorCreate",
    permission: "operator",
  },
  {
    component: OperatorCreate,
    path: "/operator/:id",
    exact: true,
    title: "OperatorEdit",
    permission: "operator",
  },
  {
    component: CourierType,
    path: "/personal/courier_type",
    exact: true,
    title: "CourierType",
    permission: "courier_type",
  },
  {
    component: CourierTypeCreate,
    path: "/personal/courier_type/create",
    exact: true,
    title: "CourierTypeCreate",
    permission: "courier_type",
  },
  {
    component: CourierTypeCreate,
    path: "/personal/courier_type/:id",
    exact: true,
    title: "CourierTypeEdit",
    permission: "courier_type",
  },
  {
    component: Fares,
    path: "/settings/fares",
    exact: true,
    title: "Fares",
    permission: "fares",
  },
  {
    component: TariffCreate,
    path: "/settings/fares/create",
    exact: true,
    title: "Fares.Create",
    permission: "fares",
  },
  {
    component: TariffCreate,
    path: "/settings/fares/:id",
    exact: true,
    title: "Fares.Edit",
    permission: "fares",
  },
  {
    component: GeoFence,
    path: "/settings/geofence",
    exact: true,
    title: "Geofence",
    permission: "geofence",
  },
  {
    component: GeoFenceCreate,
    path: "/settings/geofence/create",
    exact: true,
    title: "GeofenceCreate",
    permission: "geofence",
  },
  {
    component: GeoFenceCreate,
    path: "/settings/geofence/:geozone_id/:region_id",
    exact: true,
    title: "GeofenceUpdate",
    permission: "geofence",
  },
  {
    component: BranchUser,
    path: "/company/users",
    exact: true,
    title: "BranchUsers",
    permission: "branch_users",
  },
  {
    component: BranchUserCreate,
    path: "/company/users/create/:shipper_id",
    exact: true,
    title: "BranchUserCreate",
    permission: "branch_users",
  },
  {
    component: BranchUserCreate,
    path: "/company/users/:shipper_id/:user_id",
    exact: true,
    title: "BranchUserUpdate",
    permission: "branch_users",
  },
  {
    component: Settlement,
    path: "/company/settlements",
    exact: true,
    title: "Settlements",
    permission: "settlements",
  },
  {
    component: SettlementCreate,
    path: "/company/settlements/create/:shipper_id",
    exact: true,
    title: "SettlementsCreate",
    permission: "settlements",
  },
].map((route) => ({
  ...route,
  path: `/home${route.path}`,
  id: Math.random() + new Date().getTime(),
}))
