---
name: Smart Library Management
description: A refined, scholarly library management system for university communities
colors:
  primary: "#1e3a5f"
  primary-hover: "#162d4a"
  primary-light: "rgba(30, 58, 95, 0.1)"
  primary-border: "rgba(30, 58, 95, 0.5)"
  ink-black: "#08060d"
  scholarly-muted: "#6b6375"
  white: "#ffffff"
  parchment: "#f4f3ec"
  quiet-border: "#e5e4e7"
  success: "#22c55e"
  danger: "#ef4444"
  warning: "#f59e0b"
  dark-bg: "#16171d"
  dark-surface: "#1f2028"
  dark-border: "#2e303a"
  dark-ink: "#f3f4f6"
  dark-muted: "#9ca3af"
typography:
  display:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(36px, 5vw, 56px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(20px, 3vw, 24px)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(16px, 1.2vw, 18px)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.01em"
  label:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
  label-large:
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.03em"
  mono:
    fontFamily: "ui-monospace, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "10px"
  pill: "12px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-disabled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-danger:
    backgroundColor: transparent
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  input-focus:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.md}"
  card-default:
    backgroundColor: "{colors.parchment}"
    rounded: "{rounded.lg}"
    padding: "20px 24px"
  card-analytics:
    backgroundColor: "{colors.parchment}"
    rounded: "{rounded.xl}"
    padding: "20px"
  badge:
    rounded: "{rounded.pill}"
    padding: "2px 10px"
---

# Design System: Smart Library Management

## Overview

**Creative North Star: "The Knowledge Commons"**

The Smart Library Management System presents itself as a refined, scholarly environment — the digital equivalent of a great university library's main hall. It is open and inviting, never imposing, with a quiet confidence that puts the collection and the patron's work first. The design earns trust through restraint: muted neutrals, generous breathing room, and a single, grounding Deep Navy accent used sparingly — like architectural wayfinding in a well-designed building — rather than as decoration.

The system lives in the **Operate** mode: every pixel serves task completion. Scanability, consistency, and native expectations outrank visual expression. The brand lives in precise details: the navy accent on interactive elements, the subtle lift of a card on hover, the deliberate rhythm of the layout. Nothing is decorative for its own sake.

**Key Characteristics:**
- Restrained, single-accent palette — Deep Navy as the sole declarative color, everything else tonal
- Typography-driven hierarchy using system fonts — clean, durable, no licensing dependencies
- Soft, lifted depth — gentle shadows at rest, subtle elevation on interaction
- Generous whitespace with a centered, columnar reading rhythm
- Purposeful polish — buttons lift on hover, inputs glow softly on focus, cards have presence
- Light and dark mode with equal attention to both

## Colors

A restrained, single-accent palette. Deep Navy is the only declarative color — everything else is tonal neutrals chosen for readability, warmth, and scholarly calm.

### Primary
- **Deep Navy** (#1e3a5f): The single accent color. Used for primary buttons, navigation branding, active links, and key interactive elements. **The One-Color Rule.** Only one accent exists in the system; it never competes. A second color signals a new meaning (success, danger, warning — see below).
- **Deep Navy Light** (rgba(30, 58, 95, 0.1)): Tonal surface for hover highlights, table row selection, and accent background fills.
- **Deep Navy Border** (rgba(30, 58, 95, 0.5)): Focus rings and accent borders.

### Neutral
- **Ink Black** (#08060d): High-emphasis text — headings, primary labels, key values.
- **Scholarly Muted** (#6b6375): Medium-emphasis text — body copy, secondary information, table headers, placeholders. Warm-muted, never grey.
- **White** (#ffffff): Page background (light mode).
- **Parchment** (#f4f3ec): Warm secondary surface for cards, code blocks, detail sections, and stat tiles. Provides subtle tonal depth without shadows.
- **Quiet Border** (#e5e4e7): Borders, dividers, and table row separators. Present but unobtrusive.

### Semantic
- **Success Green** (#22c55e): Status indicators, returned badges, success messages.
- **Danger Red** (#ef4444): Error messages, overdue indicators, fine amounts, delete actions.
- **Warning Amber** (#f59e0b): Pending reservation badges, intermediate states.

### Dark Mode
- **Dark Background** (#16171d): Page background.
- **Dark Surface** (#1f2028): Card and secondary surface background.
- **Dark Border** (#2e303a): Borders and dividers.
- **Dark Ink** (#f3f4f6): High-emphasis text.
- **Dark Muted** (#9ca3af): Medium-emphasis text.
- **Deep Navy** transforms to a lighter, more vibrant equivalent for equivalent contrast: use the tone that meets 4.5:1 against `--dark-bg` on interactive surfaces.

### Named Rules

**The One-Color Rule.** The Deep Navy accent occupies ≤10% of any given screen. Its rarity is its authority. A second accent color (green, red, amber) is always semantic and never decorative.

**The Warm Neutral Doctrine.** Neutrals lean slightly warm (`--parchment` over cool grey, `--scholarly-muted` with a violet-warm undertone). This keeps the system feeling human and inhabited, never clinical.

## Typography

**Display & Body Font:** `system-ui, 'Segoe UI', Roboto, sans-serif`
**Mono Font:** `ui-monospace, Consolas, monospace`

The system uses the native system font stack deliberately. In a university environment where students, faculty, and librarians access the system from diverse devices (Windows, macOS, Linux, Chromebooks, mobile), system-ui renders flawlessly on every platform with zero load cost. The result is clean, contemporary, and quietly confident — the typography equivalent of a well-maintained reading room where nothing distracts from the books.

**Character:** A single-family approach — one typeface for everything except code. Hierarchy is achieved through weight (500 for headings, 600 for labels, 400 for body), size, and color contrast, never by switching to a secondary face. This restraint is architectural and consistent with "The Knowledge Commons" philosophy: the collection leads, the frame recedes.

### Hierarchy
- **Display** (500 / clamp(36px, 5vw, 56px) / 1.0, -0.03em): Reserved for the page-level title on the homepage. Appears in Ink Black with full weight. Never used on interior pages.
- **Headline** (500 / clamp(20px, 3vw, 24px) / 1.18, -0.01em): Section headings across all pages — "Books", "My Loans", "Analytics", detail titles. The primary organizational signal.
- **Title** (600 / 16px / 1.4, 0): Card titles, field labels, and small heading contexts within surfaces.
- **Body** (400 / clamp(16px, 1.2vw, 18px) / 1.45, 0.01em): All reading text. Max line length should be kept to 65–75ch for readability (currently the centered 600px main-content column achieves this).
- **Label** (600 / 12px / 1.3, 0.04em uppercase): Table column headers, detail-field labels, stat tile titles. Always uppercase with generous letter-spacing. This is the system's most formal typographic voice.
- **Label Large** (600 / 14px / 1.3, 0.03em): Auth form labels, inline form headings, button text.
- **Mono** (400 / 15px / 1.35): Code blocks, technical identifiers (ISBN), counters.

### Named Rules

**The Single-Family Rule.** One typeface for everything except code. Weight, size, and color do the work. Never introduce a second display or heading face — it fragments the system's quiet authority.

**The Label Convention.** Table column headers, stat titles, and detail labels are always uppercase with letter-spacing. This is the system's most typographically formal gesture; overusing it dilutes its signal. Apply only to the top-level label in a section, not to nested or repeated labels.

## Layout

The layout follows a centered, columnar rhythm — like the axial plan of a classical reading room. Content sits in a single column that narrows reading width for text-heavy pages (600px for auth, detail, and dashboard) and expands for data-dense pages (analytics at 1000px, book detail grids at 600px with 2-column internal grids). The root container is capped at 1126px with a 1px border on the inline sides.

**Spatial rhythm:** The spacing scale proceeds in 4px steps: 8 / 12 / 16 / 20 / 24 / 32 px. The dominant rhythm is 16px (gaps between form fields, card internal padding) and 32px (page padding, section spacing).

**Density:**
- Page-level padding: 32px (desktop), 24px on the top/bottom and 20px on the sides (mobile below 1024px)
- Navigation bars: 16px vertical, 32px horizontal
- Cards: 24px internal padding (standard), 20px (analytics stat tiles)
- Tables: 12px vertical cell padding, 14px horizontal cell padding
- Buttons: 10px vertical, 20px horizontal

**Container behavior:** `#root` is `display: flex; flex-direction: column; min-height: 100svh` to ensure the footer always reaches the bottom of the viewport. Content within each page sits in a `<div className="page">` with `text-align: left`.

**Responsive behavior (below 1024px):**
- Base font drops from 18px to 16px
- Display size drops from 56px to 36px
- Detail grids collapse from 2-column to 1-column
- Analytics stat tiles stack
- Table cells remain readable but horizontal scroll is acceptable for data density

## Elevation & Depth

The system uses a **lifted, shadow-based depth model**. Surfaces have presence at rest through soft ambient shadows, and they communicate interactivity through elevated shadows on hover. This is a deliberate choice for "The Knowledge Commons" — like a well-lit reading room where tables and bookshelves have subtle presence but the attention stays on the work.

**The Shadow Vocabulary:**
- **Ambient Rest** (`box-shadow: rgba(0,0,0,0.1) 0 10px 15px -3px, rgba(0,0,0,0.05) 0 4px 6px -2px`): Default shadow for social links and interactive elements at rest. Soft, two-part shadow (long ambient + short offset) for natural depth.
- **Dark Ambient Rest** (`box-shadow: rgba(0,0,0,0.4) 0 10px 15px -3px, rgba(0,0,0,0.25) 0 4px 6px -2px`): Dark-mode equivalent with higher opacity to compensate for the dark background.

**Depth strategy:**
- Cards (`.profile-card`, `.healthcheck`, `.detail-card`, `.analytics-card`) use tonal background (`--parchment`) as their primary depth signal and may optionally use shadows for a more lifted appearance.
- Interactive elements (buttons, nav links, social links) use shadows at rest and amplify on hover.
- The system does not use tonal elevation layers (surface-container, surface-container-high, etc.) — depth is binary: flat background or lifted with shadow.

### Named Rules

**The Flat-By-Default Rule.** Page background and surfaces are flat. Shadows appear only on interactive elements at rest and amplify on hover. Cards use tonal contrast (Parchment on White) for their depth, reserving shadows for interactive signaling.

## Shapes

The form language is gently rounded — corners never sharp, never fully circular (except badges). The radius scale follows the material hierarchy: smaller elements get proportionally smaller radii.

- **Pills (12px):** Badges, status indicators, chips. The most rounded corner in the system.
- **Applied radius (10px):** Analytics cards — the largest surfaces, slightly softer.
- **Rounded containers (8px):** Detail cards, profile cards, inline forms, health check displays, code blocks. The dominant corner radius for mid-size containers.
- **Default rounded (6px):** Buttons, inputs, selects, textareas, search bars. The standard radius for interactive elements.
- **Slight curve (4px):** Code snippets, counter displays. Minimal rounding, almost square.

**Borders:** 1px solid `--quiet-border` (`#e5e4e7`). Used on table rows (bottom border only), analytics cards, inline forms, and secondary buttons. Primary buttons and containers are borderless (background-only).

**Focus rings:** 3px box-shadow in `--accent-bg` color (rgba(30, 58, 95, 0.1)) with a 2px `--accent-border` outline for keyboard navigation. Always use `outline: none` with `outline-offset: 2px` paired with the box-shadow — this ensures high-visibility focus for keyboard users without duplicating visual noise for mouse users.

### Named Rules

**The Consistent Radius Rule.** Interactive elements at the same hierarchy level share the same radius. Buttons and inputs are all 6px. Cards are all 8px. Never apply a different radius to a component that already has a defined shape in this system — radius is a system property, not a per-instance style.

## Components

### Buttons
- **Shape:** Gently rounded (6px), no borders on primary, 1px border on secondary and danger variants. 10px/20px internal padding (10px/14px for small variant).
- **Primary (`.btn-primary`):** Deep Navy background (`#1e3a5f`) with White text. Hover darkens to `#162d4a`. Disabled state at 0.6 opacity. The system's declarative action.
- **Secondary (`.btn-secondary`):** Transparent background with 1px `--quiet-border`, Ink Black text. Subtle, non-dominant action. Hover darkens the border.
- **Danger (`.btn-danger`):** Transparent background with 1px `#ef4444` border, red text. Hover intensifies. Reserved for destructive actions.
- **Small (`.btn-sm`):** Compact variant at 6px/14px padding and 13px font. Used inside table rows and tight spaces.
- **Transition:** All buttons transition opacity at 0.2s — a subtle, uniform response that doesn't draw attention to itself.

### Inputs & Text Fields
- **Style:** 1px solid `--quiet-border` with 6px radius, 10px/14px padding. White background (`--bg`), Ink Black text. Full width by default in form contexts.
- **Focus:** The border shifts to Deep Navy, accompanied by a 3px `--accent-bg` glow (`rgba(30, 58, 95, 0.1)`) — a soft, purposeful halo that signals focus without harshness.
- **Error:** Red text on a `rgba(239, 68, 68, 0.1)` background. Same border treatment as success states but in red.
- **Placeholder:** `--scholarly-muted` color at regular body weight.
- **Disabled / Loading:** 0.6 opacity, cursor not-allowed.

### Badges / Chips
- **Shape:** Pill shape (12px radius), 2px/10px vertical/horizontal padding, 13px bold. The most rounded element in the system.
- **Status vocabulary:**
  - **Available / Active / Fulfilled / OK:** Green background (`rgba(34, 197, 94, 0.15)`), green text.
  - **Overdue:** Red background (`rgba(239, 68, 68, 0.15)`), bold red text with 700 weight for urgency.
  - **Returned / Cancelled / Expired:** Grey background (`rgba(107, 114, 128, 0.15)`), grey text.
  - **Pending:** Amber background (`rgba(251, 191, 36, 0.15)`), amber text.
  - **Empty / Unavailable:** Red background (`rgba(239, 68, 68, 0.1)`), red text.

### Cards / Containers
- **Standard cards (`.detail-card`, `.profile-card`, `.healthcheck`, `.inline-form`):** Warm Parchment background (`#f4f3ec`), 8px radius, 24px internal padding. No border, no shadow. Depth comes from tonal contrast against White page background.
- **Analytics cards (`.analytics-card`):** Parchment background, 10px radius, 20px padding, 1px `--quiet-border` border. Slightly softer corners differentiate them as data display surfaces.
- **Detail grid (`.detail-grid`):** 2-column grid with 16px gap. Labels above values (stacked layout within each cell: label uppercase 12px, value 16px). Collapses to 1 column below 600px.

### Data Table
- **Structure:** Full-width `<table>` at 15px font size. Column headers are uppercase, 13px, 600 weight, `--scholarly-muted` color, with 2px bottom border. Body cells at 14px horizontal padding, 12px vertical padding, with 1px bottom row separator.
- **Interaction:** Row hover adds a subtle `--accent-bg` tint (`rgba(30, 58, 95, 0.1)`) — a barely perceptible signal that the row is interactive. Overdue rows get an additional `rgba(239, 68, 68, 0.05)` background wash.
- **Links inside tables:** Deep Navy color, no underline by default, underline on hover. Weight 500.

### Navigation
- **Bar:** Flex row, 16px/32px padding, 1px bottom border in `--quiet-border`. The only persistent chrome in the system.
- **Brand (`.nav-brand`):** Deep Navy, 24px, 700 weight. The single most visually assertive element — the one place the accent fills typography.
- **Links:** `--scholarly-muted` at 16px, 20px gap. Hover transitions to Ink Black. No underline, no background fill. Admin links sit alongside user links naturally — no visual distinction beyond the route path.
- **Auth state:** When logged in, the user's name replaces Register/Login links as a link to the dashboard. No avatar or icon — just their name in the link list.

### Analytics Charts
- **Stat tiles:** Parchment card (10px radius, border, 20px padding). Stat values rendered at 36px, 800 weight, in Ink Black (or semantic color for overdue counts). Subtitle in `--scholarly-muted` at 13px.
- **Chart cards:** Same card container. Charts use Recharts with Deep Navy as the line/bar color and `--accent-bg` as the fill for secondary bars. Tooltips match the card styling (Parchment background, 1px Quiet Border, 6px radius).
- **Loading state:** italic `--scholarly-muted` text "Loading..." inside the card — maintains layout, never collapses the container.
- **Empty state:** italic "No data yet." — same treatment, same presence.
- **Error state:** Danger red text on the error background inside the card.

### Fine Amounts
- Overdue fines: Red (`#ef4444`), bold, 16px. The system's most urgent typographic signal.
- Pending fines: `--scholarly-muted`, italic, 13px — deliberately understated.
- No fine: `--scholarly-muted`, em-dash placeholder, 13px.

## Do's and Don'ts

### Do:
- **Do** use Deep Navy sparingly — one accent per view, applied only to the primary action, brand mark, and active navigation.
- **Do** use warm-toned neutrals (Parchment, Scholarly Muted) over cool greys to keep the system feeling inhabited and scholarly.
- **Do** keep page content left-aligned — centered text is reserved for the home page hero only.
- **Do** use the Parchment card pattern to create visual hierarchy without shadows.
- **Do** use uppercase with letter-spacing for table headers and detail labels — this is the system's formal voice, reserve it for top-level labels only.
- **Do** maintain a max reading width of ~65–75ch for text content by using the 600px centered column.

### Don't:
- **Don't** introduce a second decorative accent color — green, red, and amber are semantic only.
- **Don't** use shadows on non-interactive surfaces (page background, static cards) — tonal contrast is the primary depth mechanism.
- **Don't** change border-radius per component type beyond the defined scale (6px inputs/buttons, 8px cards, 10px analytics cards, 12px badges).
- **Don't** add background colors to navigation links — nav links are text-only, gaining color on hover without container fills.
- **Don't** create new badge status colors beyond the five established (green, red, grey, amber, and the empty/unavailable red variant).
- **Don't** use the Danger Red for non-destructive purposes — it signals only errors, overdue items, and delete actions.