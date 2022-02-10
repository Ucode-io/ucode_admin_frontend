export default function getDataByLang(lang, key, data) {
  return data?.[`${key}_${lang}`];
}
