# Codebase Concerns

**Analysis Date:** 2026-04-15

---

## Tech Debt

### Vidstack loaded with `@next` floating tag — **High**

- Issue: Vidstack Player is loaded from CDN using the `@next` dist-tag: `https://cdn.jsdelivr.net/npm/vidstack@next/...`. This resolves to a different (potentially breaking) version every time jsDelivr revalidates, with no lockfile or integrity hash.
- Files: `src/_includes/base.njk` (lines 75–79)
- Impact: A Vidstack breaking change could silently break video playback on the `films` and `home` pages without any code change in the repo.
- Fix approach: Pin to an explicit semver (e.g. `vidstack@1.x.y`) and add `integrity` + `crossorigin` SRI attributes to the `<link>` and `<script>` tags.

### Client-side i18n loaded via 4 sequential fetch calls — **Medium**

- Issue: `src/js/main.js` fires four `fetch()` calls in `Promise.all` on every page load to hydrate translations from `/data/home.json`, `/data/films.json`, `/data/about.json`, `/data/contact.json`. These are runtime fetches even though the content is entirely static and known at build time.
- Files: `src/js/main.js` (lines 14–34)
- Impact: Causes a waterfall of 4 JSON requests on first paint. On slow connections, translated text flashes in after load. Eleventy already has access to all this data at build time.
- Fix approach: Either (a) inline the translation object into a `<script>` tag in the Nunjucks template using `{{ data | dump | safe }}`, or (b) use Eleventy's pagination to build language-specific pages with server-rendered strings, eliminating runtime translation entirely.

### Translations applied after page load — **Medium**

- Issue: All i18n strings (nav labels, subtitles, placeholders, film dates, contact intro) are rendered in English at build time, then swapped client-side via `data-i18n` attributes after the JSON fetch completes. This means Spanish/Catalan visitors see English text briefly on every load.
- Files: `src/js/main.js` (`applyTranslations` function), all `src/pages/*.njk` templates
- Impact: Visible flash of untranslated content (FOUC-equivalent). Bad UX for non-English visitors. Also hurts SEO since crawlers reading the initial HTML see English content on `/es/` and `/ca/` pages.
- Fix approach: Move string rendering server-side. Eleventy's pagination already generates language-specific URLs — pass the correct translated strings through Nunjucks template variables instead of fetching post-load.

### Status messages duplicated across JS files — **Low**

- Issue: Error/success/captchaError strings for the contact form are hardcoded as a `STATUS_MESSAGES` object in `src/pages/contact.njk` (lines 69–85). These duplicate the i18n pattern used everywhere else (JSON data files + `data-i18n` attributes). Two separate i18n systems exist side by side.
- Files: `src/pages/contact.njk` (lines 69–85), `src/_data/contact.json`
- Impact: Adding a new language requires updating both the JSON data file and the inline JS object. Likely to drift out of sync.
- Fix approach: Move `STATUS_MESSAGES` into `src/_data/contact.json` and load them via the same fetch/translation pipeline as all other strings.

---

## Security Concerns

### EmailJS public key and service ID exposed in client HTML — **Medium**

- Issue: `EMAILJS_PUBLIC_KEY = '0rAuLMUuVzUegGiS7'` and `EMAILJS_SERVICE_ID = 'service_zc9v6ym'` are hardcoded inline in `src/pages/contact.njk` (lines 58–59). These are rendered into every visitor's browser.
- Files: `src/pages/contact.njk` (lines 57–66)
- Impact: Any visitor can use these credentials to send emails through the same EmailJS account, potentially exhausting the free-tier quota or sending spam. Note: EmailJS public keys are inherently client-side and this is their intended usage, but the service ID and template IDs being exposed does allow quota abuse.
- Current mitigation: reCAPTCHA v2 invisible protects the form submission itself.
- Recommendations: Add EmailJS domain restrictions in the EmailJS dashboard so only requests from `josepbernad.com` are accepted. This is the proper mitigation for this architecture.

### reCAPTCHA site key exposed in HTML — **Low**

- Issue: reCAPTCHA v2 site key `6Lf3L0MsAAAAAHONJ9WOTAieL_vuKcUWqv9yf7rV` is visible in `src/pages/contact.njk` (line 29).
- Files: `src/pages/contact.njk` (line 29)
- Impact: This is by design for reCAPTCHA v2 — site keys are always public. The secret key (used server-side for token verification) is not present, which is correct.
- Current mitigation: reCAPTCHA domain restrictions should be configured in the Google reCAPTCHA console to `josepbernad.com` only.

### `innerHTML` used with data-driven content — **Medium**

- Issue: Several `innerHTML` assignments use values sourced from JSON translation files without sanitization:
  - `el.innerHTML = value` in `src/js/main.js` (line 111) — used for all `[data-i18n-html]` elements
  - `tagsContainer.innerHTML = ...` in `src/_includes/video-modal.njk` (line 129) — tag strings from `films.json` interpolated directly
  - `el.innerHTML = \`...\${text}...\`` in `src/_includes/video-modal.njk` (lines 64–65) — video title from `data-title` attribute
- Files: `src/js/main.js` (line 111), `src/_includes/video-modal.njk` (lines 64–65, 129)
- Impact: Low risk currently since content is static JSON controlled by the site owner. Would become high risk if any user-supplied data ever flowed through these paths. The `data-title` attribute is populated from `films.json` via Nunjucks, but the video modal also accepts `title` as a function parameter — if the source ever became dynamic, XSS would be trivial.
- Recommendations: Use `textContent` wherever HTML is not required; where HTML is required (bold, links), use a sanitizer or restrict to a known-safe pattern.

### Mailchimp URL with account identifiers hardcoded — **Low**

- Issue: `MAILCHIMP_URL` in `src/js/main.js` (line 176) contains the full Mailchimp list-manage URL including `u=ec19e426d1a78e9baa513bfaf&id=7a99017863`. These are public-facing Mailchimp subscribe endpoints by design, but they expose the account's list ID.
- Files: `src/js/main.js` (line 176)
- Impact: Anyone can submit arbitrary emails to the Mailchimp list. The JSONP + honeypot spam protection is minimal.
- Current mitigation: Mailchimp's own double opt-in (if enabled) prevents confirmation without user action.

---

## Performance Concerns

### `JosepBernad-Panoramic.webp` is 307 KB — **Medium**

- Issue: The panoramic image at `src/images/JosepBernad-Panoramic.webp` is 307 KB. This is a significant asset for what may be a decorative image.
- Files: `src/images/JosepBernad-Panoramic.webp`
- Impact: Adds to page weight on the page where it is used. No `loading="lazy"` or responsive `srcset` is visible from the template level.
- Fix approach: Verify if this image is above-the-fold or decorative. If decorative, add `loading="lazy"`. Add responsive variants via `srcset` for mobile vs desktop.

### No asset fingerprinting / cache-busting — **Medium**

- Issue: The main stylesheet and JS file are referenced with static paths: `/css/styles.css` and `/js/main.js` in `src/_includes/base.njk`. There is no content hash in the filename.
- Files: `src/_includes/base.njk` (lines 71, 165)
- Impact: If the CSS or JS changes, returning visitors may serve stale cached files until their browser cache expires. This is mitigated somewhat by Vercel's deployment-based CDN invalidation, but is a concern if any other CDN layer or aggressive browser caching is in place.
- Fix approach: Use Eleventy's `@11ty/eleventy-plugin-bundle` (already included as a transitive dependency) to add content-hashed filenames, or configure Vercel cache headers with short TTLs for these assets.

### 4 JSON fetch requests on every page load — **Medium**

- Issue: Described above under Tech Debt. Each page load triggers 4 network requests before translations can render.
- Files: `src/js/main.js` (lines 14–34)

### Google Fonts loaded without `font-display` fallback — **Low**

- Issue: Google Fonts (`Sedan` family) is loaded via `<link href="https://fonts.googleapis.com/css2?family=Sedan:ital@0;1&display=swap">`. While `display=swap` is in the URL, it depends on Google's CSS response. If the Google Fonts CDN is slow or blocked, the site falls back to system fonts with no controlled fallback stack specified in CSS.
- Files: `src/_includes/base.njk` (lines 65–68)

---

## Missing Features

### No form spam rate limiting beyond timing honeypot — **Medium**

- Issue: The newsletter form uses a 3-second timing honeypot and Mailchimp's own honeypot field (`tabindex="-1"` input) as its only spam defenses. There is no CAPTCHA, IP rate limiting, or server-side validation on the Mailchimp JSONP path.
- Files: `src/js/main.js` (lines 192–204)
- Impact: A bot that waits 3 seconds and ignores the honeypot can flood the Mailchimp list with fake signups.
- Fix approach: Add reCAPTCHA to the newsletter form (already loaded on the contact page) or switch to a server-side subscribe endpoint.

### No error boundary for failed translation fetch — **Low**

- Issue: The `Promise.all` in `src/js/main.js` (line 34) has a top-level `.catch(() => {})` that silently swallows all errors. If any of the 4 JSON files fails to load, the entire translation system fails with no fallback and no user-visible indication.
- Files: `src/js/main.js` (lines 14–34)
- Fix approach: Log the error to the analytics/console at minimum. Fall back to English strings if present.

### No `<noscript>` fallback for translated content — **Low**

- Issue: All translated content is applied via JavaScript. Visitors with JavaScript disabled see raw English placeholder text (or empty elements with `data-i18n` attributes). There are no `<noscript>` fallbacks.
- Files: All `src/pages/*.njk` templates
- Impact: Low real-world impact (JS-disabled users are rare), but the `/es/` and `/ca/` pages are effectively broken without JS.

---

## Fragile Areas

### Video modal state is entirely global — **Medium**

- Issue: The video modal in `src/_includes/video-modal.njk` uses module-level variables (`player`, `firstPlay`, `splashShownAt`, `currentVideoId`, `isMobile`) and attaches `openVideo`/`closeModal` directly to `window`. State is not encapsulated.
- Files: `src/_includes/video-modal.njk` (lines 54–217)
- Impact: Any script on the page can accidentally overwrite `window.openVideo` or `window.closeModal`. Adding a second modal or video component would require significant refactoring. The `player` variable is initialized asynchronously in `customElements.whenDefined`, creating a race condition window where `openVideo` could be called before `player` is ready (handled by the `isMobile` branch falling through to the iframe, but the `else if (player)` check on desktop means the video silently does nothing if called too early).
- Safe modification: Test video open timing thoroughly after any changes to script load order or Vidstack initialization.

### Mobile detection via `ontouchstart` / `maxTouchPoints` — **Low**

- Issue: `const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0` in `src/_includes/video-modal.njk` (line 59) is a fragile heuristic. Touch-capable laptops (Surface, iPad with keyboard, etc.) will use the mobile iframe path instead of the Vidstack player.
- Files: `src/_includes/video-modal.njk` (line 59)
- Impact: Users on touch-capable desktops get the degraded iframe experience rather than the full Vidstack player.
- Fix approach: Use a CSS media query or screen width check, or detect by viewport width in addition to touch capability.

### `currentLang` derived from two different sources in JS — **Low**

- Issue: Language is determined from `html.getAttribute('lang')` in `src/js/main.js` and `document.documentElement.getAttribute('lang')` in `src/pages/contact.njk`. Both are correct but inconsistent coding — any future change to how language is stored would require updates in multiple places.
- Files: `src/js/main.js` (line 10), `src/pages/contact.njk` (line 95)

---

## Test Coverage Gaps

### Zero test coverage — **High**

- Issue: No testing framework exists. There are no unit tests, integration tests, or end-to-end tests of any kind.
- Files: Entire codebase
- Impact: All regressions are caught manually. Core functionality at risk includes: translation fetching and rendering, video modal open/close/resume logic, newsletter form submission and spam filtering, contact form reCAPTCHA flow, theme persistence via localStorage, and language routing.
- Priority: High for the video modal and i18n logic, which are complex multi-state flows with no safety net.

---

## Dependency Risks

### Only one npm dependency — **Low (positive)**

- The single declared dependency is `@11ty/eleventy` ^3.1.2. This is actively maintained and low risk. However, there is no `engines` field in `package.json` specifying the required Node.js version, which could cause silent build failures if the CI environment drifts.
- Files: `package.json`
- Fix approach: Add `"engines": { "node": ">=20" }` to `package.json`.

### CDN dependencies have no Subresource Integrity (SRI) hashes — **Medium**

- Issue: All CDN resources (Vidstack JS/CSS via jsDelivr, Google Fonts, GoatCounter analytics, reCAPTCHA, EmailJS) are loaded without `integrity` attributes.
- Files: `src/_includes/base.njk` (lines 65–79, 168), `src/pages/contact.njk` (lines 51–54)
- Impact: If any CDN is compromised, malicious scripts could be injected into every visitor's browser session without detection.
- Fix approach: Add `integrity` + `crossorigin="anonymous"` SRI attributes to all third-party `<script>` and `<link>` tags. Not feasible for resources that update frequently (Google Fonts), but critical for Vidstack and EmailJS which are pinned (or should be) to specific versions.

---

*Concerns audit: 2026-04-15*
