# Migration validation

The release review is still in progress. These results are local checks, not a substitute for CI or physical-device testing.

## Local checks, 2026-10-29

- Node 22.16.0: a clean `npm ci` in an isolated copy passed lint, build, 69 Vitest tests and 47 Playwright desktop/emulated-mobile tests; one desktop touch-only case was intentionally skipped. CI is configured for Node 22; its hosted result is still required.
- Production preview: `/raw/portfolio.md` returned 200 and matched `src/content/portfolio.md` byte for byte. Legacy fragments `#hero`, `#about`, `#projects` and `#skills` selected the corresponding journey destination.
- `dist/.experimental` was absent.
- An exploratory CSS 200% zoom check reached Contact. This is not a complete browser-zoom layout review.
- Production-preview captures: [desktop home](screenshots/desktop-home.png), [mobile-sized home](screenshots/mobile-home.png), and [desktop lab](screenshots/desktop-lab.png). The mobile capture is emulated.

### Lab performance comparison

Both production builds were served locally with Vite preview on the same machine. Five fresh Chromium contexts per build used a 390×844 viewport, reduced motion, 4× CPU slowdown, 150 ms latency and 1.6 Mbps download throughput. PerformanceObserver recorded LCP and layout shifts for five seconds after load. The baseline was built from commit `618547291d8d2a5c1aace83dd5b18a52ae68fa4d` with its lockfile; both builds used Node 24.15.0.

| Build | Median LCP | Median observed CLS |
| --- | ---: | ---: |
| Baseline | 2.296 s | 0.0008 |
| Migration | 1.808 s | 0.0258 |

The migration met the stated lab targets in this run, while its measured layout shift increased. These are local emulated results, not field data or a physical mobile benchmark; the shift should be investigated and the comparison repeated on representative hardware.

Three subsequent throttled production-preview loads recorded no layout-shift entries, including one with the Chromium cache disabled. The earlier shift could not be reproduced or attributed to an element, so the initial comparison remains recorded and the cause is unresolved.

The canvas lifecycle has an integration check for StrictMode setup, hidden-tab pause, resumption, Off mode, reduced motion and teardown. This does not prove all browser animation and gesture behavior.

Additional Chromium checks exercised keyboard navigation and form arrow keys, vertical overflow before wheel travel, horizontal wheel input, unprevented control-wheel zoom gestures, and an emulated sideways touch gesture. Physical touch hardware remains untested.

At 320×700 CSS pixels, a visual inspection confirmed that the hero controls and itinerary appear in the initial viewport; the lens continues below it in the scrollable destination. A targeted desktop and emulated-mobile check also verified that the focused first project disclosure is above the fixed itinerary. This is not a complete focus audit or 200% browser-zoom review.

## Outstanding release evidence

- Review all destinations against the approved desktop and mobile prototype, including 200% browser zoom and real mobile hardware.
- Physical-phone testing is unavailable in the current environment; the user confirmed they do not have a phone for this review. Emulated mobile results do not satisfy this requirement.
- Investigate the increased lab CLS and measure on representative hardware.
- Verify animation cleanup, gestures, focus and overflow across supported states and record the results.
- Confirm Node 22 CI, production screenshots and a rollback commit in the focused pull request before merging to `main`.
