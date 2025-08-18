import { Parser, SUPPORTED_FORMULAS } from "hot-formula-parser";

export const CUSTOM_FUNCTIONS = [
  "ADD","SUBTRACT","MULTIPLE","MOD","POW","DIVIDE","MIN","MAX","SUM","MEDIAN",
  "CBRT","EXP","LN","LOG10","LOG2","SIGN","PI","E","MEAN",
  "TONUMBER","NAME","EMAIL","SUBSTRING","CONTAINS","TEST","MATCH","REPLACE","REPLACEALL",
  "LOWER","UPPER","TRIM","ABS","ROUND","CEIL","FLOOR","SQRT","REPEAT","CONCAT",
  "JOIN","SPLIT","IF","FORMAT","IFS","AND","EQUAL","UNEQUAL","LET","LETS","OR",
  "NOW","TODAY","MINUTE","HOUR","DAY","DATE","WEEK","MONTH","NOT","EMPTY","LENGTH",
  "DATEADD","DATESUBTRACT","DATEBETWEEN","DATERANGE","DATESTART","DATEEND","TIMESTAMP",
  "FROMTIMESTAMP","PARSEDATE","FORMATDATE","INCLUDES","AT","FIRST","LAST","SLICE",
  "SORT","REVERSE","UNIQUE","FILTER","SOME","EVERY","MAP","FLAT","COUNT"
]

export const FIELD_TYPE_MAP = {
  SINGLE_LINE: "TEXT",
  MULTI_LINE: "TEXT",
  EMAIL: "TEXT",
  INTERNATION_PHONE: "TEXT",
  LOOKUP: "TEXT",
  TEXT: "TEXT",

  LOOKUPS: "ARRAY",
  MULTISELECT: "ARRAY",

  NUMBER: "NUMBER",

  DATE: "DATE",
  TIME: "DATE",
  DATE_TIME: "DATE",
  DATE_TIME_WITHOUT_TIME_ZONE: "DATE",

  CHECKBOX: "BOOLEAN",
  SWITCH: "BOOLEAN",
};

export const CUSTOM_FUNCTIONS_META = [
  { name: "IFS", snippet: "IFS(condition1, value1, [condition2, value2, ...], defaultValue)", hint: "Линейные условия" },
  { name: "EMPTY", snippet: "EMPTY(value)", hint: "Проверка пустоты" },
  { name: "LENGTH", snippet: "LENGTH(textOrArray)", hint: "Длина строки или массива" },
  { name: "FORMAT", snippet: "FORMAT(value)", hint: "Форматирование значения в строку" },
  { name: "EQUAL", snippet: "EQUAL(a, b)", hint: "Сравнение на равенство" },
  { name: "UNEQUAL", snippet: "UNEQUAL(a, b)", hint: "Сравнение на неравенство" },
  { name: "LET", snippet: "LET(name, value, expressionAsString)", hint: "Временная переменная (см. примечание)" },
  { name: "LETS", snippet: "LETS(name1, value1, name2, value2, expressionAsString)", hint: "Несколько переменных (см. примечание)" },
  { name: "WEEK", snippet: "WEEK(date)", hint: "Номер недели (WEEKNUM)" },
  { name: "DATEADD", snippet: "DATEADD(date, amount, unit)", hint: "Плюс интервал к дате" },
  { name: "DATESUBTRACT", snippet: "DATESUBTRACT(date, amount, unit)", hint: "Минус интервал от даты" },
  { name: "DATEBETWEEN", snippet: "DATEBETWEEN(date1, date2, unit)", hint: "Разница дат" },
  { name: "DATERANGE", snippet: "DATERANGE(start, end)", hint: "Диапазон дат" },
  { name: "DATESTART", snippet: "DATESTART(range)", hint: "Начало диапазона" },
  { name: "DATEEND", snippet: "DATEEND(range)", hint: "Конец диапазона" },
  { name: "TIMESTAMP", snippet: "TIMESTAMP()", hint: "Unix ms сейчас" },
  { name: "FROMTIMESTAMP", snippet: "FROMTIMESTAMP(ms)", hint: "Дата из Unix ms" },
  { name: "FORMATDATE", snippet: "FORMATDATE(date, pattern, [timezone])", hint: "Формат даты" },
  { name: "PARSEDATE", snippet: "PARSEDATE(isoText)", hint: "Парсинг ISO строки" },
  { name: "AT", snippet: "AT(list, index)", hint: "Элемент по индексу (0-based)" },
  { name: "FIRST", snippet: "FIRST(list)", hint: "Первый элемент" },
  { name: "LAST", snippet: "LAST(list)", hint: "Последний элемент" },
  { name: "SORT", snippet: "SORT(list, [expressionAsString])", hint: "Сортировка, опционально ключ" },
  { name: "SLICE", snippet: "SLICE(list, start, [end])", hint: "Срез массива" },
  { name: "REVERSE", snippet: "REVERSE(list)", hint: "Реверс массива" },
  { name: "FINDINDEX", snippet: "FINDINDEX(list, predicateAsString)", hint: "Индекс по условию" },
  { name: "FILTER", snippet: "FILTER(list, predicateAsString)", hint: "Фильтр по условию" },
  { name: "TONUMBER", snippet: "TONUMBER(text)", hint: "Парсинг числа" },
];

const FORMULA_SIG = Object.fromEntries(
  Object.keys(SUPPORTED_FORMULAS).map(fn => [
    fn.toUpperCase(),
    { variadic: true } // базовый вариант: считаем что все поддерживаются
  ])
);

const CUSTOM_SIG = {
  IFS: { variadic: true, min: 3 },
  EMPTY: { min: 1, max: 1 },
  LENGTH: { min: 1, max: 1 },
  FORMAT: { min: 1, max: 1 },
  EQUAL: { min: 2, max: 2 },
  UNEQUAL: { min: 2, max: 2 },
  LET: { min: 3, max: 3 },
  LETS: { variadic: true, min: 3 },
  WEEK: { min: 1, max: 1 },
  DATEADD: { min: 3, max: 3 },
  DATESUBTRACT: { min: 3, max: 3 },
  DATEBETWEEN: { min: 3, max: 3 },
  DATERANGE: { min: 2, max: 2 },
  DATESTART: { min: 1, max: 1 },
  DATEEND: { min: 1, max: 1 },
  TIMESTAMP: { min: 0, max: 0 },
  FROMTIMESTAMP: { min: 1, max: 1 },
  FORMATDATE: { min: 2, max: 3 },
  PARSEDATE: { min: 1, max: 1 },
  AT: { min: 2, max: 2 },
  FIRST: { min: 1, max: 1 },
  LAST: { min: 1, max: 1 },
  SORT: { min: 1, max: 2 },
  SLICE: { min: 2, max: 3 },
  REVERSE: { min: 1, max: 1 },
  FINDINDEX: { min: 2, max: 2 },
  FILTER: { min: 2, max: 2 },
  TONUMBER: { min: 1, max: 1 },
  FLAT: { min: 1, max: 1 }
}

export const SIG = {
  ...FORMULA_SIG,
  ...CUSTOM_SIG
};

// ------------------------------
// Вспомогательные функции для дат/типов
// ------------------------------

export function countArgsInside(code, startIdx){
  // Находим скобки и считаем запятые верхнего уровня
  let level = 0, args = 1;
  for (let i = startIdx; i < code.length; i++){
    const ch = code[i];
    if (ch === '(') level++;
    else if (ch === ')') { level--; if (level === 0) return args; }
    else if (ch === ',' && level === 1) args++;
  }
  return 0; // не закрыто
}


function isArray(v) { return Array.isArray(v); }
function isDate(v) { return v instanceof Date && !isNaN(v.valueOf()); }
function toDate(v) {
  if (isDate(v)) return v;
  if (typeof v === 'number') return new Date(v);
  if (typeof v === 'string') {
    const d = new Date(v);
    if (!isNaN(d.valueOf())) return d;
  }
  return null;
}

function clampInt(n) { return Number.isFinite(n) ? Math.trunc(n) : NaN; }

const UNITS = {
  years: 'years', quarters: 'quarters', months: 'months', weeks: 'weeks', days: 'days', hours: 'hours', minutes: 'minutes'
};

function addDate(base, amount, unit) {
  const d = new Date(base.valueOf());
  const n = clampInt(amount);
  if (!Number.isFinite(n)) return null;
  switch (unit) {
    case 'years': d.setFullYear(d.getFullYear() + n); break;
    case 'quarters': d.setMonth(d.getMonth() + n * 3); break;
    case 'months': d.setMonth(d.getMonth() + n); break;
    case 'weeks': d.setDate(d.getDate() + n * 7); break;
    case 'days': d.setDate(d.getDate() + n); break;
    case 'hours': d.setHours(d.getHours() + n); break;
    case 'minutes': d.setMinutes(d.getMinutes() + n); break;
    default: return null;
  }
  return d;
}

function diffDates(a, b, unit) {
  const ms = a.valueOf() - b.valueOf();
  switch (unit) {
    case 'minutes': return Math.trunc(ms / (60 * 1000));
    case 'hours': return Math.trunc(ms / (60 * 60 * 1000));
    case 'days': return Math.trunc(ms / (24 * 60 * 60 * 1000));
    case 'weeks': return Math.trunc(ms / (7 * 24 * 60 * 60 * 1000));
    case 'months': return (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth());
    case 'quarters': return Math.trunc(((a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth())) / 3);
    case 'years': return a.getFullYear() - b.getFullYear();
    default: return NaN;
  }
}

function weekNumber(date) {
  // ISO week (Monday-first)
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // 1..7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function pad2(n){ return String(n).padStart(2,'0'); }
function formatWithPattern(date, pattern = 'YYYY-MM-DD HH:mm', tz) {
  // Простая замена токенов; для TZ используем Intl только для имени зоны (без сдвига)
  const d = date;
  const map = {
    YYYY: String(d.getFullYear()),
    MM: pad2(d.getMonth()+1),
    DD: pad2(d.getDate()),
    HH: pad2(d.getHours()),
    mm: pad2(d.getMinutes()),
  };
  let out = pattern;
  for (const k of Object.keys(map)) out = out.replaceAll(k, map[k]);
  if (tz) out += ` ${tz}`;
  return out;
}

// Диапазон дат представляем структурой
function makeRange(start, end){ return { __type: 'DATE_RANGE', start, end }; }
function isRange(v){ return v && typeof v === 'object' && v.__type === 'DATE_RANGE'; }

export function installCustomFunctions(parser) {
  // 1. IFS
  parser.setFunction('IFS', function (params) {
    if (!params || params.length < 1) return { error: '#N/A' };
    // пары (cond, value) ... и финальный defaultValue опционально
    for (let i = 0; i + 1 < params.length; i += 2) {
      const cond = params[i];
      const val = params[i+1];
      if (typeof cond === 'boolean' && cond) return val;
    }
    // defaultValue если есть нечётное кол-во
    if (params.length % 2 === 1) return params[params.length-1];
    return false;
  });

  // 2. EMPTY
  parser.setFunction('EMPTY', function (params) {
    const v = params[0];
    if (v === null || v === undefined) return true;
    if (typeof v === 'string' && v.trim() === '') return true;
    if (typeof v === 'number' && (Number.isNaN(v) || v === 0)) return true;
    if (Array.isArray(v) && v.length === 0) return true;
    if (typeof v === 'object' && !Array.isArray(v)) return Object.keys(v).length === 0;
    return false;
  });

  // 3. LENGTH
  parser.setFunction('LENGTH', function (params) {
    const v = params[0];
    if (Array.isArray(v)) return v.length;
    return String(v ?? '').length;
  });

  // 4. FORMAT
  parser.setFunction('FORMAT', function (params) {
    const v = params[0];
    if (isDate(v)) return formatWithPattern(v, 'MMMM DD, YYYY HH:mm');
    return String(v);
  });

  // 5. EQUAL (EQ в parser уже есть, но делаем алиас)
  parser.setFunction('EQUAL', function (params) {
    return params[0] === params[1];
  });

  // 6. UNEQUAL
  parser.setFunction('UNEQUAL', function (params) {
    return params[0] !== params[1];
  });

  // 7. LET (ВАЖНО: expression должен быть строкой формулы)
  parser.setFunction('LET', function (params, info) {
    const [name, value, expr] = params;
    if (typeof name !== 'string' || typeof expr !== 'string') return { error: '#VALUE!' };
    const prev = info && info.variables ? { ...info.variables } : {};
    const child = new Parser();
    // перенесём функции и переменные
    child.on('callFunction', (fn, p) => parser.callFunction(fn, p));
    child.on('callVariable', (v) => parser.callVariable(v));
    child.setVariable(name, value);
    const res = child.parse(expr);
    return res.error ? { error: res.error } : res.result;
  });

  // 8. LETS (expr как строка)
  parser.setFunction('LETS', function (params) {
    if (params.length < 3) return { error: '#N/A' };
    const expr = params[params.length - 1];
    if (typeof expr !== 'string') return { error: '#VALUE!' };
    const child = new Parser();
    child.on('callFunction', (fn, p) => parser.callFunction(fn, p));
    child.on('callVariable', (v) => parser.callVariable(v));
    for (let i = 0; i + 1 < params.length - 1; i += 2) {
      const n = params[i];
      const v = params[i+1];
      if (typeof n === 'string') child.setVariable(n, v);
    }
    const res = child.parse(expr);
    return res.error ? { error: res.error } : res.result;
  });

  // 9. WEEK (ISO week number)
  parser.setFunction('WEEK', function (params) {
    const d = toDate(params[0]);
    if (!d) return { error: '#VALUE!' };
    return weekNumber(d);
  });

  // 10. DATEADD
  parser.setFunction('DATEADD', function (params) {
    const d = toDate(params[0]);
    const n = Number(params[1]);
    const unit = String(params[2] || '').toLowerCase();
    if (!d || !(unit in UNITS)) return { error: '#VALUE!' };
    const out = addDate(d, n, unit);
    return out ?? { error: '#VALUE!' };
  });

  // 11. DATESUBTRACT
  parser.setFunction('DATESUBTRACT', function (params) {
    const d = toDate(params[0]);
    const n = Number(params[1]);
    const unit = String(params[2] || '').toLowerCase();
    if (!d || !(unit in UNITS)) return { error: '#VALUE!' };
    const out = addDate(d, -n, unit);
    return out ?? { error: '#VALUE!' };
  });

  // 12. DATEBETWEEN
  parser.setFunction('DATEBETWEEN', function (params) {
    const a = toDate(params[0]);
    const b = toDate(params[1]);
    const unit = String(params[2] || '').toLowerCase();
    if (!a || !b || !(unit in UNITS)) return { error: '#VALUE!' };
    return diffDates(a, b, unit);
  });

  // 13. DATERANGE
  parser.setFunction('DATERANGE', function (params) {
    const a = toDate(params[0]);
    const b = toDate(params[1]);
    if (!a || !b) return { error: '#VALUE!' };
    return makeRange(a, b);
  });

  // 14. DATESTART
  parser.setFunction('DATESTART', function (params) {
    const r = params[0];
    if (!isRange(r)) return { error: '#VALUE!' };
    return r.start;
  });

  // 15. DATEEND
  parser.setFunction('DATEEND', function (params) {
    const r = params[0];
    if (!isRange(r)) return { error: '#VALUE!' };
    return r.end;
  });

  // 16. TIMESTAMP
  parser.setFunction('TIMESTAMP', function () { return Date.now(); });

  // 17. FROMTIMESTAMP (без секунд и миллисекунд)
  parser.setFunction('FROMTIMESTAMP', function (params) {
    const ms = Number(params[0]);
    if (!Number.isFinite(ms)) return { error: '#VALUE!' };
    const d = new Date(ms);
    d.setSeconds(0, 0);
    return d;
  });

  // 18. FORMATDATE(date, pattern, timezone?)
  parser.setFunction('FORMATDATE', function (params) {
    const d = toDate(params[0]);
    const pattern = params[1] ? String(params[1]) : 'YYYY-MM-DD HH:mm';
    const tz = params[2] ? String(params[2]) : undefined;
    if (!d) return { error: '#VALUE!' };
    return formatWithPattern(d, pattern, tz);
  });

  // 19. PARSEDATE
  parser.setFunction('PARSEDATE', function (params) {
    const s = String(params[0] ?? '');
    const d = new Date(s);
    if (isNaN(d.valueOf())) return { error: '#VALUE!' };
    return d;
  });

  // 20. AT(list, index) — 0-based
  parser.setFunction('AT', function (params) {
    const list = params[0];
    const idx = clampInt(params[1]);
    if (!Array.isArray(list) || !Number.isFinite(idx)) return { error: '#VALUE!' };
    return list[idx];
  });

  // 21. FIRST
  parser.setFunction('FIRST', function (params) {
    const list = params[0];
    if (!Array.isArray(list)) return { error: '#VALUE!' };
    return list[0];
  });

  // 22. LAST
  parser.setFunction('LAST', function (params) {
    const list = params[0];
    if (!Array.isArray(list)) return { error: '#VALUE!' };
    return list[list.length - 1];
  });

  // Мини-исполнитель выражения по элементу массива
  function evalWithCurrent(expr, current, baseParser) {
    if (typeof expr !== 'string') return { error: '#VALUE!' };
    const p = new Parser();
    p.on('callFunction', (fn, ps) => baseParser.callFunction(fn, ps));
    p.on('callVariable', (v) => baseParser.callVariable(v));
    p.setVariable('current', current);
    const res = p.parse(expr);
    return res;
  }

  // 23. SORT(list, expressionAsString?) — expression возвращает ключ сравнения
  parser.setFunction('SORT', function (params) {
    const list = params[0];
    const expr = params[1];
    if (!Array.isArray(list)) return { error: '#VALUE!' };
    const copy = [...list];
    if (expr == null) return copy.sort();
    const keyed = copy.map((item, i) => {
      const r = evalWithCurrent(expr, item, parser);
      return { item, key: r.error ? undefined : r.result, i };
    });
    keyed.sort((a,b) => (a.key > b.key) - (a.key < b.key) || a.i - b.i);
    return keyed.map(k => k.item);
  });

  // 24. SLICE
  parser.setFunction('SLICE', function (params) {
    const list = params[0];
    const start = clampInt(params[1]);
    const end = params.length > 2 ? clampInt(params[2]) : undefined;
    if (!Array.isArray(list) || !Number.isFinite(start)) return { error: '#VALUE!' };
    return list.slice(start, Number.isFinite(end) ? end : undefined);
  });

  // 25. REVERSE
  parser.setFunction('REVERSE', function (params) {
    const list = params[0];
    if (!Array.isArray(list)) return { error: '#VALUE!' };
    return [...list].reverse();
  });

  // 26. FINDINDEX(list, predicateAsString)
  parser.setFunction('FINDINDEX', function (params) {
    const list = params[0];
    const pred = params[1];
    if (!Array.isArray(list)) return { error: '#VALUE!' };
    for (let i = 0; i < list.length; i++) {
      const r = evalWithCurrent(pred, list[i], parser);
      if (!r.error && !!r.result) return i;
    }
    return -1;
  });

  // 27. FILTER(list, predicateAsString)
  parser.setFunction('FILTER', function (params) {
    const list = params[0];
    const pred = params[1];
    if (!Array.isArray(list)) return { error: '#VALUE!' };
    const out = [];
    for (let i = 0; i < list.length; i++) {
      const r = evalWithCurrent(pred, list[i], parser);
      if (!r.error && !!r.result) out.push(list[i]);
    }
    return out;
  });

  // 28. TONUMBER
  parser.setFunction('TONUMBER', function (params) {
    const s = params[0];
    const num = typeof s === 'number' ? s : Number(String(s).trim());
    if (!Number.isFinite(num)) return { error: '#VALUE!' };
    return num;
  });
}
