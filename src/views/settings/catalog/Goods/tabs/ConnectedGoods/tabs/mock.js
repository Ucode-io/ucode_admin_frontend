var data = {
  count: 2,
  products: [
    {
      id: "ekld-210",
      name: "Product 1",
      vendor_code: "qwerty",
      price: 24000,
    },
    {
      id: "rlgf-543",
      name: "Product 2",
      vendor_code: "abc",
      price: 5000,
    },
    {
      id: "vbno-012",
      name: "Product 3",
      vendor_code: "123",
      price: 1122,
    },
  ],
};

export default function getV2Goods({ limit, page }) {
  return new Promise((resolve, reject) => {
    var timer = setTimeout(() => {
      resolve(data);
      clearTimeout(timer);
    }, 300);
  });
}

export function deleteProduct(id) {
  var products = data.products.filter((product) => product.id !== id);
  data = { count: products.length, products };
}

export function addProduct(products) {
  data = {
    count: data.products.length + 1,
    products: [...data.products, ...products],
  };
}
