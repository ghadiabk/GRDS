document.addEventListener('DOMContentLoaded', () => {
  const cakeImg = document.getElementById('cake-image');
  const priceValue = document.getElementById('price-value');
  const sizeRow = document.getElementById('size-options');
  const colorRow = document.getElementById('color-options');
  const flavorRow = document.getElementById('flavor-options');
  const toppingRow = document.getElementById('topping-options');
  const messageInput = document.getElementById('message-input');
  const messageSend = document.getElementById('message-send');

  let selectedSize = null;
  let selectedColor = null;
  let selectedFlavor = null;
  let selectedTopping = null;
  let messageDraft = '';
  let submittedMessage = '';

  const ASSETS = {
    customcakeP: 'assets/img/customcakeP.png',
    customcakeY: 'assets/img/customcakeY.png',
    customcakeW: 'assets/img/customcakeW.png',
    whiteS: 'assets/img/whiteS.png',
    whiteHappy: 'assets/img/whiteHappy.png',
    redVel: 'assets/img/redVel.png'
  };

  const getCakeImage = ({ size, color, flavor, topping, message }) => {
    if (!size) return null;
    const msg = (message || '').toLowerCase().trim();

    if (color === 'yellow') return ASSETS.customcakeY;
    if (color === 'pink') return ASSETS.customcakeP;

    if (color === 'white') {
      if (topping === 'fruits' && msg.includes('happy anniversary')) return ASSETS.whiteHappy;
      if (topping === 'fruits') return ASSETS.whiteS;
      return ASSETS.customcakeW;
    }

    if (!color && (flavor === 'red velvet' || flavor === 'red-velvet')) return ASSETS.redVel;

    return null;
  };

  const updateImage = () => {
    const nextSrc = getCakeImage({
      size: selectedSize,
      color: selectedColor,
      flavor: selectedFlavor,
      topping: selectedTopping,
      message: submittedMessage
    });

    if (!cakeImg) return;

    if (nextSrc) {
      cakeImg.src = nextSrc;
      cakeImg.style.visibility = 'visible';
    } else {
      cakeImg.src = '';
      cakeImg.style.visibility = 'hidden';
    }
  };

  const clearActives = row => {
    row.querySelectorAll('.pill.active').forEach(p => p.classList.remove('active'));
  };

  const handleRow = (row, type) => {
    if (!row) return;
    clearActives(row);
    const pills = Array.from(row.querySelectorAll('.pill'));
    row.addEventListener('click', e => {
      const target = e.target.closest('.pill');
      if (!target || !row.contains(target)) return;
      const wasActive = target.classList.contains('active');
      pills.forEach(p => p.classList.remove('active'));
      if (!wasActive) {
        target.classList.add('active');
        if (type === 'size') selectedSize = target.dataset.size || null;
        if (type === 'color') {
          selectedColor = target.dataset.color || null;
          const nextPrice = target.dataset.price;
          if (priceValue) priceValue.textContent = nextPrice || '0$';
        }
        if (type === 'flavor') selectedFlavor = target.dataset.flavor || null;
        if (type === 'topping') selectedTopping = target.dataset.topping || null;
      } else {
        if (type === 'size') selectedSize = null;
        if (type === 'color') {
          selectedColor = null;
          if (priceValue) priceValue.textContent = '0$';
        }
        if (type === 'flavor') selectedFlavor = null;
        if (type === 'topping') selectedTopping = null;
      }
      updateImage();
    });
  };

  handleRow(sizeRow, 'size');
  handleRow(colorRow, 'color');
  handleRow(flavorRow, 'flavor');
  handleRow(toppingRow, 'topping');

  if (messageInput) {
    messageInput.value = '';
    messageInput.addEventListener('input', e => {
      messageDraft = e.target.value || '';
    });
  }

  if (messageSend) {
    messageSend.addEventListener('click', () => {
      submittedMessage = messageDraft;
      updateImage();
    });
  }

  updateImage();
});
