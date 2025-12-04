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
      months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      about: {
        bio1: '<strong>Josep Bernad</strong> is a <strong>musician and DJ</strong> from <strong>Mallorca</strong> based in <strong>Barcelona</strong>, as well as a <strong>software engineer</strong> — a combination that allows him to merge advanced technology with creativity in all his productions. Trained from a young age as a <strong>drummer</strong> and later as a <strong>multi-instrumentalist</strong>, his personal project dives into <strong>electronic music</strong> — mainly <strong>House</strong> — blending contemporary digital textures with deep influences and an elegant sonic aesthetic. Working between Barcelona and Mallorca, he continues to expand his catalogue of original productions, always aiming to deliver a distinctive and solid musical experience.',
        bio2: 'He presents three live formats: a <strong>Live Set</strong> featuring his own music performed with live instruments; a <strong>House DJ Set</strong> built around an extensive and carefully curated music library; and a <strong>Party Set (Open Format)</strong> designed for parties and festivals, where he mixes multiple genres while maintaining a coherent narrative and flawless transitions.',
        bio3: 'On stage, he seeks <strong>emotional connection</strong> with the audience, real-time crowd reading, and precise technical execution. His influences include artists such as <strong>Fred Again..</strong>, <strong>Hernán Cattaneo</strong>, <strong>Safri Duo</strong>, <strong>Bellaire</strong>, <strong>Eric Prydz</strong>, and <strong>Parcels</strong>, among many others.'
      }
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
      months: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
      about: {
        bio1: '<strong>Josep Bernad</strong> es un <strong>músico y DJ</strong> de <strong>Mallorca</strong> afincado en <strong>Barcelona</strong>, además de <strong>ingeniero de software</strong> — una combinación que le permite fusionar tecnología avanzada con creatividad en todas sus producciones. Formado desde pequeño como <strong>baterista</strong> y posteriormente como <strong>multi-instrumentista</strong>, su proyecto personal se sumerge en la <strong>música electrónica</strong> — principalmente <strong>House</strong> — mezclando texturas digitales contemporáneas con influencias profundas y una estética sonora elegante. Trabajando entre Barcelona y Mallorca, continúa expandiendo su catálogo de producciones originales, siempre buscando ofrecer una experiencia musical distintiva y sólida.',
        bio2: 'Presenta tres formatos en directo: un <strong>Live Set</strong> con su propia música interpretada con instrumentos en vivo; un <strong>House DJ Set</strong> construido alrededor de una extensa y cuidadosamente curada biblioteca musical; y un <strong>Party Set (Open Format)</strong> diseñado para fiestas y festivales, donde mezcla múltiples géneros manteniendo una narrativa coherente y transiciones impecables.',
        bio3: 'En el escenario, busca la <strong>conexión emocional</strong> con el público, lectura del público en tiempo real y ejecución técnica precisa. Sus influencias incluyen artistas como <strong>Fred Again..</strong>, <strong>Hernán Cattaneo</strong>, <strong>Safri Duo</strong>, <strong>Bellaire</strong>, <strong>Eric Prydz</strong> y <strong>Parcels</strong>, entre muchos otros.'
      }
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
      months: ['GEN', 'FEB', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DES'],
      about: {
        bio1: '<strong>Josep Bernad</strong> és un <strong>músic i DJ</strong> de <strong>Mallorca</strong> establert a <strong>Barcelona</strong>, a més d\'<strong>enginyer de software</strong> — una combinació que li permet fusionar tecnologia avançada amb creativitat en totes les seves produccions. Format des de petit com a <strong>bateria</strong> i posteriorment com a <strong>multi-instrumentista</strong>, el seu projecte personal s\'endinsa en la <strong>música electrònica</strong> — principalment <strong>House</strong> — barrejant textures digitals contemporànies amb influències profundes i una estètica sonora elegant. Treballant entre Barcelona i Mallorca, continua expandint el seu catàleg de produccions originals, sempre buscant oferir una experiència musical distintiva i sòlida.',
        bio2: 'Presenta tres formats en directe: un <strong>Live Set</strong> amb la seva pròpia música interpretada amb instruments en viu; un <strong>House DJ Set</strong> construït al voltant d\'una extensa i acuradament curada biblioteca musical; i un <strong>Party Set (Open Format)</strong> dissenyat per a festes i festivals, on barreja múltiples gèneres mantenint una narrativa coherent i transicions impecables.',
        bio3: 'A l\'escenari, cerca la <strong>connexió emocional</strong> amb el públic, lectura del públic en temps real i execució tècnica precisa. Les seves influències inclouen artistes com <strong>Fred Again..</strong>, <strong>Hernán Cattaneo</strong>, <strong>Safri Duo</strong>, <strong>Bellaire</strong>, <strong>Eric Prydz</strong> i <strong>Parcels</strong>, entre molts altres.'
      }
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

