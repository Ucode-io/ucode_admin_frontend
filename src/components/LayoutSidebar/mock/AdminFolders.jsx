export const AdminFolders = [
  {
    label: "Users",
    type: "USER_FOLDER",
    icon: "users.svg",
    parent_id: "12",
    id: "13",
    data: {
      permission: {
        read: true,
        write: true,
        delete: true,
        update: true,
      },
    },
  },
  {
    label: "Permissions",
    type: "USER_FOLDER",
    icon: "lock.svg",
    parent_id: "12",
    id: "14",
    data: {
      permission: {
        read: true,
        write: true,
        delete: true,
        update: true,
      },
    },
  },
];
