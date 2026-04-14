# Codebase Structure

**Analysis Date:** 2026-04-15

## Directory Layout

```
josepbernad.com/
├── .eleventy.js          # Eleventy build configuration (passthrough copies, computed data, I/O dirs)
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions: build + deploy to GitHub Pages on push to main
├── .nojekyll             # Prevents GitHub Pages from running Jekyll on the output
├── CNAME                 # Custom domain: josepbernad.com
├── CHANGELOG.md          # Project changelog
├── package.json          # npm manifest (version, scripts, devDependencies)
├── favicon-dark.svg      # Root-level favicon (also copied from src/)
├── favicon-light.svg     # Root-level favicon (also copied from src/)
└── src/                  # All source files (Eleventy input dir)
    ├── _data/            # Global data files (available in all templates)
    │   ├── languages.json    # Locale list: en / es / ca with prefix mappings
    │   ├── films.json        # Film catalog (title, videoId, date, location, tags) + month names per locale
    │   ├── home.json         # Home page copy per locale (subtitle, nav labels, newsletter strings)
    │   ├── about.json        # About page copy per locale
    │   ├── contact.json      # Contact page copy per locale
    │   └── seo.json          # SEO metadata (title, description) keyed by pageId × lang
    ├── _includes/        # Shared Nunjucks layout partials
    │   ├── base.njk          # Root HTML shell (head, SEO, OG/Twitter, hreflang, body structure)
    │   ├── header.njk        # Language switcher, theme toggle, section nav/back link
    │   ├── footer.njk        # Footer partial
    │   └── video-modal.njk   # Vidstack <media-player> modal overlay
    ├── pages/            # One .njk file per page — each generates 3 locale variants via pagination
    │   ├── home.njk          # Homepage: hero, social links, featured films grid, panoramic + newsletter
    │   ├── films.njk         # Films grid: all film cards with thumbnail, tags, location, date
    │   ├── about.njk         # About page
    │   └── contact.njk       # Contact page
    ├── css/
    │   └── styles.css        # Single global stylesheet (passthrough copied to _site/css/)
    ├── js/
    │   └── main.js           # Vanilla JS IIFE: theme, i18n, social labels, video modal, newsletter
    ├── images/           # Static image assets (passthrough copied to _site/images/)
    │   ├── bg-dark-desktop.webp
    │   ├── bg-dark-mobile.webp
    │   ├── bg-light-desktop.webp
    │   ├── bg-light-mobile.webp
    │   ├── about.webp
    │   ├── JosepBernad-Logo.svg
    │   ├── JosepBernad-Panoramic.webp
    │   └── og-image.jpg
    ├── favicon-dark.svg      # Passthrough copied to _site/
    ├── favicon-light.svg     # Passthrough copied to _site/
    ├── 404.njk               # Custom 404 page
    ├── sitemap.njk           # Generates /sitemap.xml
    ├── robots.njk            # Generates /robots.txt
    └── version.11ty.js       # Generates /version.json from package.json version field
```

## Directory Purposes

**`src/_data/`:**
- Purpose: Global data injected into every Eleventy template automatically
- Contains: JSON files providing content, copy (per locale), and configuration
- Key files: `languages.json` (drives multilingual pagination), `films.json` (film catalog + month labels), `seo.json` (per-page SEO strings)
- Note: `films.json`, `home.json`, `about.json`, `contact.json` are also passthrough-copied to `_site/data/` so `main.js` can fetch them at runtime for client-side i18n

**`src/_includes/`:**
- Purpose: Reusable Nunjucks partials and the root layout
- Contains: `base.njk` (full HTML document shell), `header.njk`, `footer.njk`, `video-modal.njk`
- Key constraint: `base.njk` is the only layout — all pages use `layout: base.njk`

**`src/pages/`:**
- Purpose: One source template per logical page; each produces 3 output HTML files (EN/ES/CA) via `pagination` over `languages.list`
- Pattern: Each file has frontmatter with `pagination`, `permalink` using `{{ lang.prefix }}`, `layout: base.njk`, and `pageId`

**`src/js/`:**
- Purpose: Client-side runtime logic
- Contains: Single file `main.js` wrapped in an IIFE
- Responsibilities: Theme init + toggle, fetch translations + apply to DOM, film date formatting, social hover labels, Vidstack video modal, Mailchimp newsletter JSONP

**`src/css/`:**
- Purpose: All site styling
- Contains: Single file `styles.css` — no preprocessor, no build step

**`src/images/`:**
- Purpose: Static image assets
- Contains: Background images (light/dark × mobile/desktop), OG image, logo, panoramic photo
- All are passthrough-copied verbatim to `_site/images/`

## Key Source Files and What They Do

| File | Role |
|------|------|
| `.eleventy.js` | Eleventy config: passthrough copies, computed globals (`urlLang`, `urlLangPrefix`), template engine settings |
| `src/_includes/base.njk` | HTML shell; renders all SEO meta, hreflang, structured data, loads CSS/JS, conditionally loads Vidstack CDN |
| `src/_includes/header.njk` | Language switcher (EN/CA/ES links), dark/light theme button, optional section name + back arrow |
| `src/_includes/video-modal.njk` | Vidstack `<media-player>` overlay; toggled by film card clicks in `main.js` |
| `src/pages/home.njk` | Homepage template: hero with nav + socials, featured 3-film grid, panoramic + newsletter form |
| `src/pages/films.njk` | Full film catalog grid; all items from `films.json` |
| `src/js/main.js` | Entire client runtime: ~276 lines, single IIFE |
| `src/_data/languages.json` | Source of truth for locale codes and URL prefixes |
| `src/_data/films.json` | Film catalog + localized month abbreviations |
| `src/version.11ty.js` | JavaScript template: outputs `/version.json` with current `package.json` version |

## Template / Layout Hierarchy

```
base.njk                    ← root layout (all pages)
  └─ header.njk             ← included unconditionally
  └─ {{ content | safe }}   ← page body rendered here
  └─ footer.njk             ← included unconditionally
  └─ video-modal.njk        ← included per-page when needed (home.njk, films.njk)
```

Pages use `layout: base.njk` in frontmatter. There is only one layout level — no nested layouts.

## Naming Conventions

**Files:**
- Templates: `kebab-case.njk` (e.g., `video-modal.njk`)
- Data: `lowercase.json` matching the Eleventy global variable name (e.g., `films.json` → `{{ films }}`)
- JavaScript templates: `name.11ty.js`

**Directories:**
- Eleventy-special directories prefixed with `_`: `_data/`, `_includes/`
- Feature directories: lowercase singular (`pages/`, `css/`, `js/`, `images/`)

## Where to Add New Code

**New page (e.g., `/events/`):**
- Create `src/pages/events.njk` with pagination over `languages.list`, `layout: base.njk`, and a unique `pageId`
- Add SEO strings to `src/_data/seo.json` under the new `pageId`
- Add page copy to relevant data files or a new `src/_data/events.json`

**New data for templates + runtime i18n:**
- Add JSON to `src/_data/`
- Add a passthrough copy in `.eleventy.js`: `eleventyConfig.addPassthroughCopy({ "src/_data/events.json": "data/events.json" })`
- Fetch the file in `main.js` inside the `Promise.all` block

**New static asset:**
- Drop into `src/images/` (images) or `src/css/` (styles)
- Already registered as passthrough copies — no config change needed

**New shared partial:**
- Add `.njk` to `src/_includes/`
- Include with `{% include "name.njk" %}` in any page or layout

## Special Directories / Files

**`_site/` (build output):**
- Generated: Yes
- Committed: No (in `.gitignore`)
- Contents: Flat static HTML, copied CSS/JS/images, public JSON data files, `CNAME`, `.nojekyll`, `sitemap.xml`, `robots.txt`, `version.json`

**`.planning/`:**
- Generated: No (human/agent planning artifacts)
- Committed: Yes
- Contents: Codebase maps, implementation plans

**`.github/workflows/`:**
- Contains: `deploy.yml` — the sole CI/CD pipeline; triggers on push to `main`; Node 20; outputs to GitHub Pages via `actions/deploy-pages`

---

*Structure analysis: 2026-04-15*
