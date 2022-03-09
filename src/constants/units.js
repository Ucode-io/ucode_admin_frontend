import toPairs from "lodash/toPairs";

var map = {
  Килограмм: "кг",
  Грамм: "г",
  Штука: "шт",
  Литр: "л",
};

var pairs = toPairs(map); // [["Килограмм", "кг"], ["Грамм", "г"], ...]

export var mappedReductions = Object.freeze(new Map(pairs));

export var units = [
  { label: "Килограмм", value: "Килограмм" },
  { label: "Грамм", value: "Грамм" },
  { label: "Штука", value: "Штука" },
  { label: "Литр", value: "Литр" },
];

export var accuracies = [
  { label: "1", value: "1" },
  { label: "0.1", value: "0.1" },
  { label: "0.01", value: "0.01" },
  { label: "0.001", value: "0.001" },
  { label: "0.0001", value: "0.0001" },
  { label: "0.00001", value: "0.00001" },
  { label: "0.000001", value: "0.000001" },
];
