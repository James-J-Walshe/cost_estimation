# Defect Pipeline Config — Project Estimating Tool

## Project

- **App name:** Project Estimating Tool
- **Local URL:** http://127.0.0.1:5500
- **Production URL:** https://james-j-walshe.github.io/cost_estimation
- **GitHub remote:** https://github.com/James-J-Walshe/cost_estimation
- **Deploy branch:** main
- **Deploy method:** GitHub Pages — auto-deploys on push to main

## Source files in scope

- `style.css` — primary stylesheet
- `index.html` — app markup
- `js/` — JavaScript modules
- `modules/` — additional JS modules

## Defect folder structure

- `defects/` — ticket .md files and screenshot image files
- `defects/test-screenshots/` — before/after and live verification screenshots
- Marker files (created automatically by agents):
  - `[ticket-name].in-progress` — triage complete, fix in progress
  - `[ticket-name].deployed` — fix pushed to main
  - `[ticket-name].resolved` — fix verified live on production

## On-load behaviour

When loading the app for testing:
1. Dismiss welcome modal by clicking the dark backdrop outside it.
   If that fails, click "Start New Project Manually"
2. Dismiss cookie banner by clicking Decline

## Agent responsibilities

- triage-agent: read-only — analyses ticket and produces fix spec
- fix-agent: writes to source files only — minimum change principle
- test-agent: read-only + Playwright — screenshots local app to verify
- deploy-agent: runs git commands only — commits and pushes to main
- verify-agent: read-only + Playwright — screenshots live site to confirm
