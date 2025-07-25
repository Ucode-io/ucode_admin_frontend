export const FIELD_TYPES = {
  SINGLE_LINE: "SINGLE_LINE",
  MULTI_LINE: "MULTI_LINE",
  PICK_LIST: "PICK_LIST",
  DATE: "DATE",
  TIME: "TIME",
  DATE_TIME: "DATE_TIME",
  NUMBER: "NUMBER",
  CHECKBOX: "CHECKBOX",
  EMAIL: "EMAIL",
  MULTISELECT: "MULTISELECT",
  MAP: "MAP",
  JSON: "JSON",
  STATUS: "STATUS",
  PROGRAMMING_LANGUAGE: "PROGRAMMING_LANGUAGE",
  SWITCH: "SWITCH",
  PHOTO: "PHOTO",
  PHONE: "PHONE",
  MULTI_IMAGE: "MULTI_IMAGE",
  INTERNATION_PHONE: "INTERNATION_PHONE",
  ICON: "ICON",
  PASSWORD: "PASSWORD",
  FORMULA: "FORMULA",
  LOOKUP: "LOOKUP",
  LOOKUPS: "LOOKUPS",
  FILE: "FILE",
  FORMULA_FRONTEND: "FORMULA_FRONTEND",
  TEXT: "TEXT",
  INCREMENT_ID: "INCREMENT_ID",
  DATE_TIME_WITHOUT_TIME_ZONE: "DATE_TIME_WITHOUT_TIME_ZONE",
};

export const fieldTypes = [
  "SINGLE_LINE",
  "MULTI_LINE",
  "PICK_LIST",
  "DATE",
  "TIME",
  "DATE_TIME",
  "NUMBER",
  "CHECKBOX",
  "EMAIL",
  "MULTISELECT",
  "MAP",
  "JSON",
  "PROGRAMMING_LANGUAGE",
  "SWITCH",
  "PHOTO",
  "PHONE",
  "INTERNATION_PHONE",
  "ICON",
  "PASSWORD",
  "FORMULA",
  "DENTIST",
  "COLOR",
  "FLOAT_NOLIMIT",
  "DATE_TIME_WITHOUT_TIME_ZONE",
  "PRIMARY_KEY",
  "QR",
  "POLYGON",
  "LINK",
  "BUTTON",
  "TEXT",
  "STATUS",
  "MONEY",
];

export const fieldTypesOptions = [
  {
    label: "Text",
    options: [
      {
        icon: "minus.svg",
        label: "Single line",
        value: "SINGLE_LINE",
      },
      {
        icon: "grip-lines.svg",
        label: "Multi line",
        value: "MULTI_LINE",
      },
    ],
  },
  {
    label: "Date",
    options: [
      {
        icon: "calendar.svg",
        label: "Date",
        value: "DATE",
      },
      {
        icon: "business-time.svg",
        label: "Date time",
        value: "DATE_TIME",
      },
      {
        icon: "clock.svg",
        label: "Date time - Timezone",
        value: "DATE_TIME_WITHOUT_TIME_ZONE",
      },
      {
        icon: "clock.svg",
        label: "Time",
        value: "TIME",
      },
    ],
  },
  {
    label: "Number",
    options: [
      {
        icon: "hashtag.svg",
        label: "Number",
        value: "NUMBER",
      },
      {
        icon: "hashtag.svg",
        label: "Float",
        value: "FLOAT",
      },
      {
        icon: "dollar-sign.svg",
        label: "Money",
        value: "MONEY",
      },
    ],
  },
  {
    label: "Input",
    options: [
      {
        icon: "square-check.svg",
        label: "Checkbox",
        value: "CHECKBOX",
      },
      {
        icon: "toggle-on.svg",
        label: "Switch",
        value: "SWITCH",
      },
    ],
  },
  {
    label: "Select",
    options: [
      // {
      //   label: "Picklist",
      //   value: "PICK_LIST"
      // },
      {
        icon: "list-check.svg",
        label: "Select",
        value: "MULTISELECT",
      },
      {
        icon: "list-ol.svg",
        label: "Status",
        value: "STATUS",
      },
      // {
      //   icon: "list-check.svg",
      //   label: "Multi select V2",
      //   value: "MULTISELECT_V2",
      // },
    ],
  },
  {
    label: "Map",
    options: [
      {
        icon: "map-pin.svg",
        label: "Point",
        value: "MAP",
      },
      {
        icon: "draw-polygon.svg",
        label: "Geozone",
        value: "POLYGON",
      },
    ],
  },
  // {
  //   label: "Code",
  //   options: [
  //     {
  //       icon: "map-pin.svg",
  //       label: "Code",
  //       value: "CODE",
  //     },
  //   ],
  // },

  {
    label: "File",
    options: [
      {
        icon: "image.svg",
        label: "Photo",
        value: "PHOTO",
      },

      {
        icon: "video.svg",
        label: "Video",
        value: "VIDEO",
      },
      {
        icon: "file.svg",
        label: "File",
        value: "FILE",
      },

      {
        icon: "image.svg",
        label: "Multi Image",
        value: "MULTI_IMAGE",
      },
      {
        icon: "image.svg",
        label: "Multi File",
        value: "MULTI_FILE",
      },
    ],
  },
  {
    label: "Formula",
    options: [
      {
        icon: "square-root-variable.svg",
        label: "Formula in frontend",
        value: "FORMULA_FRONTEND",
      },
      {
        icon: "plus-minus.svg",
        label: "Formula in backend",
        value: "FORMULA",
      },
    ],
  },
  // {
  //   label: "Primary Key",
  //   options: [
  //     {
  //       icon: "ellipsis.svg",
  //       label: "Generated string",
  //       value: "RANDOM_TEXT",
  //     },
  //     {
  //       icon: "regular_id-badge.svg",
  //       label: "UUID",
  //       value: "RANDOM_UUID",
  //     },
  //     {
  //       icon: "pen.svg",
  //       label: "Manual string",
  //       value: "MANUAL_STRING",
  //     },
  //     {
  //       icon: "arrow-up-a-z.svg",
  //       label: "Increment number",
  //       value: "INCREMENT_NUMBER",
  //     },
  //   ],
  // },
  {
    label: "Special",
    options: [
      {
        icon: "text-height.svg",
        label: "Text",
        value: "TEXT",
      },
      {
        icon: "link.svg",
        label: "Link",
        value: "LINK",
      },
      {
        icon: "circle-user.svg",
        label: "Person",
        value: "PERSON",
      },
      {
        icon: "regular_square-caret-down.svg",
        label: "Button",
        value: "BUTTON",
      },
      {
        icon: "arrow-up-9-1.svg",
        label: "Increment ID",
        value: "INCREMENT_ID",
      },
      // {
      //   icon: "code.svg",
      //   label: "Programming language",
      //   value: "PROGRAMMING_LANGUAGE",
      // },
      {
        icon: "file-lines.svg",
        label: "JSON",
        value: "JSON",
      },
      {
        icon: "qrcode.svg",
        label: "Qr",
        value: "QR",
      },

      // {
      //   icon: "phone.svg",
      //   label: "Phone",
      //   value: "PHONE",
      // },
      {
        icon: "phone.svg",
        label: "Internation Phone",
        value: "INTERNATION_PHONE",
      },
      {
        icon: "envelope.svg",
        label: "Email",
        value: "EMAIL",
      },
      {
        icon: "icons.svg",
        label: "Icon",
        value: "ICON",
      },
      {
        icon: "lock.svg",
        label: "Password",
        value: "PASSWORD",
      },
      // {
      //   icon: "barcode.svg",
      //   label: "Barcode",
      //   value: "BARCODE",
      // },
      // {
      //   icon: "barcode.svg",
      //   label: "Codabar",
      //   value: "CODABAR",
      // },
      // {
      //   icon: "fill.svg",
      //   label: "Autofill",
      //   value: "AUTOFILL",
      // },
      // {
      //   icon: "barcode.svg",
      //   label: "Scan-barcode",
      //   value: "SCAN_BARCODE",
      // },
      // {
      //   icon: "teeth.svg",
      //   label: "Dentist",
      //   value: "DENTIST",
      // },
      {
        icon: "colon-sign.svg",
        label: "Color",
        value: "COLOR",
      },
    ],
  },
];
export const numberFieldFormats = [
  {
    label: "Number",
    value: "NUMBER",
    icon: "minus.svg",
  },
  {
    label: "Float",
    value: "FLOAT",
    icon: "minus.svg",
  },
  // {
  //   label: "Money",
  //   value: "MONEY",
  //   icon: "minus.svg",
  // },
];

// export const barcodeFieldFormats = [
//   {
//     label: "QR",
//     value: "QR",
//     icon: "minus.svg",
//   },
//   {
//     label: "Barcode",
//     value: "BARCODE",
//     icon: "minus.svg",
//   },
// ];

export const textFieldFormats = [
  {
    label: "Text",
    value: "SINGLE_LINE",
    icon: "minus.svg",
  },
  {
    label: "Text Area",
    value: "MULTI_LINE",
    icon: "minus.svg",
  },
  // {
  //   label: "Text Input",
  //   value: "TEXT",
  //   icon: "minus.svg",
  // },
  // {
  //   label: "Link",
  //   value: "LINK",
  //   icon: "minus.svg",
  // },
];

export const incrementFieldFormats = [
  {
    label: "Increment ID",
    value: "INCREMENT_ID",
    icon: "minus.svg",
  },
  // {
  //   label: "Increment Number",
  //   value: "INCREMENT_NUMBER",
  //   icon: "minus.svg",
  // },
];

export const PrimaryKeyFieldFormats = [
  {
    icon: "ellipsis.svg",
    label: "Generated string",
    value: "RANDOM_TEXT",
  },
  {
    icon: "regular_id-badge.svg",
    label: "UUID",
    value: "RANDOM_UUID",
  },
  {
    icon: "pen.svg",
    label: "Manual string",
    value: "MANUAL_STRING",
  },
  {
    icon: "arrow-up-a-z.svg",
    label: "Increment number",
    value: "INCREMENT_NUMBER",
  },

  // {
  //   label: "Increment Number",
  //   value: "INCREMENT_NUMBER",
  //   icon: "minus.svg",
  // },
];

// export const codeFieldFormats = [
//   {
//     label: "JSON",
//     value: "JSON",
//     icon: "minus.svg",
//   },
//   {
//     label: "Programming Language",
//     value: "PROGRAMMING_LANGUAGE",
//     icon: "computer.svg",
//   },
// ];

export const toggleButtonFormats = [
  {
    label: "Checkbox",
    value: "CHECKBOX",
    icon: "square-check.svg",
  },
  {
    label: "Switch",
    value: "SWITCH",
    icon: "toggle-on.svg",
  },
];

export const dropDownFormats = [
  {
    label: "Multiselect",
    value: "MULTISELECT",
    icon: "square-caret-down.svg",
  },
  {
    label: "Status",
    value: "STATUS",
    icon: "toggle-on.svg",
  },
];
export const mapFieldFormats = [
  {
    label: "Map",
    value: "MAP",
    icon: "map-pin.svg",
  },
  {
    label: "Polygon",
    value: "POLYGON",
    icon: "draw-polygon.svg",
  },
];
export const dateFieldFormats = [
  {
    label: "Date",
    value: "DATE",
    icon: "minus.svg",
  },
  {
    label: "Date time",
    value: "DATE_TIME",
    icon: "minus.svg",
  },
  {
    label: "Date time (without timezone)",
    value: "DATE_TIME_WITHOUT_TIME_ZONE",
    icon: "minus.svg",
  },
  {
    label: "Time",
    value: "TIME",
    icon: "minus.svg",
  },
];
export const fileFieldFormats = [
  {
    icon: "image.svg",
    label: "Photo",
    value: "PHOTO",
  },
  {
    icon: "video.svg",
    label: "Video",
    value: "VIDEO",
  },
  {
    icon: "file.svg",
    label: "File",
    value: "FILE",
  },
  {
    icon: "image.svg",
    label: "Multiple photo",
    value: "MULTI_IMAGE",
  },
  {
    icon: "image.svg",
    label: "Multi File",
    value: "MULTI_FILE",
  },
];

export const newFieldTypes = [
  {
    label: "Text",
    label_ru: "Текст",
    label_en: "Text",
    label_uz: "Matn",
    value: "SINGLE_LINE",
    icon: "minus.svg",
  },
  {
    label: "Number",
    label_ru: "Номер",
    label_en: "Number",
    label_uz: "Raqam",
    value: "NUMBER",
    icon: "hashtag.svg",
  },
  {
    label: "Date",
    label_ru: "Дата",
    label_en: "Date",
    label_uz: "Sana",
    value: "DATE",
    icon: "calendar.svg",
  },
  {
    label: "Dropdown",
    label_ru: "Выпадающий список",
    label_en: "Dropdown",
    label_uz: "Ochiladigan ro'yxat",
    value: "MULTISELECT",
    icon: "square-caret-down.svg",
  },

  {
    label: "Toggle Buttons",
    label_ru: "Переключатель кнопок",
    label_en: "Toggle Buttons",
    label_uz: "O'chiruvchi tugma",
    value: "SWITCH",
    icon: "square-caret-down.svg",
  },
  {
    label: "Formula",
    label_ru: "Формула",
    label_en: "Formula",
    label_uz: "Formula",
    value: "FORMULA_FRONTEND",
    icon: "plus-minus.svg",
  },
  // {
  //   label: "Formula backend",
  //   label_ru: "Формула backend",
  //   label_en: "Formula backend",
  //   label_uz: "Formula backend",
  //   value: "FORMULA",
  //   icon: "plus-minus.svg",
  // },
  {
    label: "Relation",
    label_ru: "Связь",
    label_en: "Relation",
    label_uz: "Bog'lanish",
    value: "RELATION",
    icon: "link-simple.svg",
  },
  {
    label: "Person",
    label_ru: "Человек",
    label_en: "Person",
    label_uz: "Odam",
    value: "PERSON",
    icon: "link-simple.svg",
    table_slug: "person",
  },
  {
    label: "File",
    label_ru: "Файл",
    label_en: "File",
    label_uz: "Fayl",
    value: "FILE",
    icon: "file.svg",
  },
  {
    label: "Map",
    label_ru: "Карта",
    label_en: "Map",
    label_uz: "Xarita",
    value: "MAP",
    icon: "map-pin.svg",
  },
  {
    label: "Email",
    label_ru: "Електронная почта",
    label_en: "Email",
    label_uz: "Elektron pochta",
    value: "EMAIL",
    icon: "envelope.svg",
  },

  {
    label: "Password",
    label_ru: "Пароль",
    label_en: "Password",
    label_uz: "Parol",
    value: "PASSWORD",
    icon: "lock.svg",
  },
  {
    icon: "link.svg",
    label: "Link",
    label_ru: "Ссылка",
    label_en: "Link",
    label_uz: "Havola",
    value: "LINK",
  },
  {
    icon: "regular_square-caret-down.svg",
    label: "Button",
    label_ru: "Кнопка",
    label_en: "Button",
    label_uz: "Tugma",
    value: "BUTTON",
  },
  {
    icon: "arrow-up-9-1.svg",
    label: "Increment ID",
    label_ru: "Увеличение ID",
    label_en: "Increment ID",
    label_uz: "ID ni oshirish",
    value: "INCREMENT_ID",
  },
  {
    icon: "file-lines.svg",
    label: "JSON",
    label_ru: "JSON",
    label_en: "JSON",
    value: "JSON",
  },

  {
    icon: "phone.svg",
    label: "Internation Phone",
    label_ru: "Международный телефон",
    label_en: "Internation Phone",
    label_uz: "Jahon telefon raqami",
    value: "INTERNATION_PHONE",
  },
  {
    icon: "icons.svg",
    label: "Icon",
    label_ru: "Иконка",
    label_en: "Icon",
    label_uz: "Ikona",
    value: "ICON",
  },
  {
    icon: "qrcode.svg",
    label: "Qr",
    label_ru: "Qr",
    label_en: "Qr",
    label_uz: "Qr",
    value: "QR",
  },
  // {
  //   icon: "barcode.svg",
  //   label: "Barcode",
  //   value: "BARCODE",
  // },
  // {
  //   icon: "barcode.svg",
  //   label: "Codabar",
  //   value: "CODABAR",
  // },
  // {
  //   icon: "fill.svg",
  //   label: "Autofill",
  //   value: "AUTOFILL",
  // },
  // {
  //   icon: "barcode.svg",
  //   label: "Scan-barcode",
  //   value: "SCAN_BARCODE",
  // },
  // {
  //   icon: "teeth.svg",
  //   label: "Dentist",
  //   value: "DENTIST",
  // },
  {
    icon: "colon-sign.svg",
    label: "Color",
    label_ru: "Цвет",
    label_en: "Color",
    label_uz: "Rang",
    value: "COLOR",
  },
  // {
  //   label: "Increment",
  //   value: "INCREMENT",
  //   icon: "envelope.svg",
  // },
  // {
  //   label: "Color",
  //   value: "COLOR",
  //   icon: "colon-sign.svg",
  // },
  // {
  //   label: "Barcode",
  //   value: "BARCODE",
  //   icon: "barcode.svg",
  // },
];

export const fieldFormats = [
  {
    label: "Text",
    value: "SINGLE_LINE",
    icon: "minus.svg",
  },
  {
    label: "Number",
    value: "NUMBER",
    icon: "hashtag.svg",
  },
  {
    label: "Date",
    value: "DATE",
    icon: "calendar.svg",
  },
  {
    label: "Dropdown",
    value: "MULTISELECT",
    icon: "square-caret-down.svg",
  },
  {
    label: "Formula frontend",
    value: "FORMULA_FRONTEND",
    icon: "plus-minus.svg",
  },
  {
    label: "Formula backend",
    value: "FORMULA",
    icon: "square-root-variable.svg",
  },
  {
    label: "Relation",
    value: "RELATION",
    icon: "link-simple.svg",
  },
  {
    label: "File",
    value: "FILE",
    icon: "file.svg",
  },
  {
    label: "Map",
    value: "MAP",
    icon: "map-pin.svg",
  },
  {
    label: "Phone",
    value: "INTERNATION_PHONE",
    icon: "phone.svg",
  },
  {
    label: "Email",
    value: "EMAIL",
    icon: "envelope.svg",
  },
  {
    label: "Password",
    value: "PASSWORD",
    icon: "lock.svg",
  },
  {
    label: "Color",
    value: "COLOR",
    icon: "colon-sign.svg",
  },
  // {
  //   label: "File",
  //   value: "BARCODE",
  //   icon: "barcode.svg",
  // },
  {
    icon: "image.svg",
    label: "File",
    value: "PHOTO",
  },
  {
    icon: "video.svg",
    label: "File",
    value: "VIDEO",
  },
  {
    icon: "file.svg",
    label: "File",
    value: "FILE",
  },
  {
    label: "Date",
    value: "DATE",
    icon: "minus.svg",
  },
  {
    label: "Date",
    value: "DATE_TIME_WITHOUT_TIME_ZONE",
    icon: "minus.svg",
  },
  {
    label: "Date",
    value: "TIME",
    icon: "minus.svg",
  },
  {
    label: "Date",
    value: "DATE_TIME",
    icon: "minus.svg",
  },
  {
    label: "Text",
    value: "MULTI_LINE",
    icon: "minus.svg",
  },
  {
    label: "Number",
    value: "FLOAT",
    icon: "minus.svg",
  },
  {
    label: "Relation",
    value: "LOOKUP",
    icon: "minus.svg",
  },
];

export const math = [
  {
    label: "plus",
    value: "+",
  },
  // {
  //   label: "minus",
  //   value: "-",
  // },
  {
    label: "multiplication",
    value: "*",
  },
  // {
  //   label: "division",
  //   value: "/",
  // },
];

export const relationFieldButtons = [
  {
    label: "Schema",
    value: "SCHEMA",
  },

  {
    label: "Additional",
    value: "AUTOFILL",
  },
  {
    label: "Auto filter",
    value: "AUTO_FILTER",
  },
];


const formulaFormats = [
  {
    label: "Formula frontend",
    label_ru: "Формула frontend",
    label_en: "Formula frontend",
    label_uz: "Formula frontend",
    value: "FORMULA_FRONTEND",
    icon: "plus-minus.svg",
  },
  {
    label: "Formula backend",
    label_ru: "Формула backend",
    label_en: "Formula backend",
    label_uz: "Formula backend",
    value: "FORMULA",
    icon: "plus-minus.svg",
  },
];

export const fieldButtons = [
  {
    label: "Schema",
    value: "SCHEMA",
  },
  {
    label: "Validation",
    value: "VALIDATION",
  },
  {
    label: "Autofill",
    value: "AUTOFILL",
  },
  {
    label: "Auto filter",
    value: "AUTO_FILTER",
  },

  {
    label: "Field Hide",
    value: "FIELD_HIDE",
  },
];

export const formatIncludes = [
  "NUMBER",
  "DATE",
  "SINGLE_LINE",
  "FILE",
  "FLOAT",
  "DATE_TIME",
  "DATE_TIME_WITHOUT_TIME_ZONE",
  "TIME",
  "PHOTO",
  "MULTI_IMAGE",
  "MULTI_FILE",
  "VIDEO",
  "MULTI_LINE",
  "INCREMENT",
  "MAP",
  "POLYGON",
  "RANDOM_TEXT",
  "PRIMARY_KEY",
  "SWITCH",
  "MULTISELECT",
  "FORMULA_FRONTEND",
  "FORMULA",
];

export const FormatOptionType = (item) => {
  switch (item) {
    case "DATE":
      return dateFieldFormats;
    case "DATE_TIME":
      return dateFieldFormats;
    case "DATE_TIME_WITHOUT_TIME_ZONE":
      return dateFieldFormats;
    case "TIME":
      return dateFieldFormats;
    case "FILE":
      return fileFieldFormats;
    case "PHOTO":
      return fileFieldFormats;
    case "VIDEO":
      return fileFieldFormats;
    case "SINGLE_LINE":
      return textFieldFormats;
    case "INCREMENT":
      return incrementFieldFormats;
    case "MAP":
      return mapFieldFormats;
    case "MULTI_LINE":
      return textFieldFormats;
    case "NUMBER":
      return numberFieldFormats;
    case "FLOAT":
      return numberFieldFormats;
    // case "BARCODE":
    //   return barcodeFieldFormats;
    case "PRIMARY_KEY":
      return PrimaryKeyFieldFormats;
    case "SWITCH":
      return toggleButtonFormats;
    case "MULTISELECT":
      return dropDownFormats;
    case "FORMULA_FRONTEND":
      return formulaFormats;
    case "FORMULA":
      return formulaFormats;

    default:
      return null;
  }
};
export const FormatTypes = (format) => {
  switch (format) {
    case "RELATION":
      return true;
    case "LOOKUP":
      return true;
    case "LOOKUPS":
      return true;
    default:
      return false;
  }
};
export const ValueTypes = (value) => {
  switch (value) {
    case "Many2One":
      return true;
    case "Many2Many":
      return true;
    case "Recursive":
      return true;
    default:
      return false;
  }
};
