import FullScreenLoader from "components/Skeleton";
import Loadable from "react-loadable";

const Dashboard = Loadable({
  loader: () => import("views/dashboard/index"),
  loading: FullScreenLoader,
});
const Staffs = Loadable({
  loader: () => import("views/staffs"),
  loading: FullScreenLoader,
});
const StaffsCreate = Loadable({
  loader: () => import("views/staffs/Create"),
  loading: FullScreenLoader,
});
const Profile = Loadable({
  loader: () => import("views/profile"),
  loading: FullScreenLoader,
});
const Orders = Loadable({
  loader: () => import("views/orders"),
  loading: FullScreenLoader,
});
const OrderForm = Loadable({
  loader: () => import("views/orders/form"),
  loading: FullScreenLoader,
});

const ShipperSettings = Loadable({
  loader: () => import("views/settings/ShipperSettings"),
  loading: FullScreenLoader,
});

const User = Loadable({
  // loader: () => import("views/settings/branches/form/tabs/Users/index"),
  loading: FullScreenLoader,
});

const UserCreate = Loadable({
  loader: () => import("views/settings/branches/form/tabs/Users/form"),
  loading: FullScreenLoader,
});

// const ShipperBranches = Loadable({
//   loader: () => import("views/settings/branches/index"),
//   loading: FullScreenLoader,
// });
// const ShipperBranchesForm = Loadable({
//   loader: () => import("views/settings/branches/form/index.jsx"),
//   loading: FullScreenLoader,
// });
const ShipperSettingsCreate = Loadable({
  loader: () => import("views/settings/ShipperSettings/Create"),
  loading: FullScreenLoader,
});
const Stocks = Loadable({
  loader: () => import("views/marketing/stocks"),
  loading: FullScreenLoader,
});

const StockCreate = Loadable({
  loader: () => import("views/marketing/stocks/form"),
  loading: FullScreenLoader,
});

// const Banners = Loadable({
//   loader: () => import("views/marketing/banners"),
//   loading: FullScreenLoader,
// });
// const BannerFrom = Loadable({
//   loader: () => import("views/marketing/banners/form"),
//   loading: FullScreenLoader,
// });
const Reviews = Loadable({
  loader: () => import("views/marketing/reviews"),
  loading: FullScreenLoader,
});
const Newsletter = Loadable({
  loader: () => import("views/marketing/newsletter"),
  loading: FullScreenLoader,
});
const NewsletterCreate = Loadable({
  loader: () => import("views/marketing/newsletter/form"),
  loading: FullScreenLoader,
});
const Menu = Loadable({
  loader: () => import("views/menu"),
  loading: FullScreenLoader,
});
const MenuItems = Loadable({
  loader: () => import("views/menu/menuItems"),
  loading: FullScreenLoader,
});
const ProductCreate = Loadable({
  loader: () => import("views/menu/productCreate"),
  loading: FullScreenLoader,
});
// const CategoryCreate = Loadable({
//   loader: () => import("views/menu/categoryCreate/index"),
//   loading: FullScreenLoader,
// });
const News = Loadable({
  loader: () => import("views/catalog/news"),
  loading: FullScreenLoader,
});
const NewsCreate = Loadable({
  loader: () => import("views/catalog/news/form"),
  loading: FullScreenLoader,
});
const CompanyCategory = Loadable({
  loader: () => import("views/catalog/company_category"),
  loading: FullScreenLoader,
});
const CompanyCategoryCreate = Loadable({
  loader: () => import("views/catalog/company_category/form"),
  loading: FullScreenLoader,
});
const Banner = Loadable({
  loader: () => import("views/marketing/banners"),
  loading: FullScreenLoader,
});
const BannerCreate = Loadable({
  loader: () => import("views/marketing/banners/form"),
  loading: FullScreenLoader,
});
// const Courier = Loadable({
//   loader: () => import("views/personal/courier"),
//   loading: FullScreenLoader,
// });
// const CourierCreate = Loadable({
//   loader: () => import("views/personal/courier/form"),
//   loading: FullScreenLoader,
// });
const Patient = Loadable({
  loader: () => import("views/patient/patient"),
  loading: FullScreenLoader,
});
const PatientCreate = Loadable({
  loader: () => import("views/patient/patient/form"),
  loading: FullScreenLoader,
});
const ReportsCourier = Loadable({
  loader: () => import("views/reports/courier/index"),
  loading: FullScreenLoader,
});

const ReportsBranch = Loadable({
  loader: () => import("views/reports/branch/index"),
  loading: FullScreenLoader,
});

const ReportsUser = Loadable({
  loader: () => import("views/reports/users/index"),
  loading: FullScreenLoader,
});

const Branche = Loadable({
  loader: () => import("views/settings/branches"),
  loading: FullScreenLoader,
});
const BranchCreate = Loadable({
  loader: () => import("views/settings/branches/form"),
  loading: FullScreenLoader,
});
const BranchUser = Loadable({
  loader: () => import("views/shipperCompany/branchUsers"),
  loading: FullScreenLoader,
});
const BranchUserCreate = Loadable({
  loader: () => import("views/shipperCompany/branchUsers/form"),
  loading: FullScreenLoader,
});
const Settlement = Loadable({
  loader: () => import("views/shipperCompany/settlements"),
  loading: FullScreenLoader,
});
const SettlementCreate = Loadable({
  loader: () => import("views/shipperCompany/settlements/form"),
  loading: FullScreenLoader,
});

// const ShipperBranchesUsersForm = Loadable({
//   loader: () => import("views/settings/branches/form/users/form"),
//   loading: FullScreenLoader,
// });

const Template = Loadable({
  loader: () => import("views/settings/template"),
  loading: FullScreenLoader,
});

const TemplateCreate = Loadable({
  loader: () => import("views/settings/template/Form"),
  loading: FullScreenLoader,
});

const Documents = Loadable({
  loader: () => import("views/settings/services"),
  loading: FullScreenLoader,
});
const Service = Loadable({
  loader: () => import("views/settings/services/service"),
  loading: FullScreenLoader,
});
const ServiceCreate = Loadable({
  loader: () => import("views/settings/services/service/ServiceCreate"),
  loading: FullScreenLoader,
});
const Category = Loadable({
  loader: () => import("views/settings/services/category"),
  loading: FullScreenLoader,
});
const CategoryCreate = Loadable({
  loader: () => import("views/settings/services/category/CategoryCreate"),
  loading: FullScreenLoader,
});

const Catalog = Loadable({
  loader: () => import("views/settings/services/catalog"),
  loading: FullScreenLoader,
})

const CatalogCrate = Loadable({
  loader: () => import("views/settings/services/catalog/CatalogCreate"),
  loading: FullScreenLoader,
})
// const BranchCreate = Loadable({
//   loader: () => import("views/settings/integrations/iiko/BranchCreate"),
//   loading: FullScreenLoader,
// });

const DocumentsCreate = Loadable({
  loader: () => import("views/settings/services/Form"),
  loading: FullScreenLoader,
});

const UserRoles = Loadable({
  loader: () => import("views/settings/user-roles"),
  loading: FullScreenLoader,
});

const UserRolesCreate = Loadable({
  loader: () => import("views/settings/user-roles/Form"),
  loading: FullScreenLoader,
});

const Requisites = Loadable({
  loader: () => import("views/settings/requisites"),
  loading: FullScreenLoader,
});

const RequisitesCreate = Loadable({
  loader: () => import("views/settings/requisites/form"),
  loading: FullScreenLoader,
});
// const CompanyBranch = Loadable({
//   loader: () => import("views/settings/company/Branch"),
//   loading: FullScreenLoader,
// });

// const CompanyBranchCashiers = Loadable({
//   loader: () => import("views/settings/services1/Branch/tabs/Personnel/Cashiers"),
//   loading: FullScreenLoader,
// });

// const CompanyBranchCouriers = Loadable({
//   loader: () => import("views/settings/company/Branch/couriers"),
//   loading: FullScreenLoader,
// });

const SettingsCatalogGoods = Loadable({
  loader: () => import("views/settings/catalog/Goods"),
  loading: FullScreenLoader,
});

const SettingsCatalogGoodsCreate = Loadable({
  loader: () => import("views/settings/catalog/Goods/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogCategory = Loadable({
  loader: () => import("views/settings/catalog/Category"),
  loading: FullScreenLoader,
});

const SettingsCatalogCategoryProduct = Loadable({
  loader: () => import("views/settings/catalog/Category/CategoryCreate"),
  loading: FullScreenLoader,
});

const SettingsCatalogAttributes = Loadable({
  loader: () => import("views/settings/catalog/Attributes"),
  loading: FullScreenLoader,
});

const SettingsCatalogAttributesCreate = Loadable({
  loader: () => import("views/settings/catalog/Attributes/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogBrands = Loadable({
  loader: () => import("views/settings/catalog/Brands"),
  loading: FullScreenLoader,
});

const SettingsCatalogBrandsCreate = Loadable({
  loader: () => import("views/settings/catalog/Brands/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogUnits = Loadable({
  loader: () => import("views/settings/catalog/Units"),
  loading: FullScreenLoader,
});

const SettingsCatalogUnitsCreate = Loadable({
  loader: () => import("views/settings/catalog/Units/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogTags = Loadable({
  loader: () => import("views/settings/catalog/Tags"),
  loading: FullScreenLoader,
});

const SettingsCatalogTagsCreate = Loadable({
  loader: () => import("views/settings/catalog/Tags/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogProductVariants = Loadable({
  loader: () => import("views/settings/catalog/ProductVariants"),
  loading: FullScreenLoader,
});

const SettingsCatalogProductVariantsCreate = Loadable({
  loader: () => import("views/settings/catalog/ProductVariants/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogCombo = Loadable({
  loader: () => import("views/settings/catalog/Combo"),
  loading: FullScreenLoader,
});

const SettingsCatalogComboCreate = Loadable({
  loader: () => import("views/settings/catalog/Combo/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogPriceChanger = Loadable({
  loader: () => import("views/settings/catalog/PriceChanger"),
  loading: FullScreenLoader,
});

const SettingsCatalogPriceChangerCreate = Loadable({
  loader: () => import("views/settings/catalog/PriceChanger/Create"),
  loading: FullScreenLoader,
});

const SettingsCatalogRates = Loadable({
  loader: () => import("views/settings/catalog/Rates"),
  loading: FullScreenLoader,
});

const SettingsCatalogRatesCreate = Loadable({
  loader: () => import("views/settings/catalog/Rates/Create"),
  loading: FullScreenLoader,
});

export default [
  {
    component: Dashboard,
    path: "/dashboard",
    exact: true,
    title: "Dashboard",
    permission: "dashboard",
  },
  {
    component: Staffs,
    path: "/staffs",
    exact: true,
    title: "staffs",
    permission: "staffs",
  },
  {
    component: StaffsCreate,
    path: "/staffs/create",
    exact: true,
    title: "staffs-create",
    permission: "staffs",
  },
  {
    component: StaffsCreate,
    path: "/staffs/:id",
    exact: true,
    title: "staffs-edit",
    permission: "staffs",
  },

  // {
  //   component: CourierType,
  //   path: "/courier/courier-type",
  //   exact: true,
  //   title: "CourierType",
  //   permission: "courier_type",
  // },
  // {
  //   component: CourierTypeCreate,
  //   path: "/courier/courier-type/create",
  //   exact: true,
  //   title: "CourierTypeCreate",
  //   permission: "courier_type",
  // },
  // {
  //   component: CourierTypeCreate,
  //   path: "/courier/courier-type/:id",
  //   exact: true,
  //   title: "CourierTypeEdit",
  //   permission: "courier_type",
  // },
  {
    component: Profile,
    path: "/profile",
    exact: true,
    title: "Profile",
    permission: "profile",
  },
  {
    component: User,
    path: "/user",
    exact: true,
    title: "User",
    permission: "user",
  },
  {
    component: UserCreate,
    path: "/settings/branch/create/user/create",
    exact: true,
    title: "UserCreate",
    permission: "usercreate",
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
  // {
  //   component: ShipperBranches,
  //   path: "/company/shipper-company/:id/branches",
  //   exact: true,
  //   title: "shipperCompanyBranches",
  //   permission: "settings",
  // },
  // {
  //   component: ShipperBranches,
  //   path: "/company/shipper-company/:id/branches",
  //   exact: true,
  //   title: "shipperCompanyBranches",
  //   permission: "settings",
  // },

  // {
  //   component: ShipperBranchesForm,
  //   path: "/company/shipper-company/:id/branches/create",
  //   exact: true,
  //   title: "shipperCompanyBranchesCreate",
  //   permission: "settings",
  // },

  // {
  //   component: ShipperBranchesForm,
  //   path: "/company/shipper-company/:id/branches/:branch_id",
  //   exact: true,
  //   title: "shipperCompanyBranchesEdit",
  //   permission: "settings",
  // },
  // {
  //   component: ShipperBranchesUsersForm,
  //   path: "/company/shipper-company/:id/branches/:branch_id/users/:user_id",
  //   exact: true,
  //   title: "shipperCompanyBranchesUserUpdate",
  //   permission: "settings",
  // },
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
    path: "/marketing/stocks/:id",
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
  // {
  //   component: Courier,
  //   path: "/courier/list",
  //   exact: true,
  //   title: "Courier",
  //   permission: "courier",
  // },
  // {
  //   component: CourierCreate,
  //   path: "/courier/list/create",
  //   exact: true,
  //   title: "CourierCreate",
  //   permission: "courier",
  // },
  // {
  //   component: CourierCreate,
  //   path: "/courier/list/:id",
  //   exact: true,
  //   title: "CourierEdit",
  //   permission: "courier",
  // },
  {
    component: Patient,
    path: "/patients",
    exact: true,
    title: "Operator",
    permission: "operator",
  },
  {
    component: PatientCreate,
    path: "/patients/create",
    exact: true,
    title: "OperatorCreate",
    permission: "operator",
  },
  {
    component: PatientCreate,
    path: "/patients/:id",
    exact: true,
    title: "OperatorEdit",
    permission: "operator",
  },
  // {
  //   component: CourierType,
  //   path: "/personal/courier_type",
  //   exact: true,
  //   title: "CourierType",
  //   permission: "courier_type",
  // },
  // {
  //   component: CourierTypeCreate,
  //   path: "/personal/courier_type/create",
  //   exact: true,
  //   title: "CourierTypeCreate",
  //   permission: "courier_type",
  // },
  // {
  //   component: CourierTypeCreate,
  //   path: "/personal/courier_type/:id",
  //   exact: true,
  //   title: "CourierTypeEdit",
  //   permission: "courier_type",
  // },

  {
    component: Requisites,
    path: "/settings/requisites",
    exact: true,
    title: "Requisites",
    permission: "settings",
  },
  {
    component: RequisitesCreate,
    path: "/settings/requisites/create",
    exact: true,
    title: "Requisites",
    permission: "settings",
  },
  {
    component: Branche,
    path: "/settings/branch",
    exact: true,
    title: "Fares",
    permission: "fares",
  },
  {
    component: BranchCreate,
    path: "/settings/branch/create",
    exact: true,
    title: "Fares.Create",
    permission: "fares",
  },
  {
    component: BranchCreate,
    path: "/settings/branch/:id",
    exact: true,
    title: "Fares.Edit",
    permission: "fares",
  },
  {
    component: Template,
    path: "/settings/template",
    exact: true,
    title: "Template",
    permission: "fares",
  },
  {
    component: TemplateCreate,
    path: "/settings/template/create",
    exact: true,
    title: "Template.Create",
    permission: "fares",
  },
  {
    component: TemplateCreate,
    path: "/settings/template/:id",
    exact: true,
    title: "Template.Edit",
    permission: "fares",
  },
  {
    component: Documents,
    path: "/settings/documents",
    exact: true,
    title: "Integrations",
    permission: "fares",
  },
  {
    component: DocumentsCreate,
    path: "/settings/documents/create",
    exact: true,
    title: "Integrations.Create",
    permission: "fares",
  },
  // {
  //   component: IikoEdit,
  //   path: "/settings/integrations/iiko",
  //   exact: true,
  //   title: "Iiko.Edit",
  //   permission: "fares",
  // },
  // {
  //   component: JowiEdit,
  //   path: "/settings/integrations/jowi",
  //   exact: true,
  //   title: "Jowi.Edit",
  //   permission: "fares",
  // },
  {
    component: Service,
    path: "/settings/services/service",
    exact: true,
    title: "service",
    permission: "fares",
  },
  {
    component: ServiceCreate,
    path: "/settings/services/service/create",
    exact: true,
    title: "ServiceCreate",
    permission: "fares",
  },
  {
    component: ServiceCreate,
    path: "/settings/services/service/create/:id",
    exact: true,
    title: "ServiceCreate",
    permission: "fares",
  },
  {
    component: Catalog,
    path: "/settings/services/catalog",
    exact: true,
    title: 'Catalog',
    permission: "fares"
  },
  {
    component: CatalogCrate,
    path: "/settings/services/catalog/create",
    exact: true,
    title: 'Catalog',
    permission: "fares"
  },
  {
    component: Category,
    path: "/settings/services/category",
    exact: true,
    title: "category",
    permission: "fares",
  },
  {
    component: CategoryCreate,
    path: "/settings/services/category/create",
    exact: true,
    title: "CategoryCreate",
    permission: "fares",
  },
  {
    component: CategoryCreate,
    path: "/settings/services/category/:id",
    exact: true,
    title: "CategoryCreate",
    permission: "fares",
  },
  // {
  //   component: BranchCreate,
  //   path: "/settings/integrations/iiko/branch-create",
  //   exact: true,
  //   title: "BranchCreate",
  //   permission: "fares",
  // },
  // {
  //   component: BranchCreate,
  //   path: "/settings/integrations/iiko/branch-create/:id",
  //   exact: true,
  //   title: "BranchCreate",
  //   permission: "fares",
  // },
  // {
  //   component: JowiBranchCreate,
  //   path: "/settings/integrations/jowi/branch-create",
  //   exact: true,
  //   title: "BranchCreate",
  //   permission: "fares",
  // },
  // {
  //   component: JowiBranchCreate,
  //   path: "/settings/integrations/jowi/branch-create/:id",
  //   exact: true,
  //   title: "BranchCreate",
  //   permission: "fares",
  // },
  // {
  //   component: JowiAddProduct,
  //   path: "/settings/integrations/jowi/add-product",
  //   exact: true,
  //   title: "BranchCreate",
  //   permission: "fares",
  // },
  // {
  //   component: JowiAddProduct,
  //   path: "/settings/integrations/jowi/add-product/:id",
  //   exact: true,
  //   title: "BranchCreate",
  //   permission: "fares",
  // },
  {
    component: DocumentsCreate,
    path: "/settings/documents/:id",
    exact: true,
    title: "Integrations.Edit",
    permission: "fares",
  },
  {
    component: UserRoles,
    path: "/settings/user-roles",
    exact: true,
    title: "RoleAccess",
    permission: "fares",
  },
  {
    component: UserRolesCreate,
    path: "/settings/user-roles/create",
    exact: true,
    title: "RoleAccess.Create",
    permission: "fares",
  },
  {
    component: UserRolesCreate,
    path: "/settings/user-roles/:id",
    exact: true,
    title: "RoleAccess.Edit",
    permission: "fares",
  },
  // {
  //   component: Services,
  //   path: "/settings/services",
  //   exact: true,
  //   title: "Company",
  //   permission: "fares",
  // },
  // {
  //   component: CompanyBranch,
  //   path: "/settings/company/branches/:id",
  //   exact: true,
  //   title: "Company.Branches",
  //   permission: "fares",
  // },
  // {
  //   component: CompanyBranchCashiers,
  //   path: "/settings/company/branches/:id/cashiers/:cashier_id",
  //   exact: true,
  //   title: "Branches.Cashiers",
  //   permission: "fares",
  // },
  // {
  //   component: CompanyBranchCouriers,
  //   path: "/settings/company/branch/couriers",
  //   exact: true,
  //   title: "Company.Branch.Couriers",
  //   permission: "fares",
  // },
  {
    component: SettingsCatalogGoods,
    path: "/catalog/goods",
    exact: true,
    title: "Settings.Catalog.Goods",
    permission: "fares",
  },
  {
    component: SettingsCatalogGoodsCreate,
    path: "/catalog/goods/create",
    exact: true,
    title: "Settings.Catalog.Goods.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogGoodsCreate,
    path: "/catalog/goods/:id",
    exact: true,
    title: "Settings.Catalog.Goods.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogCategory,
    path: "/catalog/category",
    exact: true,
    title: "Settings.Catalog.Category",
    permission: "fares",
  },
  {
    component: SettingsCatalogCategoryProduct,
    path: "/catalog/category/create",
    exact: true,
    title: "Settings.Catalog.Product.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogCategoryProduct,
    path: "/catalog/category/:id",
    exact: true,
    title: "Settings.Catalog.Product.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogAttributes,
    path: "/catalog/attributes",
    exact: true,
    title: "Settings.Catalog.Attributes",
    permission: "fares",
  },
  {
    component: SettingsCatalogAttributesCreate,
    path: "/catalog/attributes/create",
    exact: true,
    title: "Settings.Catalog.Attribute.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogAttributesCreate,
    path: "/catalog/attributes/:id",
    exact: true,
    title: "Settings.Catalog.Attribute.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogBrands,
    path: "/catalog/brands",
    exact: true,
    title: "Settings.Catalog.Brands",
    permission: "fares",
  },
  {
    component: SettingsCatalogBrandsCreate,
    path: "/catalog/brands/create",
    exact: true,
    title: "Settings.Catalog.Brand.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogBrandsCreate,
    path: "/catalog/brands/:id",
    exact: true,
    title: "Settings.Catalog.Brand.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogUnits,
    path: "/catalog/units",
    exact: true,
    title: "Settings.Catalog.Unit",
    permission: "fares",
  },
  {
    component: SettingsCatalogUnitsCreate,
    path: "/catalog/units/create",
    exact: true,
    title: "Settings.Catalog.Unit.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogUnitsCreate,
    path: "/catalog/units/:id",
    exact: true,
    title: "Settings.Catalog.Unit.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogTags,
    path: "/catalog/tags",
    exact: true,
    title: "Settings.Catalog.Tags",
    permission: "fares",
  },
  {
    component: SettingsCatalogTagsCreate,
    path: "/catalog/tags/create",
    exact: true,
    title: "Settings.Catalog.Tag.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogTagsCreate,
    path: "/catalog/tags/:id",
    exact: true,
    title: "Settings.Catalog.Tag.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogProductVariants,
    path: "/catalog/product_variants",
    exact: true,
    title: "Settings.Catalog.Product.Variants",
    permission: "fares",
  },
  {
    component: SettingsCatalogProductVariantsCreate,
    path: "/catalog/product_variants/create",
    exact: true,
    title: "Settings.Catalog.Product.Variants.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogProductVariantsCreate,
    path: "/catalog/product_variants/:id",
    exact: true,
    title: "Settings.Catalog.Product.Variants.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogCombo,
    path: "/catalog/combo",
    exact: true,
    title: "Settings.Catalog.Combo",
    permission: "fares",
  },
  {
    component: SettingsCatalogComboCreate,
    path: "/catalog/combo/create",
    exact: true,
    title: "Settings.Catalog.Combo.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogComboCreate,
    path: "/catalog/combo/:id",
    exact: true,
    title: "Settings.Catalog.Combo.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogPriceChanger,
    path: "/catalog/price-changers",
    exact: true,
    title: "Settings.Catalog.Price.Changer",
    permission: "fares",
  },
  {
    component: SettingsCatalogPriceChangerCreate,
    path: "/catalog/price-changers/create",
    exact: true,
    title: "Settings.Catalog.Price.Changer.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogPriceChangerCreate,
    path: "/catalog/price-changers/:id",
    exact: true,
    title: "Settings.Catalog.Price.Changer.Edit",
    permission: "fares",
  },
  {
    component: SettingsCatalogRates,
    path: "/catalog/rates",
    exact: true,
    title: "Settings.Catalog.Rate",
    permission: "fares",
  },
  {
    component: SettingsCatalogRatesCreate,
    path: "/catalog/rates/create",
    exact: true,
    title: "Settings.Catalog.Rate.Create",
    permission: "fares",
  },
  {
    component: SettingsCatalogRatesCreate,
    path: "/catalog/rates/:id",
    exact: true,
    title: "Settings.Catalog.Rate.Edit",
    permission: "fares",
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
}));
