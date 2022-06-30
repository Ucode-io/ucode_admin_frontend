import Settings from "@mui/icons-material/Settings"

export const elements = [
  // {
  //   id: "constructor",
  //   title: "Constructor",
  //   path: "/constructor",
  //   icon: Widgets,
  //   // permission: "PROJECTS"
  // },
  // {
  //   id: "docs",
  //   title: "Документы",
  //   icon: LocalPostOffice,
  //   // permission: "PROJECTS",
  //   children: [
  //     {
  //       id: "incoming",
  //       title: "Входящие",
  //       path: `/docs/incoming`,
  //       isChild: true,
  //     },
  //     {
  //       id: "outgoing",
  //       title: "Исходящие",
  //       path: `/docs/outgoing`,
  //       isChild: true,
  //     },
  //     {
  //       id: "saved",
  //       title: "Сохраненные",
  //       path: `/docs/saved`,
  //       isChild: true,
  //     },
  //     {
  //       id: "deleted",
  //       title: "Удаленные",
  //       path: `/docs/deleted`,
  //       isChild: true,
  //     },
  //     {
  //       id: "archived",
  //       title: "Архив",
  //       path: `/docs/archived`,
  //       isChild: true,
  //     },
  //   ]
  // },

]

export const settingsElements = [
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    children: [
      {
        id: "constructor",
        title: "Contructor",
        path: "/settings/constructor/objects",
      },
      {
        id: "authMatrix",
        title: "Auth matrix",
        path: `/settings/auth/matrix/${import.meta.env.VITE_AUTH_PROJECT_ID}`,
      },
      {
        id: "users",
        title: "Users",
        path: "/settings/users",
      }
    ]
  },
  
]
