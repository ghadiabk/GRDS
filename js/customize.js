document.addEventListener('DOMContentLoaded', () => {
  const cakeImg = document.getElementById('cake-image');
  const priceValue = document.getElementById('price-value');
  const colorRow = document.getElementById('color-options');

  const applyColorSelection = pill => {
    if (!colorRow || !pill || !colorRow.contains(pill)) return;

    const nextImg = pill.dataset.img;
    if (nextImg && cakeImg) {
      cakeImg.src = nextImg;
    }

    const nextPrice = pill.dataset.price;
    if (nextPrice && priceValue) {
      priceValue.textContent = nextPrice;
    }
  };

  document.querySelectorAll('.pill-row').forEach(row => {
    const pills = Array.from(row.querySelectorAll('.pill'));
    if (!pills.length) return;
    if (!row.querySelector('.pill.active')) {
      pills[0].classList.add('active');
    }

    row.addEventListener('click', event => {
      const target = event.target.closest('.pill');
      if (!target || !row.contains(target)) return;
      pills.forEach(pill => pill.classList.remove('active'));
      target.classList.add('active');
      applyColorSelection(target);
    });
  });

  // Apply defaults based on the initially active color pill
  if (colorRow) {
    const activeColor = colorRow.querySelector('.pill.active') || colorRow.querySelector('.pill');
    if (activeColor) {
      applyColorSelection(activeColor);
    }
  }
});
