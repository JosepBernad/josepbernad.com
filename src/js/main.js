(function() {
  // Translations (loaded from external JSON files)
  const translations = { en: {}, es: {}, ca: {} };
  const html = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const THEME_KEY = 'theme-preference';

  // Get current language from HTML lang attribute (set by server based on URL)
  function getCurrentLang() {
    return html.getAttribute('lang') || 'en';
  }

  // Load all translations from JSON files
  Promise.all([
    fetch('/data/home.json').then(res => res.json()),
    fetch('/data/films.json').then(res => res.json()),
    fetch('/data/about.json').then(res => res.json()),
    fetch('/data/contact.json').then(res => res.json()).catch(() => ({}))
  ]).then(([homeData, filmsData, aboutData, contactData]) => {
    // Merge translations
    ['en', 'es', 'ca'].forEach(lang => {
      translations[lang].subtitle = homeData[lang].subtitle;
      translations[lang].nav = homeData[lang].nav;
      translations[lang].error = homeData[lang].error;
      translations[lang].months = filmsData.months[lang];
      translations[lang].about = aboutData[lang];
      if (contactData[lang]) {
        translations[lang].contact = contactData[lang];
      }
    });
    // Apply translations for current language
    applyTranslations(getCurrentLang());
  }).catch(() => {});

  // Theme functions
  function getInitialTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update favicon
    const favicon = document.getElementById('favicon');
    if (favicon) {
      favicon.href = theme === 'dark' 
        ? '/favicon-dark.svg' 
        : '/favicon-light.svg';
    }
  }

  setTheme(getInitialTheme());

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Translation functions
  function formatFilmDates(lang) {
    const months = translations[lang]?.months;
    if (!months) return;
    document.querySelectorAll('.film-date').forEach(el => {
      const year = el.dataset.year;
      const monthIndex = parseInt(el.dataset.month, 10) - 1;
      const monthName = months[monthIndex];
      if (lang === 'en') {
        el.textContent = `${year} ${monthName}`;
      } else {
        el.textContent = `${monthName} ${year}`;
      }
    });
  }

  function applyTranslations(lang) {
    // Update text content
    if (translations[lang]?.nav) {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const keys = key.split('.');
        let value = translations[lang];
        for (const k of keys) {
          if (value) value = value[k];
        }
        if (value) el.textContent = value;
      });
    }

    // Update HTML content (for elements with rich text like bold)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) {
        if (value) value = value[k];
      }
      if (value) el.innerHTML = value;
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) {
        if (value) value = value[k];
      }
      if (value) el.placeholder = value;
    });

    // Update contact email link href
    const emailLink = document.getElementById('contact-email-link');
    if (emailLink && translations[lang]?.contact?.emailAddress) {
      const temp = document.createElement('div');
      temp.innerHTML = translations[lang].contact.emailAddress;
      const decodedEmail = temp.textContent;
      const encodedMailto = 'mailto:' + decodedEmail.split('').map(c => '&#' + c.charCodeAt(0) + ';').join('');
      emailLink.href = encodedMailto;
    }

    // Update film dates format
    formatFilmDates(lang);
  }

  // Social hover label
  const socialLinks = document.querySelectorAll('.socials a');
  const socialLabel = document.getElementById('social-label');

  if (socialLinks.length && socialLabel) {
    socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        socialLabel.textContent = link.dataset.label;
        socialLabel.classList.add('visible');
      });

      link.addEventListener('mouseleave', () => {
        socialLabel.classList.remove('visible');
      });
    });
  }
})();
