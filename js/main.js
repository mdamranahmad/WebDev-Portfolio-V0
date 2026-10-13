// =========================================================
// CONFIG — the contact form posts to FormSubmit, which relays
// the message to the address below as email. No account, API
// key, or backend required.
//
// IMPORTANT: the FIRST submission triggers a one-time
// confirmation email to amranahmad.md@gmail.com — click the
// link in that email once and every later submission arrives
// normally. To use a different address, change it below.
//
// Prefer a different service? Formspree (https://formspree.io)
// or Web3Forms (https://web3forms.com) work the same way —
// swap in their endpoint URL and payload shape.
// You can also set this to "" to disable sending entirely.
// =========================================================
const FORM_ENDPOINT = "https://formsubmit.co/ajax/amranahmad.md@gmail.com";

document.addEventListener('DOMContentLoaded', () => {
  const $ = (id) => document.getElementById(id);

  /* ---------- mobile nav ---------- */
  const navToggle = $('navToggle');
  const navMobile = $('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const open = navMobile.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- projects: filter + search ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = $('workSearch');
  const projects = Array.from(document.querySelectorAll('[data-project]'));
  const resultsCount = $('resultsCount');
  const noResults = $('noResults');
  let activeFilter = 'all';

  function applyFilters() {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    let visibleCount = 0;

    projects.forEach(card => {
      const tags = (card.dataset.tags || '').toLowerCase();
      const searchable = (card.dataset.search || '').toLowerCase();
      const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
      const matchesSearch = !query || searchable.includes(query);
      const visible = matchesFilter && matchesSearch;

      card.classList.toggle('hidden-case', !visible);
      if (visible) visibleCount++;
    });

    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} of ${projects.length} projects`;
    }
    if (noResults) noResults.hidden = visibleCount !== 0;
  }

  if (filterBtns.length && projects.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activeFilter = btn.dataset.filter;
        applyFilters();
      });
    });
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    applyFilters();
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- floating CTA (home page only) ---------- */
  const floatingCta = $('floatingCta');
  const heroEl = document.querySelector('.hero');
  const contactEl = $('contact');
  if (floatingCta && heroEl) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === heroEl) {
          floatingCta.classList.toggle('show', !entry.isIntersecting);
        }
        if (contactEl && entry.target === contactEl && entry.isIntersecting) {
          floatingCta.classList.remove('show');
        }
      });
    }, { threshold: 0.05 });
    ctaObserver.observe(heroEl);
    if (contactEl) ctaObserver.observe(contactEl);
  }

  /* ---------- contact form: validate + submit ---------- */
  const form = $('contactForm');
  const successPanel = $('formSuccess');
  const submitBtn = $('cfSubmit');

  if (form && successPanel && submitBtn) {
    const btnLabel = submitBtn.querySelector('.btn-label');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    const successName = $('successName');
    const successEmail = $('successEmail');
    const sendAnother = $('sendAnother');

    const fields = {
      name: { el: $('cf-name'), err: $('err-name') },
      email: { el: $('cf-email'), err: $('err-email') },
      projectType: { el: $('cf-type'), err: $('err-type') },
      budget: { el: $('cf-budget'), err: $('err-budget') },
      details: { el: $('cf-details'), err: $('err-details') },
    };

    function setError(field, message) {
      const f = fields[field];
      if (!f || !f.el) return;
      f.el.classList.toggle('invalid', !!message);
      if (f.err) f.err.textContent = message || '';
    }

    function validate() {
      let valid = true;

      const name = fields.name.el.value.trim();
      if (!name) { setError('name', 'Please enter your name.'); valid = false; }
      else if (name.length < 2) { setError('name', 'Name looks too short.'); valid = false; }
      else setError('name', '');

      const email = fields.email.el.value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) { setError('email', 'Please enter your email.'); valid = false; }
      else if (!emailRe.test(email)) { setError('email', 'That email address doesn\'t look right.'); valid = false; }
      else setError('email', '');

      if (!fields.projectType.el.value) { setError('projectType', 'Pick a project type.'); valid = false; }
      else setError('projectType', '');

      if (!fields.budget.el.value) { setError('budget', 'Pick a budget range.'); valid = false; }
      else setError('budget', '');

      const details = fields.details.el.value.trim();
      if (!details) { setError('details', 'Tell me a bit about the project.'); valid = false; }
      else if (details.length < 10) { setError('details', 'A little more detail helps — a sentence or two.'); valid = false; }
      else setError('details', '');

      return valid;
    }

    // live-clear errors as the person fixes them
    Object.values(fields).forEach(({ el }) => {
      if (!el) return;
      el.addEventListener('input', () => { if (el.classList.contains('invalid')) validate(); });
      el.addEventListener('change', () => { if (el.classList.contains('invalid')) validate(); });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) {
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      submitBtn.disabled = true;
      if (btnLabel) btnLabel.textContent = 'Sending…';
      if (btnSpinner) btnSpinner.hidden = false;

      const payload = {
        name: fields.name.el.value.trim(),
        email: fields.email.el.value.trim(),
        projectType: fields.projectType.el.value,
        budget: fields.budget.el.value,
        details: fields.details.el.value.trim(),
      };

      try {
        if (FORM_ENDPOINT) {
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
              ...payload,
              _subject: `New project enquiry — ${payload.projectType}`,
              _template: 'table',
              _captcha: 'false',
            }),
          });
          const data = await res.json().catch(() => ({}));
          const okFlag = data.success === true || data.success === 'true' || res.ok;
          if (!res.ok || data.success === false || data.success === 'false') {
            throw new Error(data.message || 'The form endpoint responded with an error.');
          }
          if (!okFlag) throw new Error('The form endpoint did not confirm receipt.');
        } else {
          // No endpoint configured — simulate the round trip so the UI can
          // be reviewed, but warn clearly that nothing was sent.
          await new Promise(resolve => setTimeout(resolve, 700));
          console.warn('[contact form] FORM_ENDPOINT is not set — message was not actually sent. See js/main.js.');
        }

        if (successName) successName.textContent = payload.name.split(' ')[0];
        if (successEmail) successEmail.textContent = payload.email;
        form.hidden = true;
        successPanel.hidden = false;

      } catch (err) {
        console.error(err);
        alert('Something went wrong sending that — please try again, or email amranahmad.md@gmail.com directly.');
      } finally {
        submitBtn.disabled = false;
        if (btnLabel) btnLabel.textContent = 'Send message';
        if (btnSpinner) btnSpinner.hidden = true;
      }
    });

    if (sendAnother) {
      sendAnother.addEventListener('click', () => {
        form.reset();
        Object.keys(fields).forEach(f => setError(f, ''));
        successPanel.hidden = true;
        form.hidden = false;
      });
    }
  }

  /* ---------- footer year ---------- */
  const yearEl = $('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
