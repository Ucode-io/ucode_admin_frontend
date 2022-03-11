import * as Yup from "yup";
import i18n from "locales/i18n";

function t(str) {
  return i18n.t(str);
}

var phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

var loginRegExp = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/;

var Fields = {
  default: Yup.string()
    .trim(t("spaces.error"))
    .strict(true)
    .required(t("required.field.error")),
  number: Yup.number()
    .strict(true)
    .max(1000000000, t("range.max"))
    .required(t("required.field.error")),
  numberOptional: Yup.number().strict(false).max(100000000, t("range.max")),
  mixed: Yup.mixed().strict(true).required(t("required.field.error")),
  array: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string(),
        value: Yup.string(),
      }),
    )
    .nullable(true)
    .required(t("required.field.error")),
  arrayStr: Yup.array()
    .of(Yup.string())
    .nullable(true)
    .required(t("required.field.error")),
  multiple_select: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string(),
        value: Yup.string(),
      }),
    )
    .required(t("required.field.error")),
  selectItem: Yup.object()
    .shape({
      label: Yup.string(),
      value: Yup.string(),
    })
    .nullable(true)
    .strict(true)
    .required(t("required.field.error")),
  first_name: Yup.string()
    .trim(t("spaces.error"))
    .strict(true)
    .required(t("required.field.error")),
  last_name: Yup.string().trim(t("spaces.error")).strict(true),
  middle_name: Yup.string().trim(t("spaces.error")).strict(true),
  login: Yup.string()
    .required(t("required.field.error"))
    .min(6, t("login.too.short"))
    .matches(/[a-zA-Z]/, t("only.latin.letters")),
  loginRegExp: Yup.string()
    .required(t("required.field.error"))
    .min(6, t("login.too.short"))
    .matches(loginRegExp, t("invalid.login")),
  password: Yup.string()
    .min(6, t("password.too.short"))
    .required(t("required.field.error")),
  address: Yup.string().trim(t("spaces.error")).strict(true),
  email: Yup.string()
    .email(t("invalid.email"))
    .required(t("required.field.error")),
  phone_number: Yup.string()
    .min(5, t("range.min"))
    .max(19, t("invalid.number"))
    .matches(phoneRegExp, t("invalid.number"))
    .required(t("required.field.error")),
  price: Yup.number()
    .required(t("required.field.error"))
    .test("Is positive?", t("invalid.price"), (value) => value > 0),
  emailOptional: Yup.string().email(t("invalid.email")),
};

export default function validate(field = "default") {
  return Fields[field];
}
