// export const fieldTypes = [
//   "SINGLE_LINE",
//   "MULTI_LINE",
//   "EMAIL",
//   "PHONE",
//   "PICK_LIST",
//   "MULTISELECT",
//   "MAP"
//   "DATE",
//   "DATE_TIME",
//   "NUMBER",
//   "CURRENCY",
//   "DECIMAL",
//   "PERCENT",
//   "CHECKBOX",
//   "URL",
//   "FORMULA",
//   "LOOKUP",
// "PHOTO"
// ]

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
        icon: "clock.svg",
        label: "Date time (without timezone)",
        value: "DATE_TIME_WITHOUT_TIME_ZONE",
      },
      {
        icon: "clock.svg",
        label: "Time",
        value: "TIME",
      },
      {
        icon: "business-time.svg",
        label: "Date time",
        value: "DATE_TIME",
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
        label: "Multi select",
        value: "MULTISELECT",
      },
      {
        icon: "list-check.svg",
        label: "Multi select V2",
        value: "MULTISELECT_V2",
      },
    ],
  },
  {
    label: "Map",
    options: [
      {
        icon: "map-pin.svg",
        label: "Map",
        value: "MAP",
      },
    ],
  },

  {
    label: "File",
    options: [
      {
        icon: "image.svg",
        label: "Photo",
        value: "PHOTO",
      },
      {
        icon: "image.svg",
        label: "Custom Image",
        value: "CUSTOM_IMAGE",
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
  {
    label: "Other",
    options: [
      {
        icon: "arrow-up-9-1.svg",
        label: "FLOAT_NOLIMIT",
        value: "FLOAT_NOLIMIT",
      },
      {
        icon: "arrow-up-9-1.svg",
        label: "Increment ID",
        value: "INCREMENT_ID",
      },
      {
        icon: "arrow-up-a-z.svg",
        label: "Increment number",
        value: "INCREMENT_NUMBER",
      },
      {
        icon: "phone.svg",
        label: "Phone",
        value: "PHONE",
      },
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
      {
        icon: "barcode.svg",
        label: "Barcode",
        value: "BARCODE",
      },
      {
        icon: "barcode.svg",
        label: "Codabar",
        value: "CODABAR",
      },
      {
        icon: "fill.svg",
        label: "Autofill",
        value: "AUTOFILL",
      },
      {
        icon: "barcode.svg",
        label: "Scan-barcode",
        value: "SCAN_BARCODE",
      },
      {
        icon: "teeth.svg",
        label: "Dentist",
        value: "DENTIST",
      },
      {
        icon: "colon-sign.svg",
        label: "Color",
        value: "COLOR",
      },
    ],
  },
];
