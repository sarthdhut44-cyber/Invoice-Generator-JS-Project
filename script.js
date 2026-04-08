let products = [];
let cart = [];

let productSelect = document.getElementById("product");
let tableBody = document.getElementById("tableBody");

// Set date + invoice number
document.getElementById("date").innerText = new Date().toLocaleDateString();
document.getElementById("invoiceNo").innerText = Math.floor(Math.random() * 10000);

// Load saved data
window.onload = () => {
  let saved = localStorage.getItem("invoiceData");
  if (saved) {
    cart = JSON.parse(saved);
    renderTable();
  }
};

// Fetch products
fetch("https://dummyjson.com/products")
  .then(res => res.json())
  .then(data => {
    products = data.products;
    loadProducts();
  });

// Load dropdown
function loadProducts() {
  products.forEach(p => {
    let option = document.createElement("option");
    option.value = p.id;
    option.text = p.title;
    productSelect.appendChild(option);
  });
}

// Add item
function addItem() {
  let id = productSelect.value;
  let qty = document.getElementById("qty").value;

  let product = products.find(p => p.id == id);

  if (!product || qty <= 0) return;

  let item = {
    name: product.title,
    price: product.price,
    qty: Number(qty)
  };

  cart.push(item);
  saveInvoice();
  renderTable();
}

// Render table
function renderTable() {
  tableBody.innerHTML = "";

  cart.forEach((item, index) => {
    let row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.qty}</td>
        <td>${item.price * item.qty}</td>
        <td><button onclick="removeItem(${index})">❌</button></td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  calculateTotal();
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  saveInvoice();
  renderTable();
}

// Calculate total
function calculateTotal() {
  let subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  let gst = subtotal * 0.18;
  let total = subtotal + gst;

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("gst").innerText = gst.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

// Save to local storage
function saveInvoice() {
  localStorage.setItem("invoiceData", JSON.stringify(cart));
}

// Download PDF
function downloadPDF() {
  const element = document.getElementById("invoice");
  html2pdf().from(element).save("invoice.pdf");
}