import {HiOutlineDatabase} from "react-icons/hi";
import {SiMongodb, SiPostgresql} from "react-icons/si";

export const resourceTypes = [
  // {
  //   label: "Not decided",
  //   value: 0,
  //   icon: HiOutlineDatabase,
  // },
  {
    label: "MongoDB",
    value: 1,
    icon: SiMongodb,
  },
  // {
  //   label: "Clickhouse",
  //   value: 2,
  //   icon: HiOutlineDatabase,
  // },
  {
    label: "PosgreSQL",
    value: 3,
    icon: SiPostgresql,
  },
  {
    label: "Rest",
    value: 4,
    icon: SiPostgresql,
  },
  {
    label: "GitHub",
    value: 5,
    icon: SiPostgresql,
  },
  {
    label: "Sms",
    value: 6,
    icon: SiPostgresql,
  },
  {
    label: "Smtp",
    value: 7,
    icon: SiPostgresql,
  },
  {
    label: "Click House",
    value: 2,
    icon: SiPostgresql,
  },
  {
    label: "Gitlab",
    value: 8,
    icon: SiPostgresql,
  },
  {
    label: "Superset",
    value: 11,
    icon: SiPostgresql,
  },
  {
    label: "Metabase",
    value: 12,
    icon: SiPostgresql,
  },
];
export const resources = [
  {
    label: "Not decided",
    value: "NOT_DECIDED",
    icon: HiOutlineDatabase,
  },
  {
    label: "MongoDB",
    value: "MONGO_DB",
    icon: SiMongodb,
  },
  {
    label: "Clickhouse",
    value: "CLICKHOUSE",
    icon: HiOutlineDatabase,
  },
  {
    label: "PosgreSQL",
    value: "POSGRESQL",
    icon: SiPostgresql,
  },
  {
    label: "Rest",
    value: "REST",
    icon: SiPostgresql,
  },
  {
    label: "GitHub",
    value: "GITHUB",
    icon: SiPostgresql,
  },

  {
    label: "Gitlab",
    value: "GITLAB",
    icon: SiPostgresql,
  },
];

export const serviceTypes = [
  {
    label: "Not specified",
    value: 0,
  },
  {
    label: "Builder service",
    value: 1,
  },
  {
    label: "Analytics service",
    value: 2,
  },
];
export const groupedResources = [
  {
    head: "Databases",
    items: [
      {
        type: "mongo",
        label: "MongoDB",
        value: 1,
        icon: "mongo",
      },
      {
        type: "CLICK_HOUSE",
        label: "Click House",
        value: 2,
        icon: "clickhouse",
      },
      {
        type: "POSGRESQL",
        label: "PostgreSQL",
        value: 3,
        icon: "postgres",
      },
    ],
  },
  {
    head: "API",
    items: [
      {
        type: "SMS",
        label: "Playmobile",
        value: 6,
        icon: "restapi",
      },
      {
        label: "SMTP",
        value: 7,
        icon: "restapi",
      },
    ],
  },
  {
    head: "Source Code Version Control",
    items: [
      {
        label: "Github",
        value: 5,
        icon: "github",
      },
      {
        label: "Gitlab",
        value: 8,
        icon: "gitlab",
      },
    ],
  },
  {
    head: "BI tool",
    items: [
      {
        label: "Superset",
        value: 11,
        icon: "superset",
      },
      {
        label: "Metabase",
        value: 12,
        icon: "metabase",
      },
    ],
  },
  {
    head: "Transcoder",
    items: [
      {
        label: "Transcoder",
        value: 11,
        icon: "superset",
      },
    ],
  },
];

export const getResourceTypeByID = (type) => {
  return resourceTypes.find((el) => el.value === type)?.label;
};

export const getResourceTypeIconID = (type) => {
  return resourceTypes.find((el) => el.value === type)?.icon;
};

export const getServiceTypeByID = (service) => {
  return serviceTypes.find((el) => el.value === service)?.label;
};
