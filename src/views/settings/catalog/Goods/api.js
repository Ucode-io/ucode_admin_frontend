var api = {
  brand_id: "",
  category_ids: [],
  combo_ids: [],
  count: "0",
  description: {
    en: "",
    ru: "",
    uz: "",
  },
  favorite_ids: [],
  gallery: [],
  image: "",
  in_price: "0",
  is_divisible: true,
  measurement_id: "",
  order_no: "0",
  out_price: "0",
  rate_id: "",
  tag_ids: [],
  title: {
    en: "",
    ru: "",
    uz: "",
  },
  variant_ids: [],
};

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
  categories: null,
  images: [],
  unit_short: null,
  accuracy: "",
  property_groups: [{ property: null, property_option: null }],
};

export var divisibility = ["divisible", "nondivisible"];

export var currencies = ["сум"];

export default formFields;
