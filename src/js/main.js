(function() {
  // Translations
  const translations = {
    en: {
      subtitle: 'Live & DJ Set',
      nav: {
        films: 'Films',
        nonNegotiables: 'Manifesto',
        press: 'Press',
        about: 'About',
        soon: 'Soon'
      },
      months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    },
    es: {
      subtitle: 'Live & DJ Set',
      nav: {
        films: 'Films',
        nonNegotiables: 'Manifiesto',
        press: 'Prensa',
        about: 'Sobre mí',
        soon: 'Pronto'
      },
      months: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
    },
    ca: {
      subtitle: 'Live & DJ Set',
      nav: {
        films: 'Films',
        nonNegotiables: 'Manifest',
        press: 'Premsa',
        about: 'Sobre mi',
        soon: 'Aviat'
      },
      months: ['GEN', 'FEB', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DES']
    }
  };

  const html = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const THEME_KEY = 'theme-preference';
  const LANG_KEY = 'lang-preference';

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

  // Language functions
  function getInitialLang() {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved) return saved;

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ca')) return 'ca';
    if (browserLang.startsWith('es')) return 'es';
    return 'en';
  }

  function formatFilmDates(lang) {
    const months = translations[lang].months;
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

  function setLang(lang) {
    html.setAttribute('lang', lang);
    localStorage.setItem(LANG_KEY, lang);

    // Update active button
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) {
        if (value) value = value[k];
      }
      if (value) el.textContent = value;
    });

    // Update film dates format
    formatFilmDates(lang);
  }

  setLang(getInitialLang());

  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

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

  // Version label (easter egg)
  const versionLabel = document.getElementById('version-label');
  if (versionLabel) {
    fetch('/package.json')
      .then(res => res.json())
      .then(pkg => {
        versionLabel.textContent = pkg.version;
      })
      .catch(() => {});
  }

  // Disabled nav tooltip on click/tap
  const navTooltip = document.querySelector('.nav-tooltip');
  let tooltipTimeout;

  document.querySelectorAll('.nav-disabled').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (!navTooltip) return;
      
      // Show tooltip
      navTooltip.classList.add('show');
      
      // Hide after 1 second
      clearTimeout(tooltipTimeout);
      tooltipTimeout = setTimeout(() => {
        navTooltip.classList.remove('show');
      }, 1000);
    });
  });
})();

