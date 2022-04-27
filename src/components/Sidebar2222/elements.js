import { LocalPostOffice, Settings, ManageAccounts, Person, PivotTableChart, GridView } from "@mui/icons-material"

const routes = [
  {
    id: "dashboard",
    title: "Дэшборд",
    path: "/dashboard",
    icon: GridView,
    // permission: "PROJECTS"
  },
  {
    id: "docs",
    title: "Документы",
    path: "/docs",
    icon: LocalPostOffice,
    // permission: "PROJECTS",
    children: [
      {
        id: "incoming",
        title: "Входящие",
        path: `/docs/incoming`,
        isChild: true,
      },
      {
        id: "outgoing",
        title: "Исходящие",
        path: `/docs/outgoing`,
        isChild: true,
      },
      {
        id: "saved",
        title: "Сохраненные",
        path: `/docs/saved`,
        isChild: true,
      },
      {
        id: "deleted",
        title: "Удаленные",
        path: `/docs/deleted`,
        isChild: true,
      },
      {
        id: "archived",
        title: "Архив",
        path: `/docs/archived`,
        isChild: true,
      },
    ]
  },
  {
    id: "settings",
    title: "Настройки",
    path: "/settings",
    icon: Settings,
    permission: "SETTINGS",
    // children: [

    //   {
    //     id: "users",
    //     title: "Users",
    //     path: `/settings/users`,
    //     icon: Person,
    //     isChild: true,
    //     permission: "SETTINGS/USERS"
    //   },
    //   {
    //     id: "phases",
    //     title: "Phases",
    //     path: "/settings/phases",
    //     icon: Bookmark,
    //     isChild: true,
    //     permission: "SETTINGS/PHASES"
    //   },
    //   {
    //     id: "positions",
    //     title: "Positions",
    //     path: "/settings/positions",
    //     icon: ManageAccounts,
    //     isChild: true,
    //     permission: "SETTINGS/POSITIONS"
    //   },
    // ],
  },
]

export default routes
