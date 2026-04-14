# Coding Conventions

**Analysis Date:** 2026-04-15

## File Naming Patterns

**Templates (Nunjucks):**
- Lowercase kebab-case: `video-modal.njk`, `base.njk`, `header.njk`, `footer.njk`
- Page files match their route name: `home.njk`, `films.njk`, `about.njk`, `contact.njk`
- Includes live in `src/_includes/`

**JavaScript:**
- Lowercase with hyphens: `main.js`
- Eleventy computed data files use the `.11ty.js` suffix: `version.11ty.js`

**CSS:**
- Single flat file: `src/css/styles.css`

**Data files:**
- Lowercase JSON: `films.json`, `home.json`, `about.json`, `contact.json`, `seo.json`, `languages.json`
- Located in `src/_data/`

**Images:**
- Mixed: PascalCase for brand assets (`JosepBernad-Logo.svg`, `JosepBernad-Panoramic.webp`), kebab-case for functional images (`bg-dark-desktop.webp`, `og-image.jpg`)

## Template Patterns (Nunjucks)

**Layout inheritance:** Pages declare `layout: base.njk` in frontmatter. The base layout wraps everything with `{{ content | safe }}`.

**Includes:** Partials are pulled with `{% include "header.njk" %}` — no path prefix needed (Eleventy resolves from `_includes/`).

**Variables:** Set with `{% set varName = value %}` inside templates. Global computed data is set in `.eleventy.js` via `eleventyConfig.addGlobalData`.

**Conditionals:**
```njk
{% if urlLang == 'en' %} active{% endif %}
{% if sectionName %}...{% endif %}
{% if pageId == 'films' or pageId == 'home' %}...{% endif %}
```

**Loops:**
```njk
{% for film in films.items %}
  ...
{% endfor %}
```

**Filters:** `| default(...)`, `| replace(...)`, `| dump | safe` for JSON serialisation in data attributes, `| safe` for HTML output.

**Comments:** `{# ... #}` for Nunjucks comments, HTML `<!-- ... -->` for comments that render in output.

## Frontmatter Conventions

All page files use YAML frontmatter. Standard keys:

```yaml
---
pagination:
  data: languages.list
  size: 1
  alias: lang
permalink: "{{ lang.prefix }}/films/"
layout: base.njk
pageId: films          # Used for SEO lookup and conditional asset loading
showClaim: false       # Controls header display options
showName: true
sectionName: Films     # Shown in section nav; omit for home page
eleventyComputed:
  currentLang: "{{ lang.code }}"
  currentPrefix: "{{ lang.prefix }}"
  lang: "{{ lang.code }}"
  langPrefix: "{{ lang.prefix }}"
---
```

- `pageId` is the primary page identifier — used to look up SEO data and conditionally load assets (e.g., Vidstack CSS/JS only on `home` and `films`).
- All pages are generated via Eleventy pagination over `languages.list`, producing multilingual routes (`/`, `/es/`, `/ca/`).

## CSS Methodology

**Approach:** Custom properties-driven, handwritten CSS — no utility framework, no CSS modules, no BEM.

**Naming:** Flat, semantic class names. Component-scoped prefixes by convention:
- `.film-card`, `.film-title`, `.film-tags`, `.film-tag` — film list items
- `.home-hero`, `.home-films`, `.home-films-grid` — home page sections
- `.video-modal`, `.video-modal-wrapper`, `.video-rec-card` — modal
- `.section-nav`, `.section-name`, `.lang-switcher` — header components

**BEM-style modifiers** are used sparingly with double dashes:
- `.film-card--live` — modifier on a base class

**Theme system:** Dark/light theming via `data-theme` attribute on `<html>`:
```css
[data-theme="light"] { background-color: #cadee1; }
[data-theme="dark"] { background-color: #13191a; }
```
Theme is toggled by JS writing to `localStorage` under the key `'theme-preference'`.

**Hover architecture:** CSS custom properties that default to "no-op" values on touch devices, active values under `@media (hover: hover)`. This eliminates the need for per-element media queries:
```css
:root { --hover-scale-sm: scale(1); }
@media (hover: hover) { :root { --hover-scale-sm: scale(1.1); } }
.my-button:hover { transform: var(--hover-scale-sm); }
```
Available variables: `--hover-scale-sm`, `--hover-scale-md`, `--hover-scale-img`, `--hover-lift`, `--hover-opacity-full`, `--hover-opacity-show`, `--hover-underline`, `--hover-bg-light-alpha`, `--hover-bg-dark-alpha`, `--hover-shadow-light`, `--hover-shadow-dark`.

## JavaScript Patterns

**Module style:** The main script (`src/js/main.js`) uses a single IIFE (`(function() { ... })()`) — no ES module imports, no bundler.

**The video modal script** (inlined in `video-modal.njk`) uses `<script type="module">` and exposes functions as `window.openVideo` / `window.closeModal` for global accessibility from HTML event handlers.

**Async pattern:** `Promise.all([fetch(...), ...]).then(...)` for parallel data loading. No `async/await` in `main.js`; the modal script uses standard event listeners.

**DOM interaction:** Direct `document.querySelector` / `document.querySelectorAll`. No framework or virtual DOM.

**State:** `localStorage` for persistent preferences (`'theme-preference'`, `'newsletter-dismissed'`). `sessionStorage` for ephemeral state (`video-progress-{videoId}`).

**Event delegation:** Not used — handlers attached directly to each element with `forEach`.

**Naming conventions in JS:**
- `camelCase` for functions and variables: `getCurrentLang`, `applyTranslations`, `formatFilmDates`, `showThankYou`, `showError`
- `SCREAMING_SNAKE_CASE` for constants: `THEME_KEY`, `NEWSLETTER_DISMISSED_KEY`, `MAILCHIMP_URL`
- Descriptive boolean variables: `isMobile`, `firstPlay`

## Data Format (JSON)

Content is stored as JSON in `src/_data/`. Structure is language-keyed:
```json
{
  "en": { "subtitle": "...", "nav": { "films": "..." } },
  "es": { "subtitle": "...", "nav": { "films": "..." } },
  "ca": { "subtitle": "...", "nav": { "films": "..." } }
}
```

Film data uses an `items` array with consistent fields:
```json
{
  "items": [
    {
      "title": "Sunset",
      "url": "https://youtu.be/...",
      "videoId": "gzFcLZjel8M",
      "date": "2025-10",
      "location": "Mallorca",
      "tags": ["DJ Set", "Afro House", "House"]
    }
  ]
}
```
Date format is `YYYY-MM` (no day). Data is passed to JS via `data-*` attributes on HTML elements and fetched at runtime from `/data/*.json` (Eleventy copies these via `addPassthroughCopy`).

## Internationalisation Pattern

**i18n in HTML:** Elements annotated with `data-i18n="key.path"` are updated at runtime by JS. For HTML content (bold etc.), use `data-i18n-html="key.path"`. For input placeholders, use `data-i18n-placeholder="key.path"`.

**Language routing:** URL prefix determines language (`/` = en, `/es/` = es, `/ca/` = ca). All pages are Eleventy pagination-generated from `src/_data/languages.json`.

**Server-side language:** The `urlLang` computed global (set in `.eleventy.js`) provides the language code to Nunjucks templates at build time.

## Linting and Formatting

No linting or formatting tools are configured (no `.eslintrc`, `.prettierrc`, `.editorconfig`, `biome.json`, or equivalent found). Code style is maintained by convention only.

---

*Convention analysis: 2026-04-15*
