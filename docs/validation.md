# Migration validation

The release review is still in progress. These results are local checks, not a substitute for CI or physical-device testing.

## Local checks, 2026-10-29

- Node 22.16.0: lint, production build, 69 Vitest tests, and 59 Playwright desktop/emulated-mobile tests passed; one desktop touch-only case was intentionally skipped. A clean `npm ci` and the same checks also passed in an isolated copy. The latest hosted Node 22 workflow passed for source commit `13ca376`; the added 640px layout check still needs its hosted run.
- Production preview: `/raw/portfolio.md` returned 200 and matched `src/content/portfolio.md` byte for byte. Legacy fragments `#hero`, `#about`, `#projects` and `#skills` selected the corresponding journey destination.
- `dist/.experimental` was absent.
- At a 640 CSS-pixel viewport (the layout width commonly produced by 200% zoom on a 1280px desktop), destination controls and the Contact action remained reachable in desktop and emulated-mobile browser projects. This viewport check is a proxy; actual browser zoom and visual reflow still need review.
- Production-preview captures: [desktop home](screenshots/desktop-home.png), [mobile-sized home](screenshots/mobile-home.png), and [desktop lab](screenshots/desktop-lab.png). The mobile capture is emulated.

### Lab performance comparison

Both production builds were served locally with Vite preview on the same machine. Five fresh Chromium contexts per build used a 390×844 viewport, reduced motion, 4× CPU slowdown, 150 ms latency and 1.6 Mbps download throughput. PerformanceObserver recorded LCP and layout shifts for five seconds after load. The baseline was built from commit `618547291d8d2a5c1aace83dd5b18a52ae68fa4d` with its lockfile; both builds used Node 24.15.0.

| Build | Median LCP | Median observed CLS |
| --- | ---: | ---: |
| Baseline | 2.296 s | 0.0008 |
| Migration | 1.808 s | 0.0258 |

The migration met the stated lab targets in this run, while its measured layout shift increased. These are local emulated results, not field data or a physical mobile benchmark; the shift should be investigated and the comparison repeated on representative hardware.

Three subsequent throttled production-preview loads recorded no layout-shift entries, including one with the Chromium cache disabled. The earlier shift could not be reproduced or attributed to an element, so the initial comparison remains recorded and the cause is unresolved.

After the WOFF2 and layout changes, a second comparison used three fresh contexts per build with the same viewport, reduced-motion, CPU and network settings, plus cache disabled. Median baseline LCP was 2.264 s with CLS 0.0008; median current LCP was 1.776 s with CLS 0. The baseline artifact was the earlier Node 24 build and the current artifact was built with Node 22.16.0. This repeat supports the lab targets but does not explain the earlier shift or replace physical-device measurements.

The canvas lifecycle has an integration check for StrictMode setup, hidden-tab pause, resumption, Off mode, reduced motion and teardown. This does not prove all browser animation and gesture behavior.

Additional Chromium checks exercised keyboard navigation and form arrow keys, vertical overflow before wheel travel, horizontal wheel input, unprevented control-wheel zoom gestures, and an emulated sideways touch gesture. Physical touch hardware remains untested.

At 320×700 CSS pixels, a visual inspection confirmed that the hero controls and itinerary appear in the initial viewport; the lens continues below it in the scrollable destination. A targeted desktop and emulated-mobile check also verified that the focused first project disclosure is above the fixed itinerary. This is not a complete focus audit or 200% browser-zoom review.

## Outstanding release evidence

- Compare every destination against the approved desktop and mobile prototype and complete an actual 200% browser-zoom review. The 640px CSS viewport check is only a proxy for zoom reflow.
- Physical-phone testing is unavailable in the current environment; the user confirmed they do not have a phone for this review. Emulated mobile results do not satisfy this requirement.
- Investigate the increased lab CLS and measure on representative hardware.
- Verify animation cleanup, gestures, focus and overflow across supported states and record the results.
- Confirm the latest Node 22 CI, production screenshots and a rollback commit in the focused pull request before merging to `main`.
