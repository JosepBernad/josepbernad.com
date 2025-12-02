# Changelog

All notable changes to this project will be documented in this file.

## [1.2.1] - 2024-12-02

### Changed
- Navigation breakpoint increased from 768px to 900px (mobile 2x2 grid extends to larger screens)
- Navigation spacing unified to 2.5rem (40px) in all directions for visual consistency
- Hover effects disabled on mobile/touch devices using `@media (hover: hover)` detection

### Improved
- Refactored hover effects architecture using CSS custom properties
  - Centralized control of all hover behaviors in single media query
  - Self-documenting system with inline usage guide
  - Future-proof: impossible to forget mobile optimization for new elements
  - Better performance: one media query instead of 14 scattered blocks
- Navigation spacing now consistent across all screen sizes and heights
  - Removed compact gap override for screens with max-height: 840px
  - Maintains 40px spacing regardless of device orientation

### Fixed
- GitHub Pages deployment: added .nojekyll file to fix image loading issues
- CNAME file now properly copied to _site for custom domain support

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

