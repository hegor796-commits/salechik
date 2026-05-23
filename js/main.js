// Burger menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
    }
  });
}

// Active nav link
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// Toast notification
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = '<span>✓</span>' + msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// Order form
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = orderForm.querySelector('.btn-submit');
    btn.textContent = 'Отправляем...';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      const success = document.getElementById('formSuccess');
      if (success) {
        orderForm.style.display = 'none';
        success.style.display = 'block';
      } else {
        showToast('Заявка принята! Мы позвоним вам скоро.');
        orderForm.reset();
        btn.textContent = 'Оставить заявку';
        btn.disabled = false;
      }
    }, 900);
  });
}

// Catalog filter
const filterBtns = document.querySelectorAll('.filter-btn');
const chickenCards = document.querySelectorAll('.chicken-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;

    chickenCards.forEach(card => {
      if (cat === 'all' || card.dataset.category === cat) {
        card.style.display = '';
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// "Заказать" button in card
document.querySelectorAll('.btn-order-card').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const formSection = document.getElementById('order');
    const selectEl = document.getElementById('productSelect');

    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      if (selectEl && name) {
        setTimeout(() => {
          for (let opt of selectEl.options) {
            if (opt.value === name) { selectEl.value = name; break; }
          }
        }, 400);
      }
    } else {
      window.location.href = 'index.html#order';
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Hash-based scroll on load (e.g. index.html#order)
window.addEventListener('load', () => {
  if (window.location.hash) {
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
  }
});
