# UI Improvement Loop — Implementation Plan

## Project Overview

This project implements an iterative AI-driven UI review and improvement loop for the
Zyantik Cost Modelling Tool (cost_estimation). Claude Code uses Playwright MCP to
autonomously navigate the running webapp, capture screenshots, review the UI against
design principles, and apply improvements directly to the HTML/CSS/JS source files.

---

## Architecture

```
Screenshot Agent → Review Agent → Change Agent → Loop
```

1. **Screenshot Agent** — Uses Playwright MCP to navigate each page and capture full-page PNGs
2. **Review Agent** — Feeds screenshots to a vision model with the design brief to produce structured feedback
3. **Change Agent** — Applies the structured feedback directly to source files
4. **Loop** — Re-screenshots and compares before/after, iterates until quality threshold is met

---

## Environment Setup

| Component | Status | Detail |
|---|---|---|
| Claude Code | Complete | v2.1.80, authenticated as Jamie |
| Node.js | Complete | v22.20.0 |
| Playwright MCP | Complete | Connected at user scope, chromium browser |
| Chromium browser | Complete | v1208, installed at AppData/Local/ms-playwright |
| VS Code Live Server | Complete | Running on Port 5500 |
| GitHub repo cloned | Complete | C:\Users\james\OneDrive\Documents\GitHub\cost_estimation |
| screenshots/ folder | Complete | Created in project root |
| pages.md | Complete | All tabs and routes documented |
| design-brief.md | Complete | Full zinc/teal token system documented |
| style.css | Complete | Refactored — zinc/teal enterprise design, ~480 lines |

### MCP Configuration

Working Playwright MCP config in `C:\Users\james\.claude.json`:

```json
"playwright": {
  "type": "stdio",
  "command": "cmd",
  "args": [
    "/c",
    "npx",
    "@playwright/mcp@latest",
    "--browser",
    "chromium"
  ],
  "env": {}
}
```

### Known Windows Gotchas

- Always launch Claude Code from **cmd**, not PowerShell
- Always say **"Playwright MCP"** explicitly in the first prompt of a session
- Chrome cannot be installed due to insufficient privileges — Chromium is used instead
- The MCP config must use `cmd /c` as separate args, not a single string

### How to Start Each Session

1. Open VS Code and load the project folder
2. Right-click `index.html` → **Open with Live Server** (confirm Port 5500 bottom right)
3. Open a **cmd** terminal via the terminal dropdown (not PowerShell)
4. Run `claude`
5. Type `/mcp` — confirm `playwright · ✓ connected`

---

## Current Progress

### Completed

- [x] Full environment setup (Claude Code, Node.js, Playwright MCP, Chromium, Live Server)
- [x] Resolved Windows-specific MCP configuration issues
- [x] Successfully captured first screenshot (`screenshots/01-home.png`)
- [x] Confirmed full pipeline is operational end-to-end
- [x] Created `pages.md` — all 7 tabs, header dropdowns, and settings panel documented
- [x] Created `design-brief.md` — full zinc/teal token system, component standards, review agent instructions
- [x] Redesigned and refactored `style.css` — zinc/teal enterprise direction, ~480 lines, CSS token system

### Not Started

- [ ] Phase 3 — Run Screenshot Agent (capture all pages)
- [ ] Phase 4 — Run Review Agent (evaluate UI against design brief)
- [ ] Phase 5 — Run Change Agent (apply fixes to source files)
- [ ] Phase 6 — Loop (re-screenshot, compare, iterate)

---

## Webapp Notes

- **App name:** Zyantik Cost Modelling Tool
- **Entry point:** `index.html`
- **Local URL:** `http://127.0.0.1:5500`
- **Tabs:** Summary, Resource Plan, Internal Resources, Vendor Costs, Tool Costs, Miscellaneous, Risks & Contingency
- **Header buttons:** Project functions grid (Save, Export etc), Settings dropdown (Project Information, Exchange Rate, Rate Cards)
- **On load:** Welcome modal appears — must be dismissed before reviewing UI
- **On load:** Cookie consent banner appears — must be dismissed before reviewing UI

---

## Phase 3 — Screenshot Agent Prompt

Copy this prompt into Claude Code exactly as written.
Make sure Live Server is running on port 5500 before starting.

```
Use Playwright MCP to do the following:

1. Navigate to http://127.0.0.1:5500
2. Wait for the page to fully load
3. If a welcome modal appears, close it by clicking the close button
4. If a cookie consent banner appears, dismiss it by clicking Accept or Decline
5. Take a full page screenshot and save to screenshots/01-home.png

Then capture each tab in sequence by clicking the tab button in the navigation:
6. Click the Summary tab — wait for content to load — screenshot to screenshots/02-summary.png
7. Click the Resource Plan tab — wait for content to load — screenshot to screenshots/03-resource-plan.png
8. Click the Internal Resources tab — wait for content to load — screenshot to screenshots/04-internal-resources.png
9. Click the Vendor Costs tab — wait for content to load — screenshot to screenshots/05-vendor-costs.png
10. Click the Tool Costs tab — wait for content to load — screenshot to screenshots/06-tool-costs.png
11. Click the Miscellaneous tab — wait for content to load — screenshot to screenshots/07-miscellaneous.png
12. Click the Risks & Contingency tab — wait for content to load — screenshot to screenshots/08-risks-contingency.png

Finally capture the header dropdowns:
13. Navigate back to http://127.0.0.1:5500 and dismiss any modals
14. Click the project functions button (grid icon, top right) — screenshot to screenshots/09-project-functions-menu.png
15. Close that menu, click the settings button (cog icon, top right) — screenshot to screenshots/10-settings-menu.png

Save all screenshots to the screenshots/ folder in this project.
Confirm when all 10 screenshots are saved.
```

---

## Phase 4 — Review Agent Prompt

Run this after Phase 3 is complete and all screenshots exist.

```
Review the screenshots in the screenshots/ folder against the design 
standards in design-brief.md.

For each screenshot, carefully examine:
- Colour usage — does it match the zinc/teal token system in design-brief.md?
- Typography — correct sizes, weights and colours per the type scale?
- Spacing — consistent with the spacing tokens?
- Component standards — header, tabs, cards, tables, buttons all matching spec?
- Contrast — is all text clearly readable?
- Consistency — are similar elements styled the same across tabs?
- Leftover old styles — any purple/indigo gradients or heavy shadows from the old design?

Output your findings as a structured list in this exact format:

ISSUE [number]
- Screenshot: [filename]
- Element: [CSS selector or plain description]
- Issue: [what is wrong]
- Fix: [specific change, referencing token values from design-brief.md where possible]

After listing all issues, provide a summary count by category
(colour, typography, spacing, component, contrast, consistency).
```

---

## Phase 5 — Change Agent Prompt

Run this after Phase 4 has produced a list of issues.

```
Apply the UI fixes identified in the review output above to the source 
files in this project (index.html, style.css, and any relevant JS files
in the js/ and modules/ folders).

Work through each issue in order. For each fix:
- Make the change directly to the relevant file
- Note which file and line was changed

After all fixes are applied, provide a summary table:
| Issue # | File changed | Change made |

Then re-run the screenshot agent on the pages that were changed
to confirm the fixes are visible.
```

---

## Phase 6 — Loop

After Phase 5, repeat from Phase 3 on the changed pages only:

```
Use Playwright MCP to re-screenshot the following pages and save them 
to screenshots/review-2/ folder:
[list only the pages that had fixes applied]

Then compare the new screenshots against the Phase 4 issues and confirm
which issues are resolved and which remain.
```

Repeat until all issues are resolved or accepted.

---

## Branch Strategy

Commit to GitHub after each full loop iteration so every state is recoverable:

```
git add .
git commit -m "UI loop iteration 1 — [summary of changes]"
git push
```

---

## Repository

**GitHub:** https://github.com/James-J-Walshe/cost_estimation
**Local path:** C:\Users\james\OneDrive\Documents\GitHub\cost_estimation
