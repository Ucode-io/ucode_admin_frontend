const icons = {
  SINGLE_LINE: <img src="/img/text-column.svg" alt="Text" />,
  MULTI_LINE: <img src="/table-icons/multi-line.svg" alt="Multi line" />,
  TEXT: <img src="/img/text-column.svg" alt="Text" />,
  LINK: <img src="/table-icons/link.svg" alt="Link" />,
  NUMBER: <img src="/table-icons/number.svg" alt="Number" />,
  FLOAT: <img src="/table-icons/float.svg" alt="Float" />,
  MONEY: <img src="/table-icons/money.svg" alt="Money" />,
  DATE: <img src="/table-icons/date.svg" alt="Date" />,
  DATE_TIME: <img src="/table-icons/date-time.svg" alt="Date time" />,
  DATE_TIME_WITHOUT_TIME_ZONE: (
    <img src="/table-icons/date-time.svg" alt="Date time" />
  ),
  TIME: <img src="/table-icons/time.svg" alt="Time" />,
  MULTISELECT: <img src="/table-icons/multi-select.svg" alt="Multiselect" />,
  STATUS: <img src="/table-icons/status.svg" alt="Status" />,
  SWITCH: <img src="/table-icons/switch.svg" alt="Switch" />,
  CHECKBOX: <img src="/table-icons/checkbox.svg" alt="Checkbox" />,
  FORMULA_FRONTEND: <img src="/table-icons/formula.svg" alt="Formula" />,
  FORMULA: <img src="/table-icons/formula.svg" alt="Formula" />,
  LOOKUP: <img src="/table-icons/lookup.svg" alt="Lookup" />,
  RELATION: <img src="/table-icons/lookup.svg" alt="Lookup" />,
  FILE: <img src="/table-icons/file.svg" alt="File" />,
  PHOTO: <img src="/table-icons/photo.svg" alt="Photo" />,
  VIDEO: <img src="/table-icons/video.svg" alt="Video" />,
  MULTI_IMAGE: <img src="/table-icons/multi-image.svg" alt="Multi image" />,
  MAP: <img src="/table-icons/map.svg" alt="Map" />,
  POLYGON: <img src="/table-icons/polygon.svg" alt="Polygon" />,
  INTERNATION_PHONE: <img src="/img/phone.svg" alt="Phone" />,
  EMAIL: <img src="/table-icons/email.svg" alt="Email" />,
  PASSWORD: <img src="/table-icons/password.svg" alt="Password" />,
  BUTTON: <img src="/table-icons/plus-square.svg" alt="Password" />,
  JSON: <img src="/table-icons/code-02.svg" alt="Password" />,
  QR: <img src="/table-icons/qr-code-02.svg" alt="Password" />,
  INCREMENT_ID: <img src="/table-icons/Line.svg" alt="Password" />,
  ICON: <img src="/table-icons/plus-square.svg" alt="Password" />,
  BARCODE: <img src="/table-icons/scan.svg" alt="Password" />,
  COLOR: <img src="/table-icons/palette.svg" alt="Password" />,
  MULTI_FILE: <img src="/table-icons/file.svg" alt="Multi file" />,
};

const iconsPaths = {
  SINGLE_LINE: "/img/text-column.svg",
  MULTI_LINE: "/table-icons/multi-line.svg",
  TEXT: "/img/text-column.svg",
  LINK: "/table-icons/link.svg",
  NUMBER: "/table-icons/number.svg",
  FLOAT: "/table-icons/float.svg",
  MONEY: "/table-icons/money.svg",
  DATE: "/table-icons/date.svg",
  DATE_TIME: "/table-icons/date-time.svg",
  DATE_TIME_WITHOUT_TIME_ZONE: "/table-icons/date-time.svg",
  TIME: "/table-icons/time.svg",
  MULTISELECT: "/table-icons/multi-select.svg",
  STATUS: "/table-icons/status.svg",
  SWITCH: "/table-icons/switch.svg",
  CHECKBOX: "/table-icons/checkbox.svg",
  FORMULA_FRONTEND: "/table-icons/formula.svg",
  LOOKUP: "/table-icons/lookup.svg",
  RELATION: "/table-icons/lookup.svg",
  FILE: "/table-icons/file.svg",
  PHOTO: "/table-icons/photo.svg",
  VIDEO: "/table-icons/video.svg",
  MULTI_IMAGE: "/table-icons/multi-image.svg",
  MAP: "/table-icons/map.svg",
  POLYGON: "/table-icons/polygon.svg",
  INTERNATION_PHONE: "/img/phone.svg",
  EMAIL: "/table-icons/email.svg",
  PASSWORD: "/table-icons/password.svg",
  BUTTON: "/table-icons/password.svg",
  PERSON: "/table-icons/person.svg",
};

export const getColumnIcon = ({column}) => {
  if (column?.table_slug === "person") {
    return <img src="/table-icons/person.svg" alt="Person" />;
  } else if (column?.type === "Many2One") {
    return <img src="/table-icons/lookup.svg" alt="Person" />;
  }
  return icons[column.type];
};

export const getColumnIconPath = ({column}) => {
  if (column.table_slug === "person") {
    return "/table-icons/person.svg";
  }
  return iconsPaths[column.type];
};
