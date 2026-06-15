# Polish Home Page: Remove Student Names + Add Smooth Scroll/3D Effects

## What gets removed
- **`TopStudent` section** (the "Vinh danh học viên xuất sắc" Hall of Fame card with "Nguyễn Trần Ngân Giang") — deleted entirely.
- **`StudentsWall` section** (the 12-student avatar collage with all names like "Phạm Tường Nguyên", "Đỗ Thuỳ Linh"...) — deleted entirely.
- **`Testimonials` section** — keep the layout and quotes, but replace each personal name with a neutral generic label (e.g. "Học viên IELTS · 2026", "Ứng viên band 7.5") and replace initials with a small icon. No real or invented names anywhere on the home page.

## What gets added (scroll & 3D effects)

All effects are CSS / lightweight React (IntersectionObserver + `scroll` listeners) — no heavy 3D library, keeps it smooth on mobile.

1. **Hero — 3D tilt + parallax**
   - Floating chat-mock card on the right gets a subtle mouse-follow 3D tilt (`transform: perspective(1000px) rotateX/rotateY`) that eases back when the cursor leaves.
   - Background blob and the "Band 7.5" badge translate at different speeds as the user scrolls (parallax depth: -0.15, +0.25).
   - Headline characters fade-in with a staggered slide on first paint.

2. **Sticky scroll-progress bar**
   - A thin gradient bar fixed to the top that fills as the user scrolls the page. Pure CSS + a single scroll listener.

3. **Section reveals upgraded**
   - Extend the existing `Reveal` component with a `parallax` variant that translates the section ±20px based on its position in the viewport, giving a layered "depth" feel as users scroll.
   - Add a `3d-tilt-on-scroll` modifier for the Stats cards and Feature cards: cards rotate from `rotateX(8deg)` → `rotateX(0)` as they enter view.

4. **Trend chart — animated draw on scroll**
   - The SVG band-progress line re-draws (stroke-dashoffset animation) every time it scrolls back into view, not just on first load.
   - Add floating particles behind the gradient card that drift slowly (CSS keyframes, GPU-only `transform` & `opacity`).

5. **CTA section — magnetic button + glow follow**
   - The "Bắt đầu miễn phí" button gets a magnetic hover (the button nudges 6–8px toward the cursor) and a soft glow that follows pointer position.

6. **Smooth scrolling globally**
   - Add `scroll-behavior: smooth` and `@media (prefers-reduced-motion: reduce)` guards so all effects gracefully disable for users who opt out.

## Files to change
- `src/routes/index.tsx` — remove `TopStudent` + `StudentsWall`, anonymize `Testimonials`, wire new effects into Hero / TrendShowcase / CTA.
- `src/components/Reveal.tsx` — add `parallax` and `tilt` variants.
- `src/styles.css` — add keyframes (`drift`, `tilt-in`, `draw-line`), `.scroll-progress`, `.magnetic-btn` utilities, reduced-motion guard.
- New `src/components/ScrollProgress.tsx` — the top progress bar, mounted in `AppShell` (home only, or globally if you prefer).
- New `src/hooks/useTilt.ts` — mouse-tilt hook for the hero card and CTA button.

## Out of scope
- No three.js/WebGL (kept lightweight, smooth on phones).
- No copy changes outside the removed sections and anonymized testimonial labels.
- No backend or routing changes.
