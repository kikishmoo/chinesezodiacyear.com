/**
 * Lightbox — QR code lightbox for donate page.
 */

export function initLightbox() {
  var qrImages = document.querySelectorAll('.donate-qr');
  if (!qrImages.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'qr-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'QR code enlarged view');
  var img = document.createElement('img');
  img.alt = '';
  var actions = document.createElement('div');
  actions.className = 'qr-lightbox-actions';
  var downloadBtn = document.createElement('a');
  downloadBtn.textContent = 'Save Image';
  downloadBtn.setAttribute('download', '');
  downloadBtn.href = '#';
  actions.appendChild(downloadBtn);
  var hint = document.createElement('span');
  hint.className = 'qr-lightbox-hint';
  hint.textContent = 'Long-press image to save \u00B7 Tap background to close';
  overlay.appendChild(img);
  overlay.appendChild(actions);
  overlay.appendChild(hint);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    img.src = src;
    img.alt = alt;
    downloadBtn.href = src;
    downloadBtn.setAttribute('download', src.split('/').pop());
    overlay.style.display = 'flex';
    requestAnimationFrame(function() {
      overlay.classList.add('is-visible');
    });
    if (window.gtag) window.gtag('event', 'qr_view', {
      event_category: 'Engagement',
      event_label: alt || src.split('/').pop()
    });
  }

  function closeLightbox() {
    overlay.classList.remove('is-visible');
    setTimeout(function() { overlay.style.display = 'none'; }, 250);
  }

  overlay.style.display = 'none';
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLightbox();
  });
  actions.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.style.display !== 'none') closeLightbox();
  });

  qrImages.forEach(function(qr) {
    qr.addEventListener('click', function() {
      openLightbox(qr.src, qr.alt);
    });
    qr.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(qr.src, qr.alt);
      }
    });
  });
}
