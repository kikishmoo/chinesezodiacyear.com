/**
 * Newsletter — Beehiiv form submission + Formsubmit fallback.
 */

import { track } from '../analytics.js';

export function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value) return;

      const email = emailInput.value;
      const section = form.closest('.newsletter-content')
                   || form.closest('.email-popup')
                   || form.closest('.content-upgrade')
                   || form.parentElement;
      const successEl = section.querySelector('.newsletter-message:not(.newsletter-message--error)');
      const errorEl   = section.querySelector('.newsletter-message--error');
      const originalBtnHTML = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing\u2026';

      const showSuccess = () => {
        form.style.display = 'none';
        if (successEl) { successEl.hidden = false; successEl.style.display = ''; }
        if (errorEl) { errorEl.hidden = true; errorEl.style.display = 'none'; }
        track('newsletter_subscribe', {
          event_category: 'Newsletter',
          event_label: form.dataset.beehiiv ? 'beehiiv' : 'formsubmit'
        });
      };
      const showError = () => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        if (errorEl) { errorEl.hidden = false; errorEl.style.display = ''; }
        if (successEl) { successEl.hidden = true; successEl.style.display = 'none'; }
        track('newsletter_error', {
          event_category: 'Newsletter',
          event_label: form.dataset.beehiiv ? 'beehiiv' : 'formsubmit'
        });
      };

      if (form.dataset.beehiiv) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'beehiiv-frame-' + Date.now();
        document.body.appendChild(iframe);
        const proxyForm = document.createElement('form');
        proxyForm.method = 'POST';
        proxyForm.action = form.action;
        proxyForm.target = iframe.name;
        proxyForm.style.display = 'none';
        const input = document.createElement('input');
        input.name = 'email';
        input.value = email;
        proxyForm.appendChild(input);
        form.querySelectorAll('input[type="hidden"]').forEach(h => {
          const clone = document.createElement('input');
          clone.type = 'hidden';
          clone.name = h.name;
          clone.value = h.value;
          proxyForm.appendChild(clone);
        });
        document.body.appendChild(proxyForm);
        proxyForm.submit();
        var beehiivDone = false;
        setTimeout(() => {
          beehiivDone = true;
          showSuccess();
          try { document.body.removeChild(iframe); document.body.removeChild(proxyForm); } catch (ex) {}
        }, 1500);
        setTimeout(() => {
          if (!beehiivDone) {
            showError();
            try { document.body.removeChild(iframe); document.body.removeChild(proxyForm); } catch (ex) {}
          }
        }, 8000);
      } else {
        const formData = { email: email };
        form.querySelectorAll('input[type="hidden"], input[name="_honey"]').forEach(f => {
          if (f.name) formData[f.name] = f.value;
        });
        fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData)
        })
        .then(res => { if (res.ok) showSuccess(); else showError(); })
        .catch(() => showError());
      }
    });
  });
}
