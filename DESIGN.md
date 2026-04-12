# GyneCare Hospital Management System — Design Brief

## Purpose & Context
Professional healthcare platform for gynecology-focused Indian hospital. Serves patients seeking prenatal/postnatal care, fertility services, and women's health; doctors managing schedules and patient records; admins managing operations. Users expect trust, clarity, accessibility in sensitive health context.

## Tone
Professional + Approachable. Not sterile corporate; human-centered. Warm but authoritative.

## Differentiation
Hospital UI that breaks medical design stereotypes: pink accents introduce warmth without compromising trust. Rounded shapes + elevated cards create approachability. Information hierarchy through spacing + typography, not visual noise.

## Color Palette

| Token | OKLCH | RGB Approx | Usage |
|-------|-------|-----------|-------|
| Primary | `0.45 0.15 260` | #1e40af | Buttons, headers, CTAs, trust-critical elements |
| Accent | `0.58 0.2 335` | #ec4899 | Highlights, active states, women-health branding |
| Secondary | `0.92 0.08 268` | #e0e7ff | Backgrounds, subtle fills |
| Foreground | `0.18 0 0` | #2d2d2d | Body text, labels |
| Background | `0.995 0 0` | #fafbfc | Page background, neutral zones |
| Muted | `0.93 0 0` | #f3f4f6 | Disabled, secondary backgrounds |
| Border | `0.88 0 0` | #e5e7eb | Dividers, input borders |
| Card | `1.0 0 0` | #ffffff | Elevated surfaces, modal overlays |
| Destructive | `0.55 0.22 25` | #dc2626 | Alerts, cancellations, errors |

## Typography

| Role | Font | Scale | Weight | Usage |
|------|------|-------|--------|-------|
| Display | Lora serif | 32px / 24px | 700/600 | Page headings, hero titles |
| Body | DM Sans | 16px / 14px | 400/500 | Paragraph text, UI labels |
| Mono | Geist Mono | 12px | 400 | Code, technical IDs, timestamps |

## Elevation & Depth

- **Card-elevated**: `shadow-hospital` (`0 4px 6px -1px`, `0 2px 4px -1px`) for primary content zones
- **Modal/Overlay**: `shadow-hospital-lg` (`0 10px 15px -3px`, `0 4px 6px -2px`) for floating dialogs
- **Border emphasis**: `border-border` (`#e5e7eb`) 1px for subtle edge definition
- **Gradient accent**: Blue→Pink gradient (`linear-gradient(135deg, primary, accent)`) for hero sections only

## Structural Zones

| Zone | Background | Border | Shadow | Usage |
|------|-----------|--------|--------|-------|
| Header | `bg-card border-b border-border` | Bottom 1px | None | Navigation, logo, account menu |
| Hero | `gradient-hospital text-white` | None | None | Full-width banner, CTA sections |
| Content Section | `bg-background` | None | None | Main body sections |
| Card | `bg-card` | `border border-border` | `shadow-hospital` | Doctor profiles, appointment slots, packages |
| Footer | `bg-muted/40 border-t border-border` | Top 1px | None | Hospital info, links, contact |
| Modal/Overlay | `bg-card` | `border border-border` | `shadow-hospital-lg` | Dialogs, confirmations, menus |

## Spacing & Rhythm

- Padding: `4px (xs)` → `8px (sm)` → `16px (md)` → `24px (lg)` → `32px (xl)` → `48px (2xl)`
- Gap between cards: `16px` (md)
- Section margins: `32px–48px` (lg–2xl) vertical
- Border radius: `12px (lg)` default; `8px (md)` compact; `4px (sm)` subtle; `9999px` buttons
- Grid: Mobile `1col`, Tablet `2col`, Desktop `3col+` (card-based layouts)

## Component Patterns

- **Buttons**: `btn-primary` (blue, full-width on mobile), `btn-secondary` (light, outline), `btn-accent` (pink, highlight CTAs like "Book Appointment")
- **Forms**: `input border-border bg-input rounded-md`, labels above fields, placeholder gray muted-foreground
- **Cards**: `card-elevated` with hover:shadow-hospital-lg, image on top (doctor), content below
- **Navigation**: Horizontal menu (header), sticky on scroll, brand logo left, account/login right
- **Mobile**: Hamburger menu (default `hidden md:flex`), full-width overlays, touch-friendly 48px min tap target

## Motion & Interaction

- **Default transition**: `transition-smooth` (all 0.3s cubic-bezier, applied to buttons, links, states)
- **Hover states**: `hover:opacity-90` (primary buttons), `hover:bg-accent/10` (cards), `hover:underline` (links)
- **Focus states**: `focus:ring-2 ring-ring` for accessibility
- **Loading**: Pulse animation on buttons/spinners (subtle, not distracting)
- **No animation**: Page load animations, parallax, bounce effects — keeps focus on content & forms

## Constraints & Anti-Patterns

- ✅ Do: One color palette, consistent spacing, card-based hierarchy, accessible contrast (AA+)
- ❌ Don't: Gradients everywhere, neon colors, drop-shadows deeper than hospital-lg, rounded-full except buttons/pills
- ❌ Don't: Mix serif + sans-serif beyond display/body intentionally, oversized hero images (healthcare context demands trust over flash)
- ❌ Don't: Animations on form interactions, carousel autoplay on appointments (users need control)

## Signature Detail

**Pink accent strip** on appointment cards & CTAs — a subtle but distinctive mark that humanizes the clinical blue base. Used sparingly (accent color, top-left border, or button state) to create gender-inclusive, warm healthcare brand.

## Responsive Strategy

- Mobile-first: Base styles mobile `px-4`, then `md: px-6 lg: px-8` padding
- Breakpoints: `sm (640px)` tablet, `md (768px)` layout shift, `lg (1024px)` desktop
- Touch targets: Min `48px × 48px` buttons on mobile
- Typography: Base `16px` mobile, `18px` desktop (avoid excessive scaling)
- Navigation: Hamburger menu `<md`, horizontal top nav `≥md`

## Dark Mode

Not implemented — light mode optimized for healthcare context (clinical, readable). Future: If added, maintain blue hue, raise lightness +0.2, reduce saturation 0.1 on secondary fills.
