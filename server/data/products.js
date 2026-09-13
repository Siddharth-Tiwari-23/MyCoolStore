export const products = [
  { id: 1, name: "Sports TShirt", price: 259, category: "Men" },
  { id: 2, name: "Slim Fit Jeans", price: 499, category: "Men" },
  { id: 3, name: "Classic Hoodie", price: 399, category: "Men" },
  { id: 4, name: "Leather Jacket", price: 899, category: "Men" },
  { id: 5, name: "Casual Skirt", price: 299, category: "Women" },
  { id: 6, name: "Baby Sleepsuit", price: 199, category: "Kids" },
  { id: 7, name: "Formal Shirt", price: 349, category: "Men" },
  { id: 8, name: "Evening Dress", price: 599, category: "Women" },
  { id: 9, name: "Skater Dress", price: 449, category: "Women" },
  { id: 10, name: "Woolen Sweater", price: 499, category: "Women" },
  { id: 11, name: "Baby Print Shirt", price: 159, category: "Kids" },
  { id: 12, name: "Shirt Dress", price: 549, category: "Women" },
];

export const getProductById = (id) => {
  return products.find((p) => String(p.id) === String(id));
};
