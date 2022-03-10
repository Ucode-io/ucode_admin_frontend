import i18n from "locales/i18n";

var translate = function (str) {
  return i18n.t(str);
};

export default function genSelectOption(val = "") {
  if (Array.isArray(val)) {
    return val.map((el) => ({ label: translate(el), value: el }));
  }

  return { label: translate(val), value: val };
}
