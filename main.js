/* ============================================================
   THE VINYL CUP — Shared JavaScript
   ============================================================ */

/* ---- CART STATE (localStorage) ---- */
function getCart() {
  try { return JSON.parse(localStorage.getItem('vc_cart') || '[]'); }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('vc_cart', JSON.stringify(cart));
}

function addToCart(id, name, icon, price) {
  const cart = getCart();
  const idx = cart.findIndex(c => c.id === id);
  if (idx > -1) cart[idx].qty++;
  else cart.push({ id, name, icon, price, qty: 1 });
  saveCart(cart);
  updateCartUI();
  showToast(`${icon} "${name}" added to cart`);
}

function changeQty(id, delta) {
  const cart = getCart();
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(cart);
  updateCartUI();
}

function clearCart() {
  saveCart([]);
  updateCartUI();
}

/* ---- CART UI ---- */
function updateCartUI() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // Badge
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;

  // Body
  const body = document.getElementById('cart-body');
  const foot = document.getElementById('cart-foot');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <div class="icon">☕</div>
        <p>Your cart is empty.<br>Browse our menu!</p>
      </div>`;
    if (foot) foot.style.display = 'none';
  } else {
    body.innerHTML = cart.map(item => `
      <div class="cart-row">
        <div class="cart-row-icon">${item.icon}</div>
        <div class="cart-row-info">
          <div class="cart-row-name">${item.name}</div>
          <div class="cart-row-price">₹${item.price * item.qty}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>`).join('');

    const totalEl = document.getElementById('cart-total-val');
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (foot) foot.style.display = 'block';
  }
}

/* ---- CART DRAWER ---- */
function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

/* ---- TOAST ---- */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---- ACTIVE NAV LINK ---- */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
    else a.classList.remove('active');
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  setActiveNav();
});
