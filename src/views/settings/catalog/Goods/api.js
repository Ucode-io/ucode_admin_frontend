var formFields = {
  description_ru: "",
  description_uz: "",
  description_en: "",
  in_price: "",
  out_price: "",
  is_divisible: null,
  title_ru: "",
  title_uz: "",
  title_en: "",
  brand: null,
  unit: null,
  currency: null,
  tags: null,
  category_ids: null,
  images: [],
  unit_short: null,
  accuracy: "",
  property_groups: [], // { property: null, property_option: null }
  code: "", // artikul
  favorite_ids: [],
  variant_ids: [],
  // why we need it
  rate_id: "",
};

export var divisibility = ["divisible", "nondivisible"];

export var currencies = ["UZS"];

export default formFields;
