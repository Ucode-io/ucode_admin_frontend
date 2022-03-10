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
  price_changer_ids: [],
  property_group_ids: [],
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
  brand: { label: "", value: "" },
  unit: { label: "", value: "" },
  currency: { label: "", value: "" },
  tags: [],
  categories: [],
  images: [],
  unit_short: { label: "", value: "" },
  accuracy: "",
};

export var divisibility = ["divisible", "nondivisible"];

export var currencies = ["сум"];

export default formFields;
