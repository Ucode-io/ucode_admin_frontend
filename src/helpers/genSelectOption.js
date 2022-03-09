export default function genSelectOption(val = "", translate = function () {}) {
  if (Array.isArray(val)) {
    return val.map((el) => ({ label: translate(el), value: el }));
  }
  return { label: translate(val), value: val };
}
