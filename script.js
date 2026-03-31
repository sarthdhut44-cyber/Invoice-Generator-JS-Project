let products = [];

let loading = document.getElementById("loading");
let productSelect = document.getElementById("product");
let qty = document.getElementById("qty");
let search = document.getElementById("search");
let filter = document.getElementById("filter");

// API fetch
fetch("https://dummyjson.com/products")
  .then(res => res.json())
  .then(data => {
    products = data.products;

    loading.style.display = "none";

    displayProducts(products);
    loadCategories(products);
  });

// Display products
function displayProducts(data) {
  productSelect.innerHTML = "";

  data.forEach(item => {
    let option = document.createElement("option");
    option.value = item.id;
    option.text = item.title;
    productSelect.appendChild(option);
  });
}

// Load categories
function loadCategories(data) {
  let categories = [...new Set(data.map(p => p.category))];

  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.text = cat;
    filter.appendChild(option);
  });
}

// Search
search.addEventListener("input", () => {
  let value = search.value.toLowerCase();

  let filtered = products.filter(p =>
    p.title.toLowerCase().includes(value)
  );

  displayProducts(filtered);
});

// Filter
filter.addEventListener("change", () => {
  let category = filter.value;

  if (category === "all") {
    displayProducts(products);
  } else {
    let filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
  }
});

// Calculate total
productSelect.addEventListener("change", calculate);
qty.addEventListener("input", calculate);

function calculate() {
  let id = productSelect.value;
  let quantity = qty.value;

  let product = products.find(p => p.id == id);

  if (product) {
    let total = product.price * quantity;
    document.getElementById("total").innerText =
      "Total: ₹" + total.toFixed(2);
  }
}