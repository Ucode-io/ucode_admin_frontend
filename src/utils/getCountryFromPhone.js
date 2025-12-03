const countryCodeMap = {
  "1": "US",      // +1 — США/Канада (по умолчанию US)
  "7": "RU",      // +7 — Россия / Казахстан historically (возьмём RU)
  "20": "EG",
  "27": "ZA",
  "30": "GR",
  "31": "NL",
  "32": "BE",
  "33": "FR",
  "34": "ES",
  "36": "HU",
  "39": "IT",
  "40": "RO",
  "41": "CH",
  "43": "AT",
  "44": "GB",
  "45": "DK",
  "46": "SE",
  "47": "NO",
  "48": "PL",
  "49": "DE",
  "51": "PE",
  "52": "MX",
  "53": "CU",
  "54": "AR",
  "55": "BR",
  "56": "CL",
  "57": "CO",
  "58": "VE",
  "60": "MY",
  "61": "AU",
  "62": "ID",
  "63": "PH",
  "64": "NZ",
  "65": "SG",
  "66": "TH",
  "81": "JP",
  "82": "KR",
  "84": "VN",
  "86": "CN",
  "90": "TR",
  "91": "IN",
  "92": "PK",
  "93": "AF",
  "94": "LK",
  "95": "MM",
  "98": "IR",
  "211": "SS",
  "212": "MA",
  "213": "DZ",
  "216": "TN",
  "218": "LY",
  "220": "GM",
  "221": "SN",
  "222": "MR",
  "223": "ML",
  "224": "GN",
  "225": "CI",
  "226": "BF",
  "227": "NE",
  "228": "TG",
  "229": "BJ",
  "230": "MU",
  "231": "LR",
  "232": "SL",
  "233": "GH",
  "234": "NG",
  "235": "TD",
  "236": "CF",
  "237": "CM",
  "238": "CV",
  "239": "ST",
  "240": "GQ",
  "241": "GA",
  "242": "CG",
  "243": "CD",
  "244": "AO",
  "245": "GW",
  "246": "IO",
  "248": "SC",
  "249": "SD",
  "250": "RW",
  "251": "ET",
  "252": "SO",
  "253": "DJ",
  "254": "KE",
  "255": "TZ",
  "256": "UG",
  "257": "BI",
  "258": "MZ",
  "260": "ZM",
  "261": "MG",
  "262": "RE",
  "263": "ZW",
  "264": "NA",
  "265": "MW",
  "266": "LS",
  "267": "BW",
  "268": "SZ",
  "269": "KM",
  // Центральная Азия / примеры:
  "373": "MD",
  "374": "AM",
  "375": "BY",
  "376": "AD",
  "377": "MC",
  "378": "SM",
  "380": "UA",
  "381": "RS",
  "385": "HR",
  "386": "SI",
  "387": "BA",
  "389": "MK",
  "420": "CZ",
  "421": "SK",
  "423": "LI",
  "398": "KZ",
  "762": "TJ",
  "996": "KG",
  // Узбекистан
  "998": "UZ"
  // При желании добавьте остальные коды сюда...
};

/**
 * @param {string} phone
 * @returns {{label: string, flag: string} | null}
 */
export default function getCountryFromPhone(phone) {
  if (!phone || typeof phone !== "string") return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  const codes = Object.keys(countryCodeMap).sort((a, b) => b.length - a.length);

  for (const code of codes) {
    if (digits.startsWith(code)) {
      const iso2 = countryCodeMap[code];
      return {
        label: iso2,
        flag: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${iso2}.svg`
      };
    }
  }
  return null;
}
