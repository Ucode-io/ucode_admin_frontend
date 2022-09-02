

// export const fieldTypes = [
//   "SINGLE_LINE",
//   "MULTI_LINE",
//   "EMAIL",
//   "PHONE",
//   "PICK_LIST",
//   "MULTISELECT",
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
  "SWITCH",
  "PHOTO",
  "PHONE",
  "ICON",
  "PASSWORD",
  "FORMULA"
]

export const fieldTypesOptions = [
  {
    label: 'Text',
    options: [
      {
        label: "Single line",
        value: "SINGLE_LINE"
      },
      {
        label: "Multi line",
        value: "MULTI_LINE"
      },
    ]
  },
  {
    label: 'Date',
    options: [
      {
        label: "Date",
        value: "DATE"
      },
      {
        label: "Time",
        value: "TIME"
      },
      {
        label: "Date time",
        value: "DATE_TIME"
      },
    ]
  },
  {
    label: 'Number',
    options: [
      {
        label: "Number",
        value: "NUMBER"
      },
    ]
  },
  {
    label: 'Input',
    options: [
      {
        label: "Checkbox",
        value: "CHECKBOX"
      },
      {
        label: "Switch",
        value: "SWITCH"
      },
    ]
  },
  {
    label: 'Select',
    options: [
      {
        label: "Picklist",
        value: "PICK_LIST"
      },
      {
        label: "Multi select",
        value: "MULTISELECT"
      },
    ]
  },
  {
    label: 'File',
    options: [
      {
        label: "Photo",
        value: "PHOTO"
      },
    ]
  },
  {
    label: 'Other',
    options: [
      {
        label: "Phone",
        value: "PHONE"
      },
      {
        label: "Email",
        value: "EMAIL"
      },
      {
        label: "Icon",
        value: "ICON"
      },
      {
        label: "Formul",
        value: "FORMULA"
      },
      {
        label: "Password",
        value: "PASSWORD"
      },
    ]
  },

]