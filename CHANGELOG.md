# Changelog

All notable changes to this project will be documented in this file.

## [1.5.1] - 2026-04-21

### Changed
- Home hero pill now reads "Upcoming shows · Next <date>" — dropped the event name and introduced a `nextShow.next` i18n string (EN/ES/CA). Fixed the empty server-rendered label caused by `eleventyComputed` overriding `lang` — template now uses `currentLang` consistently, and `main.js` wires `nextShow` into client-side translations so language switches stay in sync.
- `live.json`: removed the unconfirmed **Tremolartà** (2026-07-24) entry and cleared all past shows.

## [1.5.0] - 2026-04-21

### Added
- **Live page** (`/live/`, `/es/live/`, `/ca/live/`) — upcoming and past shows with i18n strings, date filters (`liveDay`, `liveMonth`, `liveYear`, `liveDateShort`), and `upcomingOnly` / `pastDesc` helpers
- **Press Kit page** (`/press-kit/`, `/es/press-kit/`, `/ca/press-kit/`) — multilingual bio (short/long), set formats, logos (light/dark BG), technical rider, weddings section, and booking contact; logo assets copied from `src/press-kit/`
- **Next-show pill** on the home hero — surfaces the next upcoming live date with a direct link to `/live/`
- "Press Kit" entry in the home navigation (EN/ES/CA)
- SEO metadata and sitemap entries for Live and Press Kit across all three languages

### Changed
- Unified `.top-header` layout across home and interior pages — location now always sits at the bottom
- `.header-name` now shares typography with `.header-claim` (font-size, letter-spacing, margin) and keeps Sedan + `-webkit-text-stroke: 1px` as its only distinguishing styles; letter-spacing tightened to `0.08em`
- `.header-name` "Josep Bernad" is now a locale-aware link back to the home
- Theme bootstrap script moved into `<head>` to prevent FOUC on the theme toggle
- 404 page now detects language prefix client-side (Vercel serves `/404.html` on miss) and rewrites language-switcher links, back link, and the header name link accordingly

## [1.4.2] - 2026-04-15

### Fixed
- Add `"11ty.js"` to Eleventy `templateFormats` so `version.11ty.js` is processed and `/version.json` is generated at build time

## [1.4.1] - 2026-04-15

### Added
- `src/version.11ty.js` — generates public `/version.json` from `package.json` version
- `.planning/codebase/` — codebase analysis docs (architecture, stack, conventions, concerns)

## [1.4.0] - 2026-04-15

### Security
- Pinned Vidstack CDN from floating `@next` tag to explicit version `1.12.13`
- Added SRI `integrity` + `crossorigin` attributes to all 4 Vidstack CDN resources

### Added
- Vitest unit test suite — 12 tests covering `resolveKey` (i18n key resolution) and `formatFilmDate`
- Playwright e2e test suite — 32 tests across desktop and mobile covering video modal, theme toggle, and i18n language routing
- Extracted pure utility functions (`resolveKey`, `formatFilmDate`) to `src/js/utils.js`
- Converted `main.js` from IIFE to ES module

## [1.3.0] - 2024-12-04

### Added
- **Frosted glass effect** on all film cards with backdrop blur
- **Glow effect** on Live Set cards to highlight premium content
- **About page** with translatable bio, profile image, and LinkedIn/GitHub links
- **Frosted glass effect** (backdrop blur) on all film cards
- **Glow effect** on Live Set cards to highlight premium content


### Changed
- Refactored Live Set styling from tag-level to card-level differentiation
- Film dates now display abbreviated month names (OCT, JUL) with translations
- Renamed "Contact" navigation item to "About"
- Film dates now display abbreviated month names (OCT, JUL) with translations
- Refactored Live Set styling from tag-level to card-level
- Section header simplified: solid background with subtle border
- Created shared `.section-container` class for section pages
- **External translation files** for home, films, and about content

## [1.2.2] - 2024-12-04

### Added
- **"Soon" tooltip and lock icon** for disabled navigation links
- **Backdrop blur** on social icon buttons (frosted glass effect)
- **Premium "Live Set" tag styling** with diagonal gradient using opposite theme colors

### Changed
- Compact spacing breakpoint increased from 840px to 1000px height
- Film card layout adjustments for better spacing
- Enhanced first tag styling (DJ Set, Live Set) with increased prominence
- Film dates now show abbreviated month names (OCT, JUL, etc.) instead of numbers, with translations for English, Spanish, and Catalan

## [1.2.1] - 2024-12-02

### Added
- **Films page** with complete content and responsive grid layout
  - 7 films displayed with YouTube thumbnails (auto-fetched from video IDs)
  - Film cards showing title, location, date, and genre tags
  - Play button overlay on hover (desktop only)
  - Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
  - Links open YouTube videos in new tab
- Section page layout system
  - Header background gradient overlay for better readability
  - Back navigation button with section title
  - Top header showing location and artist name on section pages
  - Background image dimmed to 10% opacity on section pages
- Films data file (`src/_data/films.json`) for easy content management
- Disabled navigation links styling for upcoming sections

### Changed
- Navigation breakpoint increased from 768px to 900px (mobile 2x2 grid extends to larger screens)
- Navigation spacing unified to 2.5rem (40px) in all directions for visual consistency
- Hover effects disabled on mobile/touch devices using `@media (hover: hover)` detection
- Film cards redesigned with centered info, corner-positioned location/date
- Film tags centered with first tag emphasized
- Section navigation separator increased (50px vertical line on mobile)

### Improved
- Refactored hover effects architecture using CSS custom properties
  - Centralized control of all hover behaviors in single media query
  - Self-documenting system with inline usage guide
  - Future-proof: impossible to forget mobile optimization for new elements
  - Better performance: one media query instead of 14 scattered blocks
- Navigation spacing now consistent across all screen sizes and heights
  - Removed compact gap override for screens with max-height: 840px
  - Maintains 40px spacing regardless of device orientation
- Film card hover effects use new CSS custom property system
  - Lift effect, image zoom, and box shadows on hover (desktop only)
  - Touch devices show clean static cards without hover artifacts

### Fixed
- GitHub Pages deployment: added .nojekyll file to fix image loading issues
- CNAME file now properly copied to _site for custom domain support
- Horizontal overflow hidden on html/body to prevent scroll issues

## [1.2.0] - 2024-12-02

### Added
- GitHub Actions workflow for automatic deployment to GitHub Pages

## [1.1.0] - 2024-12-02

### Added
- Dynamic favicon that changes with theme toggle
- Background colors for mobile overscroll prevention

### Fixed
- iOS overscroll now shows theme-matching colors instead of white

## [1.0.0] - 2024-12-02

### Added
- Initial release of josepbernad.com
- Main landing page with title "Josep Bernad" and subtitle "Live & DJ Set"
- Corporate claim "Mainly House Music" with location "Barcelona // Mallorca"
- Social media links (Instagram, YouTube, Spotify, SoundCloud)
- Dark/light theme toggle with system preference detection
- Responsive design with mobile-first approach
- Version label easter egg in bottom right corner
- Background images for both themes (mobile and desktop variants)

