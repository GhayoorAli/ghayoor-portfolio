# Mobile performance and responsive audit

Tested 20 October 2026. Comparison: deployed `https://www.ghayoorali.me/` versus the updated local production build.

## Changes

- Touch devices use native scrolling. Lenis's continuous animation loop and wheel smoothing run only with a fine pointer, hover support, a desktop viewport, and no reduced-motion preference.
- The mobile portrait is contained in the hero instead of keeping a full-screen filtered image behind the entire page. Desktop effects remain in place; mobile keeps the palette, typography, portrait, cards, and a soft background.
- Touch tablets and wide landscape phones receive the mobile navigation and a native horizontal project rail. They no longer enter the desktop pinned-scroll layout or desktop introduction animation.
- Short phones fit the introduction and contact actions on the first screen. The redundant hero navigation is replaced by the existing header menu on short screens. Hero cards, navigation menus, touch targets, and long project titles fit their viewports.
- Device-density image selection uses lossless WebP derivatives at 480 and 780 pixels, with the full 1085-pixel portrait retained for high-density screens. Custom portrait URLs are preserved. No lossy recompression was applied to the final images.
- Project Markdown renders on the server. Only the rendered content reaches the project UI, rather than a Markdown parser and duplicate current/next-project README data.
- Mermaid code and diagram rendering start near the viewport. Gallery and next-project images decode asynchronously and load lazily.

## Test coverage

- Chrome and WebKit (Safari engine), using mobile/touch emulation plus desktop regression checks. This is not testing on physical phones.
- Viewports: 320×568, 360×800, 375×667, 390×844, 430×932, 768×1024, 844×390, 932×430, 1024×768, and 1440×900.
- Every homepage section: hero, journey, projects, benefits, skills, contact, credentials, FAQ.
- Header menus, anchor alignment, detail dialogs, FAQ expansion, horizontal project scrolling, gallery navigation, and on-demand diagram rendering.
- All seven published project routes at 320, 390, 844, and 1024 pixels in both engines, including the long `LloydsFamilyJewellery` title that previously broke the mobile viewport.
- Three cold loads at each of 2× and 3× device pixel density for both local and live builds: 12 cold loads total. Separate five-second automated scroll traces were captured at both densities.
- Production build/type checking and all 20 existing content/Markdown tests passed. Lint reports the four existing warnings; no new lint warnings.

## Measured results

Cold loads used a 390×844 viewport, 4× CPU throttling, and a connection configured at 200,000 bytes/second with 150 ms latency. Results below are medians of three runs. Local versus deployed hosting introduces a small additional difference; these are lab measurements, not field Core Web Vitals.

| Measurement | Live | Updated local |
| --- | ---: | ---: |
| Largest Contentful Paint, 2× density | 6.75 s | 4.76 s |
| Initial resource transfer, 2× density | 1.26 MB | 0.87 MB |
| Largest Contentful Paint, 3× density | 6.79 s | 6.70 s |
| Idle animation callbacks on touch devices | about 60/s | 0/s |
| Flow Forge initial JavaScript transfer | 585 KB, 29 scripts | 218 KB, 11 scripts |
| Flow Forge diagrams rendered before scrolling | 4 | 0; all render when approached |

The headless scroll traces maintained approximately 16.7 ms at the 95th percentile in both versions, with no frames over 50 ms. They do not establish an FPS improvement on a physical phone's GPU.

## Remaining limit and deployment

A high-density phone still downloads the full-resolution portrait. On the deliberately slow connection, its cold-load LCP remains approximately 6.7 seconds. The current changes improve touch rendering, project-page work, and lower-density loading; they do not eliminate that full-image transfer time. Final image detail is retained.

These source changes have not been deployed to the live domain.

## Reproduce

Run `npm run build`, then `npm start`, then `npm run audit:mobile`. Chrome is required by default. Set `AUDIT_URL` for another server and `AUDIT_COMPARE_URL` for a live cold-load comparison.

For WebKit, first run `npx playwright install webkit`, then `AUDIT_ENGINE=webkit npm run audit:mobile`. This runs layouts and interactions; CPU/network measurements use Chromium.

Additional controls: `AUDIT_LAYOUT_ONLY=1`, `AUDIT_VIEWPORTS='[[375,667],[932,430]]'`, `AUDIT_PROJECT_WIDTHS='[1024]'`, `AUDIT_SKIP_PERFORMANCE=1`, and `AUDIT_OUTPUT=/tmp/custom-audit`. JSON results and screenshots are written to the output directory. Treat a nonzero exit code as a regression to inspect.
