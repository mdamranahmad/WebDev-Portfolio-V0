// =========================================================
// CONFIG — replace with your own Formspree endpoint to make
// the contact form actually deliver email. Sign up free at
// https://formspree.io, create a form, and paste its ID below.
// Until this is set, the form validates and shows a success
// state locally but will NOT send a real email anywhere.
// =========================================================
const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xnqeqwer"

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  navToggle.addEventListener('click', () => {
    const open = navMobile.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- case study accordion ---------- */
  document.querySelectorAll('[data-case]').forEach(caseEl => {
    const toggleBtn = caseEl.querySelector('[data-case-toggle]');
    const body = caseEl.querySelector('.case-body');
    toggleBtn.addEventListener('click', () => {
      const isOpen = caseEl.classList.contains('open');
      document.querySelectorAll('[data-case]').forEach(other => {
        other.classList.remove('open');
        other.querySelector('[data-case-toggle]').setAttribute('aria-expanded', 'false');
        other.querySelector('.case-body').style.maxHeight = null;
      });
      if (!isOpen) {
        caseEl.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- work showcase: filter + search ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('workSearch');
  const cases = Array.from(document.querySelectorAll('[data-case]'));
  const resultsCount = document.getElementById('resultsCount');
  const noResults = document.getElementById('noResults');
  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cases.forEach(caseEl => {
      const tags = (caseEl.dataset.tags || '').toLowerCase();
      const searchable = (caseEl.dataset.search || '').toLowerCase();
      const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
      const matchesSearch = !query || searchable.includes(query);
      const visible = matchesFilter && matchesSearch;

      caseEl.classList.toggle('hidden-case', !visible);
      if (visible) visibleCount++;

      // collapse hidden cases so nothing stays open behind the scenes
      if (!visible && caseEl.classList.contains('open')) {
        caseEl.classList.remove('open');
        caseEl.querySelector('[data-case-toggle]').setAttribute('aria-expanded', 'false');
        caseEl.querySelector('.case-body').style.maxHeight = null;
      }
    });

    resultsCount.textContent = `Showing ${visibleCount} of ${cases.length} projects`;
    noResults.hidden = visibleCount !== 0;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- floating CTA ---------- */
  const floatingCta = document.getElementById('floatingCta');
  const heroEl = document.querySelector('.hero');
  const contactEl = document.getElementById('contact');
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === heroEl) {
        // show once hero scrolls out of view
        if (!entry.isIntersecting) floatingCta.classList.add('show');
        else floatingCta.classList.remove('show');
      }
      if (entry.target === contactEl && entry.isIntersecting) {
        floatingCta.classList.remove('show');
      }
    });
  }, { threshold: 0.05 });
  ctaObserver.observe(heroEl);
  ctaObserver.observe(contactEl);

  /* ---------- contact form validation + submit ---------- */
  const form = document.getElementById('contactForm');
  const successPanel = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('cfSubmit');
  const btnLabel = submitBtn.querySelector('.btn-label');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');

  const fields = {
    name: { el: document.getElementById('cf-name'), err: document.getElementById('err-name') },
    email: { el: document.getElementById('cf-email'), err: document.getElementById('err-email') },
    projectType: { el: document.getElementById('cf-type'), err: document.getElementById('err-type') },
    budget: { el: document.getElementById('cf-budget'), err: document.getElementById('err-budget') },
    details: { el: document.getElementById('cf-details'), err: document.getElementById('err-details') },
  };

  function setError(field, message) {
    fields[field].el.classList.toggle('invalid', !!message);
    fields[field].err.textContent = message || '';
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
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validate();
    });
    el.addEventListener('change', () => {
      if (el.classList.contains('invalid')) validate();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    submitBtn.disabled = true;
    btnLabel.textContent = 'Sending…';
    btnSpinner.hidden = false;

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
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Form endpoint responded with an error.');
      } else {
        // No real backend configured yet — simulate the round trip
        // so the UI can be reviewed end to end during development.
        await new Promise(resolve => setTimeout(resolve, 700));
        console.warn('[contact form] FORM_ENDPOINT is not set — message was not actually sent. See js/main.js.');
      }

      document.getElementById('successName').textContent = payload.name.split(' ')[0];
      document.getElementById('successEmail').textContent = payload.email;
      form.hidden = true;
      successPanel.hidden = false;

    } catch (err) {
      console.error(err);
      setError('email', '');
      alert('Something went wrong sending that — please try again, or email amranahmad.md@gmail.com directly.');
    } finally {
      submitBtn.disabled = false;
      btnLabel.textContent = 'Send message';
      btnSpinner.hidden = true;
    }
  });

  document.getElementById('sendAnother').addEventListener('click', () => {
    form.reset();
    Object.keys(fields).forEach(f => setError(f, ''));
    successPanel.hidden = true;
    form.hidden = false;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
});
