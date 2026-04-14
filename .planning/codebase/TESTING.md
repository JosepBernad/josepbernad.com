# Testing Patterns

**Analysis Date:** 2026-04-15

## Test Framework

**None.** No test framework is installed or configured.

A search for `*.test.*` and `*.spec.*` files yields no results. No `jest.config.*`, `vitest.config.*`, `playwright.config.*`, or equivalent configuration files exist. `package.json` defines only two scripts:

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy"
  }
}
```

There is no `test` script.

## Test File Locations

None.

## Test Types Present

None — no unit, integration, or end-to-end tests exist anywhere in the codebase.

## Coverage

Not configured.

## Testing Gaps

This is a static Eleventy site. The main areas that carry logic and would benefit from tests if introduced:

**JavaScript logic in `src/js/main.js`:**
- Theme initialisation and persistence (`getInitialTheme`, `setTheme`)
- Translation application (`applyTranslations`, `formatFilmDates`)
- Newsletter form bot-detection (timing honeypot, Mailchimp JSONP callback)
- None of this is currently testable because the JS is a single IIFE with no exports

**Eleventy build configuration (`src/.eleventy.js`):**
- Computed globals `urlLangPrefix` and `urlLang` (URL-to-language parsing logic)
- These are pure functions embedded in the config object — extractable and testable in isolation

**Multilingual routing:**
- Each page is generated from `src/_data/languages.json` via Eleventy pagination
- No assertions exist that the expected routes (`/`, `/es/`, `/ca/`, `/films/`, `/es/films/`, etc.) are actually built

**Template rendering:**
- No snapshot or HTML assertion tests for rendered output

## Recommendations if Tests Are Added

Given the Eleventy + vanilla JS stack, a lightweight approach would be:

1. **Unit tests for JS utilities** — extract pure functions (theme logic, translation key resolution, date formatting) into a separate module and test with Vitest or Jest
2. **Build output tests** — assert that expected HTML files exist in `_site/` after `eleventy build`, using a simple Node script or Vitest
3. **No E2E framework is warranted** for the current scope, but Playwright would be the natural fit if interaction testing (video modal, newsletter form) is desired in the future

---

*Testing analysis: 2026-04-15*
