# Zyantik Cost Modelling Tool — Design Brief
Updated: March 2026 — reflects refactored style.css (zinc/teal enterprise direction)

---

## Brand

- **Product name:** Zyantik Cost Modelling Tool
- **Design direction:** Zinc / Teal Enterprise
- **Target users:** ICT project managers, finance leads, enterprise delivery teams
- **Tone:** Professional, enterprise-grade, clean, high data density without clutter

---

## Colour Palette

All colours are defined as CSS custom properties in `:root`. The review agent
should flag any colour in the UI that does not match these values.

### Brand
| Token | Value | Usage |
|---|---|---|
| `--brand` | `#0d9488` | Primary accent — active tabs, links, buttons, left border on primary metric card, table year header, focus rings |
| `--brand-dark` | `#0f766e` | Brand hover state |
| `--brand-light` | `#f0fdfa` | Brand tinted backgrounds — selected radio, status banners |
| `--brand-border` | `#99f6e4` | Brand tinted borders |

### Neutrals (Zinc scale)
| Token | Value | Usage |
|---|---|---|
| `--zinc-50` | `#fafafa` | Page background, row hover |
| `--zinc-100` | `#f4f4f5` | Subtle backgrounds, table header bg, sidebar bg |
| `--zinc-200` | `#e4e4e7` | Default borders |
| `--zinc-300` | `#d4d4d8` | Strong borders |
| `--zinc-400` | `#a1a1aa` | Muted text, card sub-labels |
| `--zinc-500` | `#71717a` | Secondary text |
| `--zinc-600` | `#52525b` | Table header text, inactive nav |
| `--zinc-700` | `#3f3f46` | Grid menu item labels |
| `--zinc-900` | `#18181b` | Primary text, headings |

### Semantic
| Token | Value | Usage |
|---|---|---|
| `--success` | `#059669` | Success text |
| `--success-bg` | `#f0fdf4` | Success alert background, internal badge bg |
| `--success-border` | `#bbf7d0` | Success alert border |
| `--danger` | `#dc2626` | Danger buttons, error text |
| `--danger-bg` | `#fef2f2` | Error alert background |
| `--danger-border` | `#fecaca` | Error alert border |
| `--warning` | `#d97706` | Warning text |
| `--warning-bg` | `#fffbeb` | Warning background |
| `--warning-border` | `#fde68a` | Warning border |
| `--info` | `#2563eb` | Info text, external badge text |
| `--info-bg` | `#eff6ff` | Info background, external badge bg |
| `--info-border` | `#bfdbfe` | Info border |

### Surfaces
| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#fafafa` | Page / app background |
| `--bg-surface` | `#ffffff` | Cards, panels, header, tab nav, table rows |
| `--bg-subtle` | `#f4f4f5` | Sidebar, section backgrounds, table headers |
| `--border` | `#e4e4e7` | All default borders |
| `--border-strong` | `#d4d4d8` | Emphasis borders on hover |

### Text
| Token | Value | Usage |
|---|---|---|
| `--text-primary` | `#18181b` | Headings, table cell names, primary values |
| `--text-secondary` | `#71717a` | Labels, table body cells, inactive tabs |
| `--text-muted` | `#a1a1aa` | Helper text, card sub-labels, empty states |
| `--text-on-brand` | `#ffffff` | Text on brand-coloured backgrounds |

---

## Typography

- **Font stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`
- **Base line height:** `1.5`
- **Font smoothing:** antialiased

### Type Scale
| Token | Value | Usage |
|---|---|---|
| `--text-xs` | `11px` | Badge text, uppercase table headers, muted labels |
| `--text-sm` | `12px` | Table cells, dropdown items, form labels, tab buttons |
| `--text-base` | `13px` | Body text default |
| `--text-md` | `14px` | Header title, panel headings, section headings |
| `--text-lg` | `16px` | Settings/user view h1 |
| `--text-xl` | `20px` | Scope numbers |
| `--text-2xl` | `24px` | Metric card values |

### Font weights
- `500` — medium, used for labels, names, active states
- `600` — semibold, used for headings, panel titles, table header text
- `700` — bold, used for metric values, total rows, cost amounts

---

## Spacing System

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |

Standard content padding: `--space-5` (20px)
Standard card/panel padding: `--space-4` (16px)

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `4px` | Table inputs, small inline elements |
| `--radius-md` | `6px` | Buttons, form inputs, dropdown items |
| `--radius-lg` | `8px` | Cards, panels, table containers, dropdowns |
| `--radius-xl` | `12px` | Modals |
| `--radius-pill` | `999px` | Badges, user badge |

---

## Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Medium elevation |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Dropdowns, modals |

No gradients. No decorative shadows on cards or panels.

---

## Layout

- **Header height:** `52px` — white background, 1px bottom border, sticky
- **Tab nav height:** `40px` — white background, 1px bottom border
- **Sidebar width:** `260px` (settings and user views)
- **App background:** `--bg-page` (#fafafa)

---

## Component Standards

### Header
- White background, `1px solid --border` bottom, sticky
- Logo: `--brand` square, `--radius-md`, 30×30px, logo image filtered to white
- Gap between logo and title text: minimum `--space-3` (12px) — if the logo
  and title overlap or touch at any point this must be flagged as an error
- Header left section layout: `display: flex; align-items: center; gap: var(--space-3)`
  — the logo, any divider, and the title must be visually separated with clear space
- Title: `--text-md`, weight 600, `--text-primary`
- Project name: `--text-sm`, `--text-secondary`
- Buttons: standard `.btn` (white bg, zinc border) or `.btn-primary` (teal bg)

### Tab Navigation
- White background, `1px solid --border` bottom
- Inactive: `--text-secondary`, transparent bottom border
- Active: `--brand` text, `2px solid --brand` bottom border only — no background colour change

### Metric / Summary Cards
- White background, `1px solid --border`, `--radius-lg`
- Label: `--text-xs`, uppercase, `letter-spacing: 0.05em`, `--text-muted`
- Value: `--text-2xl`, weight 700, `--text-primary`, `letter-spacing: -0.5px`
- Sub-label: `--text-xs`, `--text-muted`
- Primary card only: `border-left: 3px solid --brand`

### Info and Breakdown Rows
- Minimum row padding: `--space-2` (8px) top and bottom per row
- Minimum row height: 32px — flag any rows that appear cramped or tighter than this
- Label text: `--text-sm`, `--text-secondary`
- Value text: `--text-sm`, weight 500, `--text-primary`
- Row divider: `1px solid --zinc-100`
- Last row in a section: no bottom border
- Subtotal row: `--space-3` (12px) top padding, `1px solid --border` top border,
  weight 600, `--text-primary`
- Total row: `--space-3` (12px) top padding, `2px solid --border` top border,
  weight 700, `--brand` colour for both label and value
- If rows in the Cost Breakdown, Project Information, or any info panel appear
  visually cramped — insufficient whitespace between rows — this must be flagged

### Tables
- Container: white bg, `1px solid --border`, `--radius-lg`
- Year header: `--brand` background, white text, weight 600
- Month header: `--bg-subtle` background, `--zinc-600` text, uppercase `--text-xs`
- Body cells: `--text-secondary`
- Name / first column: `--text-primary`, weight 500
- Total column: `--brand`, weight 700
- Row hover: `--zinc-50`
- Footer: `--bg-subtle`, `2px solid --border` top, weight 700

### Buttons
- Standard: white bg, `1px solid --border`, `--zinc-600` text, height 32px, `--radius-md`
- Primary: `--brand` bg, white text
- Danger: `#dc2626` bg, white text
- Ghost: transparent bg and border

### Forms
- Input height: 36px, `1px solid --border`, `--radius-md`
- Focus: `--brand` border + `rgba(13,148,136,0.1)` ring

### Badges
- Internal: `--success-bg` bg, `#166534` text
- External: `--info-bg` bg, `#1d4ed8` text
- Height 20px, `--radius-pill`, `--text-xs`, weight 600

### Sidebar Navigation
- Background: `--bg-subtle`
- Active: `--bg-surface` bg, `--brand` text, `2px solid --brand` left border

### Modals
- Backdrop: `rgba(0,0,0,0.4)`
- Content: white, `--radius-xl`, `1px solid --border`, `--shadow-lg`

---

## What Was Removed — Do Not Reintroduce

- Purple/indigo gradient header (`linear-gradient(135deg, #667eea, #764ba2)`)
- Gradient summary cards
- Hardcoded `#4f46e5` indigo as primary accent
- Decorative `box-shadow` on `.app-container`
- `max-width` centering on `.app-container`

---

## Review Agent Instructions

When evaluating screenshots against this brief, flag issues in these categories:

1. **Colour consistency** — any colour not matching the token values above, especially purple/indigo from the old design
2. **Typography** — incorrect size, weight, or colour for the context
3. **Spacing** — inconsistent padding or margins, including cramped row spacing in info and breakdown panels
4. **Component standards** — gradients where flat colour is specified, wrong border radius, wrong background colour, logo overlapping title text
5. **Contrast** — text that is hard to read against its background
6. **Consistency** — similar elements styled differently across tabs
7. **Leftover old styles** — any gradient, indigo accent, or heavy decorative shadow

Output feedback in this format for each issue:
- **Tab/Page:** [which page or tab]
- **Element:** [description or CSS selector]
- **Issue:** [what is wrong]
- **Fix:** [specific recommended change referencing token values from this brief]
