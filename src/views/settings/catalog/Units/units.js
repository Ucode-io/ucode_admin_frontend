import toPairs from "lodash/toPairs";

var map = {
  Килограмм: "кг",
  Грамм: "г",
  Штука: "шт",
  Литр: "л",
};

var pairs = toPairs(map); // [["Килограмм", "кг"], ["Грамм", "г"], ...]

export var mappedReductions = Object.freeze(new Map(pairs));

export var units = ["Килограмм", "Грамм", "Штука", "Литр"];

export var accuracies = [
  "1",
  "0.1",
  "0.01",
  "0.001",
  "0.0001",
  "0.00001",
  "0.000001",
];
