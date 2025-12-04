# Changelog

All notable changes to this project will be documented in this file.

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

