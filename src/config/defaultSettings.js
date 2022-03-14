import logo from "assets/icons/logo_blue.png";
import BrandLogo from "assets/icons/BrandLogo.svg";

const defaultSettings = {
  baseURL: process.env.REACT_APP_URL, // base url for whole project
  baseURL2: process.env.REACT_APP_URL2, // base url for whole project
  mode: "default", // mode => default | light | semi-dark
  avatar: "",
  fixedHeader: true, // sticky header
  fixSiderbar: true, // sticky sidebar
  project: {
    title: "Delever",
    logo: logo,
    title_svg: BrandLogo,
    createdBy: "Udevs company",
  },
  colors: {
    primary: "rgba(64, 148, 247, 1)",
    background: "rgba(220, 233, 249, 1)",
    secondary: "rgba(110, 139, 183, 1)",
    background_2: "rgba(229, 233, 235, 1)",
    black: "rgba(48, 57, 64, 1)",
    grey: "rgba(132, 145, 154, 1)",
    white: "rgba(255, 255, 255, 1)",
    success: "rgba(56, 217, 185, 1)",
    purple: "rgba(196, 121, 243, 1)",
    yellow: "rgba(248, 221, 78, 1)",
    error: "rgba(247, 102, 89, 1)",
  },
  elementsPerPage: 10,
  supportPhonenumber: "+998 (99) 823-99-13",
};

document.title = defaultSettings.project.title;

export default defaultSettings;

export const inputTypes = [
  { value: "radio", label: "one.of.the.list" },
  { value: "checkbox", label: "several.from.the.list" },
  { value: "boolean", label: "yes.no" },
  { value: "string", label: "text.field" },
  { value: "textarea", label: "textarea" },
  { value: "number", label: "numeric.field" },
  { value: "date", label: "date" },
  { value: "file", label: "file" },
  { value: "map", label: "map" },
];

export const actionTypes = {
  ACCEPT: { color: "green" },
  ASSIGN: { color: "#4094f7" },
  APPROVE: { color: "green" },
  REJECT: { color: "red" },
  EDIT: { color: "#4094f7" },
  REVERT: { color: "red" },
  SET_AS_READY: { color: "#4094f7" },
  SEND_TO_AUCTION: { color: "#4094f7" },
};

export const createValidatorByType = (type, yup, validation) => {
  if (type === "boolean") {
    return yup.bool(validation);
  } else if (type === "checkbox" || type === "map") {
    return yup.object(validation);
  }
  return yup.string(validation);
};

export const getObjectInputTypes = (t) => {
  return {
    radio: t("one.of.the.list"),
    checkbox: t("several.from.the.list"),
    boolean: t("yes.no"),
    string: t("text.field"),
    textarea: t("textarea"),
    number: t("numeric.field"),
    date: t("date"),
    file: t("file"),
    map: t("map"),
  };
};

export const getInputTypes = (t) => {
  return inputTypes.map((val) => ({ ...val, label: t(val.label) }));
};

export const newEntityStatusId = "6103bb05dd7aa74db9a779a6";
export const newEntityStatusId2 = "614c2596b074b551d49290dd";
export const mapPropertyId = "6113589b73bf6fe15aaef566";
export const mapTypePropertyId = "6113590973bf6fe15aaef567";
export const rejectPropertyIdFile = "612dcae08eb3597edfbded32";
export const rejectPropertyIdDescription = "612dcb378eb3597edfbded33";
export const mapboxToken =
  "pk.eyJ1IjoiYWxnb3NkZXYiLCJhIjoiY2tydmtndnZhMDdodDJ3cnY2d2xyM25iayJ9.MQntLXZai3HeMrHo7I-hAA";

export const chartColors = {
  blue: "#6B94D2",
  green: "#80CE7F",
  red: "#FF0000",
  orange: "#FF7F50",
  yellow: "#FFFF00",
  stopColor: "#E5E5E5",
  purple: "#800080"
};
