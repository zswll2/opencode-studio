# Add Complete i18n Framework with Chinese (zh-CN) Translation

## TL;DR

> **Quick Summary**: Add next-intl internationalization framework to opencode-studio, extract ~650 hardcoded English strings into en.json, create zh-CN.json with Chinese translations, add language switcher to sidebar bottom, and refactor backend error responses to use error codes for frontend translation.
> 
> **Deliverables**:
> - Complete i18n infrastructure using next-intl (no URL-based locale routing)
> - `en.json` with all extracted English strings (~650 keys)
> - `zh-CN.json` with Chinese translations
> - Language switcher in sidebar bottom (cookies persistence)
> - Backend error codes for ~30 static error messages
> - All 8 native `confirm()` dialogs replaced with AlertDialog
> - SEO metadata translated
> 
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 1 → Task 2 → Tasks 3-8 → Task 9 → Task 10 → Task 11

---

## Context

### Original Request
User wants to add Chinese translation to their fork of opencode-studio, preferring a complete i18n framework (not just Chinese-only) so future languages can be added by simply creating new locale files.

### Interview Summary
**Key Discussions**:
- i18n scope: Complete framework (not just Chinese) — enables future languages
- Backend strategy: Frontend translates error messages via error codes (backend returns `{ error: "msg", code: "CODE" }`)
- Language switcher placement: Sidebar bottom
- Library choice: next-intl (best Next.js App Router integration)

**Research Findings**:
- 67 TSX files total (13 pages + 46 components + 8 UI primitives)
- ~650 hardcoded English strings (more than initial estimate of 400-450)
- NO existing i18n setup at all
- All text is inline in JSX
- 119 toast messages, 40 setError messages, 8 native confirm() dialogs, 50 help content strings
- Backend has 68 error responses (~30 static, ~20 dynamic runtime errors)
- App is 100% client components ("use client")

### Metis Review
**Identified Gaps** (addressed):
- localStorage vs cookies conflict: Resolved → use cookies (next-intl standard)
- Path corrections: Frontend at `client-next/src/`, not `/src/`
- Native confirm() dialogs: Must replace with AlertDialog for i18n compatibility
- Dynamic backend errors: Only ~30 static errors get codes, dynamic ones keep `error` field
- Provider hierarchy: NextIntlClientProvider must wrap inside AppProvider, not RootLayout
- SEO metadata: Included in scope
- ICU message format needed for pluralization (en: "plugin(s)" vs zh-CN: no plural)

---

## Work Objectives

### Core Objective
Add a production-ready i18n framework to opencode-studio that supports English and Chinese, with clean string extraction, language switching, and backend error code integration.

### Concrete Deliverables
- `client-next/src/i18n/request.ts` — i18n configuration
- `client-next/messages/en.json` — English strings (~650 keys, namespaced by page/component)
- `client-next/messages/zh-CN.json` — Chinese translations
- `client-next/src/components/language-switcher.tsx` — Language selector component
- Modified `client-next/src/components/sidebar.tsx` — Switcher in bottom section
- Modified `client-next/next.config.ts` — Wrapped with createNextIntlPlugin()
- Modified `server/index.js` — Error codes added to ~30 static error responses
- All 67 TSX files updated to use `useTranslations()` + `t('key')`
- All 8 `confirm()` calls replaced with AlertDialog components

### Definition of Done
- [ ] `cd client-next && npm run build` succeeds with zero errors
- [ ] Language switcher visible in sidebar bottom
- [ ] Switching to Chinese translates ALL visible text
- [ ] Language preference persists across page reloads (cookies)
- [ ] `<html lang="">` attribute updates dynamically
- [ ] Backend API returns `{ error: "msg", code: "CODE" }` format (backward compatible)
- [ ] Frontend shows translated error messages when backend returns error codes
- [ ] Zero native `confirm()` dialogs remain

### Must Have
- next-intl "without i18n routing" mode (no `/zh` URL prefix)
- Cookie-based locale persistence
- ICU message format for dynamic strings (plural, interpolation)
- Namespace-based translation files (by page/component)
- Backward-compatible backend error responses (keep `error` field, add `code` field)
- English fallback when translation key missing
- `<html lang="">` updates on language switch

### Must NOT Have (Guardrails)
- ❌ NO URL-based locale routing (`/en/...`, `/zh/...`) — use "without i18n routing" mode
- ❌ NO localStorage for locale persistence — use cookies only
- ❌ NO changes to shadcn/ui base components (`client-next/src/components/ui/*`)
- ❌ NO translation of code blocks, CLI commands, file paths, or Monaco editor content
- ❌ NO translation of console.log messages (developer-facing)
- ❌ NO refactoring of `page-help-dialog.tsx` data structure — extract strings only
- ❌ NO changes to ThemeProvider → AppProvider → AppShell nesting order
- ❌ NO more than 2 locales (en, zh-CN) — lock scope
- ❌ NO removal of existing `error` field from backend responses (additive only)
- ❌ NO translation of dynamic runtime errors (`err.message` 500s)
- ❌ NO AI slop: excessive comments on every `t()` call, unnecessary abstraction layers, or "internationalization utility helper" classes
- ❌ NO OAuth HTML template extraction in this plan (separate concern, separate PR)

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (no test framework found)
- **Automated tests**: None (not setting up test infrastructure for this i18n work)
- **Framework**: none

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — navigate, switch language, snapshot text, screenshot
- **Backend**: Use Bash (curl) — send requests, assert response fields
- **Build**: Use Bash — `npm run build`, verify exit code 0

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — infrastructure):
├── Task 1: Install next-intl + i18n infrastructure setup [quick]
└── Task 2: Language switcher component + sidebar integration [visual-engineering]

Wave 2 (After Wave 1 — string extraction, MAX PARALLEL):
├── Task 3: Extract strings — sidebar + app-shell + error boundary + layout metadata [unspecified-high]
├── Task 4: Extract strings — settings page (~80 strings) [unspecified-high]
├── Task 5: Extract strings — quickstart + auth pages (~85 strings) [unspecified-high]
├── Task 6: Extract strings — dialogs (MCP, Skill, Plugin, BulkImport, Help) (~125 strings) [unspecified-high]
├── Task 7: Extract strings — remaining pages (mcp, skills, plugins, commands, agents, profiles, logs, rules, usage, config, editor) [unspecified-high]
├── Task 8: Extract strings — remaining components (cards, presets, permissions, etc.) [unspecified-high]
└── Task 9: Backend error codes (~30 static errors) [unspecified-high]

Wave 3 (After Wave 2 — Chinese translation + integration):
├── Task 10: Create zh-CN.json + wire backend error code translation + replace confirm() [deep]
└── Task 11: Toast/error integration + ICU format for dynamic strings [deep]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high + playwright)
└── Task F4: Scope fidelity check (deep)
→ Present results → Get explicit user okay

Critical Path: Task 1 → Task 2 → Tasks 3-9 → Task 10 → Task 11 → F1-F4 → user okay
Max Concurrent: 7 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2-9 | 1 |
| 2 | 1 | 3-8 | 1 |
| 3 | 1, 2 | 10 | 2 |
| 4 | 1, 2 | 10 | 2 |
| 5 | 1, 2 | 10 | 2 |
| 6 | 1, 2 | 10 | 2 |
| 7 | 1, 2 | 10 | 2 |
| 8 | 1, 2 | 10 | 2 |
| 9 | — | 10, 11 | 2 |
| 10 | 3-9 | 11 | 3 |
| 11 | 9, 10 | F1-F4 | 3 |

### Agent Dispatch Summary

- **Wave 1** (2 tasks): T1 → `quick`, T2 → `visual-engineering`
- **Wave 2** (7 tasks): T3-T8 → `unspecified-high`, T9 → `unspecified-high`
- **Wave 3** (2 tasks): T10 → `deep`, T11 → `deep`
- **FINAL** (4 tasks): F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [ ] 1. Install next-intl + i18n infrastructure setup

  **What to do**:
  - Run `cd client-next && npm install next-intl`
  - Create `client-next/src/i18n/request.ts` — configure next-intl for "without i18n routing" mode (no `[locale]` URL segments)
  - Wrap `client-next/next.config.ts` with `createNextIntlPlugin()` from next-intl
  - Create `client-next/messages/en.json` skeleton with namespace structure: `{ "common": {}, "sidebar": {}, "settings": {}, "quickstart": {}, "auth": {}, "mcp": {}, "skills": {}, "plugins": {}, "commands": {}, "agents": {}, "profiles": {}, "logs": {}, "rules": {}, "usage": {}, "config": {}, "editor": {}, "errors": {}, "help": {} }`
  - Create a client-side `NextIntlClientProvider` wrapper component that reads locale from cookie and provides translations
  - Place this wrapper inside the existing `AppProvider` in `client-next/src/app/layout.tsx` (NOT replacing ThemeProvider/AppProvider, wrapping inside them)
  - Update `<html lang="">` attribute dynamically based on cookie locale (default "en")

  **Must NOT do**:
  - Do NOT use localStorage for locale persistence
  - Do NOT create URL-based locale routing (no `/zh/` prefix)
  - Do NOT modify ThemeProvider or AppProvider internals
  - Do NOT change the nesting order of existing providers

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Tasks 2-9
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `client-next/src/app/layout.tsx` — Root layout with ThemeProvider → AppProvider hierarchy. NextIntlClientProvider must go INSIDE AppProvider.
  - `client-next/next.config.ts` — Current Next.js config to wrap with createNextIntlPlugin()
  - `client-next/package.json` — Current dependencies, Next.js version (16.1.1), React version (19.2.3)

  **External References**:
  - next-intl "without i18n routing" docs: https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing
  - next-intl `createNextIntlPlugin` API: https://next-intl.dev/docs/getting-started/app-router

  **WHY Each Reference Matters**:
  - layout.tsx: Must understand the exact provider nesting to insert NextIntlClientProvider correctly
  - next.config.ts: Must wrap with createNextIntlPlugin to enable next-intl
  - next-intl docs: "Without i18n routing" mode is the correct mode (no URL locale prefix)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Build succeeds with i18n infrastructure
    Tool: Bash
    Preconditions: next-intl installed, config files created
    Steps:
      1. cd client-next && npm run build
      2. Check exit code is 0
    Expected Result: Build completes with zero errors
    Failure Indicators: Build fails, TypeScript errors about next-intl types
    Evidence: .sisyphus/evidence/task-1-build.txt

  Scenario: en.json skeleton is valid JSON with all namespaces
    Tool: Bash
    Preconditions: en.json created
    Steps:
      1. cat client-next/messages/en.json | jq 'keys'
      2. Verify output contains: ["common", "sidebar", "settings", "quickstart", "auth", "mcp", "skills", "plugins", "commands", "agents", "profiles", "logs", "rules", "usage", "config", "editor", "errors", "help"]
    Expected Result: All 18 namespace keys present
    Failure Indicators: Missing namespaces, invalid JSON
    Evidence: .sisyphus/evidence/task-1-namespaces.txt

  Scenario: NextIntlClientProvider wraps AppProvider content
    Tool: Bash
    Preconditions: layout.tsx modified
    Steps:
      1. grep -n "NextIntlClientProvider" client-next/src/app/layout.tsx
      2. grep -n "AppProvider" client-next/src/app/layout.tsx
      3. Verify NextIntlClientProvider line number > AppProvider line number
    Expected Result: NextIntlClientProvider is inside/after AppProvider in the component tree
    Failure Indicators: NextIntlClientProvider is outside AppProvider or missing
    Evidence: .sisyphus/evidence/task-1-provider-order.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): install next-intl and configure i18n infrastructure`
  - Files: client-next/package.json, client-next/package-lock.json, client-next/src/i18n/request.ts, client-next/next.config.ts, client-next/messages/en.json, client-next/src/app/layout.tsx
  - Pre-commit: `cd client-next && npm run build`

- [ ] 2. Language switcher component + sidebar integration

  **What to do**:
  - Create `client-next/src/components/language-switcher.tsx` — a dropdown/popover component showing language options (English, 中文)
  - Use cookie to read/write locale preference (useCookies from next-intl or document.cookie)
  - On language change: update cookie, call `useLocale()` setter or router.refresh() to apply new locale
  - Add language switcher to `client-next/src/components/sidebar.tsx` bottom section (near ThemeToggle, line ~148-194)
  - Use a Globe icon (lucide-react) for the switcher button
  - Update `<html lang="">` attribute when language changes

  **Must NOT do**:
  - Do NOT use localStorage
  - Do NOT add URL-based locale routing
  - Do NOT modify the ThemeToggle component itself
  - Do NOT add excessive comments or wrapper abstractions

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-design`]
    - `frontend-design`: UI component creation with proper design quality

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 1)
  - **Parallel Group**: Wave 1 (with Task 1, sequential)
  - **Blocks**: Tasks 3-8
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `client-next/src/components/sidebar.tsx:148-194` — Bottom section of sidebar where ThemeToggle lives. Language switcher goes here.
  - `client-next/src/components/sidebar.tsx:1-30` — Existing imports and component structure to match
  - `client-next/src/components/ui/dropdown-menu.tsx` — shadcn dropdown component to use for language selector

  **API/Type References**:
  - next-intl `useLocale`, `useTranslations` hooks for client components

  **External References**:
  - next-intl client component usage: https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing#client-components

  **WHY Each Reference Matters**:
  - sidebar.tsx bottom section: Exact location to add the switcher — must coexist with ThemeToggle
  - dropdown-menu.tsx: Reuse existing shadcn component for consistent UI
  - next-intl docs: Correct hook usage for "without routing" mode

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Language switcher appears in sidebar
    Tool: Playwright
    Preconditions: App running on http://192.168.10.100:1080
    Steps:
      1. Navigate to http://192.168.10.100:1080
      2. Take snapshot of sidebar bottom area
      3. Look for Globe icon or language-related element
    Expected Result: Language switcher element visible in sidebar bottom area
    Failure Indicators: No language switcher element found
    Evidence: .sisyphus/evidence/task-2-switcher-visible.png

  Scenario: Switching to Chinese updates page content
    Tool: Playwright
    Preconditions: App running, English is current language
    Steps:
      1. Click language switcher
      2. Select "中文" option
      3. Take snapshot of sidebar navigation labels
      4. Verify sidebar labels changed from English to Chinese (or at minimum, component re-rendered)
    Expected Result: Sidebar text updates after switching (even if still English because no zh-CN.json yet, the mechanism works)
    Failure Indicators: No visible change, error in console, page crash
    Evidence: .sisyphus/evidence/task-2-language-switch.png

  Scenario: Language preference persists after reload
    Tool: Playwright
    Preconditions: Language set to "中文" via switcher
    Steps:
      1. Set language to "中文"
      2. Reload page (navigate to same URL)
      3. Check cookie value for locale
      4. Take snapshot
    Expected Result: Page reloads with "中文" still selected (cookie persists)
    Failure Indicators: Language reverts to English after reload
    Evidence: .sisyphus/evidence/task-2-persistence.png
  ```

  **Commit**: YES
  - Message: `feat(i18n): add language switcher to sidebar`
  - Files: client-next/src/components/language-switcher.tsx, client-next/src/components/sidebar.tsx
  - Pre-commit: `cd client-next && npm run build`

- [ ] 3. Extract strings — sidebar + app-shell + error boundary + layout metadata

  **What to do**:
  - Extract all hardcoded strings from `client-next/src/components/sidebar.tsx` (~30 strings: nav labels, tooltips, dialog text) into `messages/en.json` under `"sidebar"` namespace
  - Extract strings from `client-next/src/components/app-shell.tsx` (~20 strings: disconnected landing page, setup instructions, "Waiting for backend...", WIP banner)
  - Extract strings from `client-next/src/app/error.tsx` (~5 strings: "Something went wrong", "Try again", "Go home")
  - Extract strings from `client-next/src/app/not-found.tsx` (~5 strings: 404 page text)
  - Extract SEO metadata from `client-next/src/app/layout.tsx` (~15 strings: title, description, OG tags, Twitter cards, JSON-LD)
  - Replace all extracted strings with `t('key')` calls using `useTranslations('namespace')` hook
  - Add `useTranslations` import to each modified file

  **Must NOT do**:
  - Do NOT modify `client-next/src/components/ui/*` files
  - Do NOT refactor component structure — only replace strings
  - Do NOT extract dynamic values (variable names, URLs) — only the surrounding text

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4-9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `client-next/src/components/sidebar.tsx` — Navigation labels (MCP, Skills, Plugins, etc.), tooltips, disconnect dialog text, version info
  - `client-next/src/components/app-shell.tsx` — Disconnected state messages, "WORK IN PROGRESS" banner, setup instructions
  - `client-next/src/app/error.tsx` — Error boundary text
  - `client-next/src/app/not-found.tsx` — 404 page text
  - `client-next/src/app/layout.tsx` — Page title, description, OG meta tags

  **WHY Each Reference Matters**:
  - sidebar.tsx: Highest-visibility component — users see it on every page. Nav labels are the first thing translated.
  - app-shell.tsx: Contains the disconnected state which is the first thing users see before connecting
  - error.tsx/not-found.tsx: Error states need clear Chinese messaging
  - layout.tsx: SEO metadata affects search engine indexing in Chinese

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Sidebar navigation labels use translation keys
    Tool: Bash
    Preconditions: Strings extracted from sidebar.tsx
    Steps:
      1. grep -c 'useTranslations' client-next/src/components/sidebar.tsx
      2. grep -c 't(' client-next/src/components/sidebar.tsx
      3. Verify both counts > 0
    Expected Result: At least 1 useTranslations import and multiple t() calls
    Failure Indicators: No useTranslations or t() calls found — strings still hardcoded
    Evidence: .sisyphus/evidence/task-3-sidebar-translation.txt

  Scenario: Build succeeds after string extraction
    Tool: Bash
    Preconditions: All strings extracted and replaced with t() calls
    Steps:
      1. cd client-next && npm run build
      2. Check exit code
    Expected Result: Build succeeds with zero errors
    Failure Indicators: TypeScript errors about missing translation keys or type mismatches
    Evidence: .sisyphus/evidence/task-3-build.txt

  Scenario: en.json contains sidebar namespace with all nav labels
    Tool: Bash
    Preconditions: en.json updated
    Steps:
      1. cat client-next/messages/en.json | jq '.sidebar | keys'
      2. Verify nav label keys present (e.g., "mcp", "skills", "plugins", "settings", etc.)
    Expected Result: Sidebar namespace has keys for all navigation items
    Failure Indicators: Missing nav label keys in sidebar namespace
    Evidence: .sisyphus/evidence/task-3-sidebar-keys.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): extract strings from sidebar, app-shell, error boundary, and layout`
  - Files: client-next/messages/en.json, sidebar.tsx, app-shell.tsx, error.tsx, not-found.tsx, layout.tsx
  - Pre-commit: `cd client-next && npm run build`

- [ ] 4. Extract strings — settings page (~80 strings)

  **What to do**:
  - Extract all ~80 hardcoded strings from `client-next/src/app/settings/page.tsx` into `messages/en.json` under `"settings"` namespace
  - This is the largest page — includes labels, descriptions, toggle names, select options, help text
  - Replace all strings with `t('key')` calls using `useTranslations('settings')`
  - Also extract strings from `client-next/src/app/settings/code/page.tsx` (~15 strings) under `"settings"` namespace

  **Must NOT do**:
  - Do NOT refactor settings page component structure
  - Do NOT extract CSS class names, HTML attributes, or component props
  - Do NOT translate technical identifiers (config key names, API field names)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5-9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `client-next/src/app/settings/page.tsx` — Largest page (~80 strings). Contains labels, descriptions, toggles, selects, help text for all settings categories.
  - `client-next/src/app/settings/code/page.tsx` — Code settings sub-page (~15 strings)

  **WHY Each Reference Matters**:
  - settings/page.tsx: Highest string count of any page. Must be thorough — missing strings here will be very visible.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Settings page builds and renders with translation keys
    Tool: Bash
    Preconditions: Settings strings extracted
    Steps:
      1. grep -c 't(' client-next/src/app/settings/page.tsx
      2. Verify count > 20 (page has ~80 strings)
      3. cd client-next && npm run build
    Expected Result: Many t() calls and build succeeds
    Failure Indicators: Build fails, or very few t() calls (incomplete extraction)
    Evidence: .sisyphus/evidence/task-4-settings-extraction.txt

  Scenario: en.json settings namespace has substantial content
    Tool: Bash
    Steps:
      1. cat client-next/messages/en.json | jq '.settings | length'
      2. Verify count > 30
    Expected Result: Settings namespace has 40+ keys
    Failure Indicators: Less than 30 keys — incomplete extraction
    Evidence: .sisyphus/evidence/task-4-settings-keys.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): extract strings from settings pages`
  - Files: client-next/messages/en.json, client-next/src/app/settings/page.tsx, client-next/src/app/settings/code/page.tsx
  - Pre-commit: `cd client-next && npm run build`

- [ ] 5. Extract strings — quickstart + auth pages (~85 strings)

  **What to do**:
  - Extract ~50 strings from `client-next/src/app/quickstart/page.tsx` into `"quickstart"` namespace
  - Extract ~35 strings from `client-next/src/app/auth/page.tsx` into `"auth"` namespace
  - Replace all strings with `t('key')` calls
  - Handle dynamic interpolation strings (e.g., `${provider} login`) with ICU format: `{provider} 登录`

  **Must NOT do**:
  - Do NOT translate CLI commands or code blocks in quickstart
  - Do NOT translate API provider names (OpenAI, Anthropic, etc.)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3-4, 6-9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `client-next/src/app/quickstart/page.tsx` — Setup wizard with step descriptions, button labels, status text, code blocks (do NOT translate code blocks)
  - `client-next/src/app/auth/page.tsx` — Auth provider list, login/logout buttons, status indicators

  **WHY Each Reference Matters**:
  - quickstart: First-time user experience — high impact for Chinese users
  - auth: Authentication flow must be clear in Chinese

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Quickstart and auth pages build with translations
    Tool: Bash
    Steps:
      1. grep -c 't(' client-next/src/app/quickstart/page.tsx
      2. grep -c 't(' client-next/src/app/auth/page.tsx
      3. cd client-next && npm run build
    Expected Result: Both files have many t() calls, build succeeds
    Failure Indicators: Build fails, or minimal t() calls
    Evidence: .sisyphus/evidence/task-5-extraction.txt

  Scenario: en.json has quickstart and auth namespaces with substantial content
    Tool: Bash
    Steps:
      1. cat client-next/messages/en.json | jq '.quickstart | length'
      2. cat client-next/messages/en.json | jq '.auth | length'
    Expected Result: quickstart > 20 keys, auth > 15 keys
    Failure Indicators: Either namespace has < 10 keys
    Evidence: .sisyphus/evidence/task-5-keys.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): extract strings from quickstart and auth pages`
  - Files: client-next/messages/en.json, quickstart/page.tsx, auth/page.tsx
  - Pre-commit: `cd client-next && npm run build`

- [ ] 6. Extract strings — dialogs (MCP, Skill, Plugin, BulkImport, Help) (~125 strings)

  **What to do**:
  - Extract ~25 strings from `client-next/src/components/add-mcp-dialog.tsx` into `"dialogs"` namespace with sub-keys like `dialogs.addMcp.*`
  - Extract ~30 strings from `client-next/src/components/add-skill-dialog.tsx` into `"dialogs.addSkill.*"`
  - Extract ~20 strings from `client-next/src/components/add-plugin-dialog.tsx` into `"dialogs.addPlugin.*"`
  - Extract ~10 strings from `client-next/src/components/bulk-import-dialog.tsx` into `"dialogs.bulkImport.*"`
  - Extract ~50 strings from `client-next/src/components/page-help-dialog.tsx` into `"help"` namespace — extract VALUES from the `helpContent` Record (title, description, usage, tips[]), keep the key structure as namespace keys (e.g., `help.agents.title`)
  - Extract ~15 strings from `client-next/src/components/pending-action-dialog.tsx`
  - Extract ~15 strings from `client-next/src/components/update-required-modal.tsx`
  - Handle setError() validation messages (~40 total across dialogs) — extract these too
  - Replace all strings with `t('key')` calls

  **Must NOT do**:
  - Do NOT refactor the `helpContent` Record structure — just extract string values
  - Do NOT modify dialog component logic or props

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3-5, 7-9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `client-next/src/components/add-mcp-dialog.tsx` — MCP server add dialog with form fields, validation errors, server type selection
  - `client-next/src/components/add-skill-dialog.tsx` — Skill creation dialog with URL input, name validation
  - `client-next/src/components/add-plugin-dialog.tsx` — Plugin add dialog
  - `client-next/src/components/bulk-import-dialog.tsx` — Bulk import with URL parsing
  - `client-next/src/components/page-help-dialog.tsx` — Help content data object with structured help for each page
  - `client-next/src/components/pending-action-dialog.tsx` — Pending action confirmation
  - `client-next/src/components/update-required-modal.tsx` — Update required notification

  **WHY Each Reference Matters**:
  - page-help-dialog.tsx has the largest structured data (50 strings) with nested Records — extraction pattern here affects all other help content
  - setError() messages across dialogs are form validation — must be in Chinese for usability

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All dialog components use translations
    Tool: Bash
    Steps:
      1. for f in add-mcp-dialog add-skill-dialog add-plugin-dialog bulk-import-dialog page-help-dialog pending-action-dialog update-required-modal; do echo "$f: $(grep -c 't(' client-next/src/components/$f.tsx)"; done
      2. cd client-next && npm run build
    Expected Result: Each file has multiple t() calls, build succeeds
    Failure Indicators: Any file with 0 t() calls, build failure
    Evidence: .sisyphus/evidence/task-6-dialogs-extraction.txt

  Scenario: Help content namespace has entries for all pages
    Tool: Bash
    Steps:
      1. cat client-next/messages/en.json | jq '.help | keys'
    Expected Result: Keys for all pages that have help content (mcp, skills, plugins, settings, etc.)
    Failure Indicators: Missing help keys for major pages
    Evidence: .sisyphus/evidence/task-6-help-keys.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): extract strings from dialog components`
  - Files: client-next/messages/en.json, add-mcp-dialog.tsx, add-skill-dialog.tsx, add-plugin-dialog.tsx, bulk-import-dialog.tsx, page-help-dialog.tsx, pending-action-dialog.tsx, update-required-modal.tsx
  - Pre-commit: `cd client-next && npm run build`

- [ ] 7. Extract strings — remaining pages (mcp, skills, plugins, commands, agents, profiles, logs, rules, usage, config, editor) (~155 strings)

  **What to do**:
  - Extract ~30 strings from `client-next/src/app/mcp/page.tsx` into `"mcp"` namespace
  - Extract ~15 strings from `client-next/src/app/skills/page.tsx` into `"skills"` namespace
  - Extract ~15 strings from `client-next/src/app/plugins/page.tsx` into `"plugins"` namespace
  - Extract ~25 strings from `client-next/src/app/commands/page.tsx` into `"commands"` namespace
  - Extract ~25 strings from `client-next/src/app/agents/page.tsx` into `"agents"` namespace
  - Extract ~20 strings from `client-next/src/app/profiles/page.tsx` into `"profiles"` namespace
  - Extract ~15 strings from `client-next/src/app/logs/page.tsx` into `"logs"` namespace
  - Extract ~10 strings from `client-next/src/app/rules/page.tsx` into `"rules"` namespace
  - Extract ~30 strings from `client-next/src/app/usage/page.tsx` into `"usage"` namespace
  - Extract ~10 strings from `client-next/src/app/config/page.tsx` into `"config"` namespace
  - Extract ~15 strings from `client-next/src/app/editor/page.tsx` into `"editor"` namespace
  - Replace all strings with `t('key')` calls

  **Must NOT do**:
  - Do NOT modify page logic or component structure
  - Do NOT extract Monaco editor content or code blocks

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3-6, 8-9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `client-next/src/app/mcp/page.tsx` — MCP server listing, status, search
  - `client-next/src/app/skills/page.tsx` — Skill cards, create button
  - `client-next/src/app/plugins/page.tsx` — Plugin management
  - `client-next/src/app/commands/page.tsx` — Command list, search, categories
  - `client-next/src/app/agents/page.tsx` — Agent configuration, model selection
  - `client-next/src/app/profiles/page.tsx` — Profile switching, creation
  - `client-next/src/app/logs/page.tsx` — Log viewer
  - `client-next/src/app/rules/page.tsx` — Rules editor
  - `client-next/src/app/usage/page.tsx` — Usage statistics, quota display
  - `client-next/src/app/config/page.tsx` — Raw JSON config editor
  - `client-next/src/app/editor/page.tsx` — File editor

  **WHY Each Reference Matters**:
  - These 11 pages collectively have ~155 strings. Each page is independent so extraction is straightforward.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All remaining pages use translations
    Tool: Bash
    Steps:
      1. for page in mcp skills plugins commands agents profiles logs rules usage config editor; do echo "$page: $(grep -c 't(' client-next/src/app/$page/page.tsx 2>/dev/null || echo 0)"; done
      2. cd client-next && npm run build
    Expected Result: Each page has t() calls (varies by string count), build succeeds
    Failure Indicators: Any page with 0 t() calls, build failure
    Evidence: .sisyphus/evidence/task-7-pages-extraction.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): extract strings from remaining pages`
  - Files: client-next/messages/en.json, all 11 page files
  - Pre-commit: `cd client-next && npm run build`

- [ ] 8. Extract strings — remaining components (cards, presets, permissions, etc.) (~90 strings)

  **What to do**:
  - Extract ~10 strings from `client-next/src/components/mcp-card.tsx` into `"common"` or `"mcp"` namespace
  - Extract ~5 strings from `client-next/src/components/skill-card.tsx` into `"common"` or `"skills"` namespace
  - Extract ~5 strings from `client-next/src/components/plugin-card.tsx` into `"common"` or `"plugins"` namespace
  - Extract ~10 strings from `client-next/src/components/agent-card.tsx` into `"common"` or `"agents"` namespace
  - Extract ~20 strings from `client-next/src/components/account-pool-card.tsx` into `"common"` namespace
  - Extract ~15 strings from `client-next/src/components/presets-manager.tsx` into `"common"` namespace
  - Extract ~15 strings from `client-next/src/components/permission-editor.tsx` into `"common"` namespace
  - Extract ~10 strings from `client-next/src/components/sincronizado-card.tsx` into `"common"` namespace
  - Extract ~5 strings from `client-next/src/components/quota-bar.tsx` into `"common"` namespace
  - Extract shared/common strings (button labels like "Save", "Cancel", "Delete", "Edit", "Close") into `"common"` namespace if not already there
  - Replace all strings with `t('key')` calls

  **Must NOT do**:
  - Do NOT modify `client-next/src/components/ui/*` files
  - Do NOT extract aria-labels that are purely for accessibility (translate those separately if needed)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3-7, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `client-next/src/components/mcp-card.tsx` — MCP server card with status, actions
  - `client-next/src/components/skill-card.tsx` — Skill card with name, description
  - `client-next/src/components/plugin-card.tsx` — Plugin card
  - `client-next/src/components/agent-card.tsx` — Agent config card
  - `client-next/src/components/account-pool-card.tsx` — Account pool management
  - `client-next/src/components/presets-manager.tsx` — Preset selection/management
  - `client-next/src/components/permission-editor.tsx` — Permission patterns editor
  - `client-next/src/components/sincronizado-card.tsx` — Sync card
  - `client-next/src/components/quota-bar.tsx` — Quota display with time formatting

  **WHY Each Reference Matters**:
  - These are shared components used across multiple pages. quota-bar.tsx has time formatting that needs ICU pluralization.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All remaining components use translations
    Tool: Bash
    Steps:
      1. for comp in mcp-card skill-card plugin-card agent-card account-pool-card presets-manager permission-editor sincronizado-card quota-bar; do echo "$comp: $(grep -c 't(' client-next/src/components/$comp.tsx)"; done
      2. cd client-next && npm run build
    Expected Result: Components have t() calls, build succeeds
    Failure Indicators: Any component with 0 t() calls that previously had hardcoded strings
    Evidence: .sisyphus/evidence/task-8-components-extraction.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): extract strings from remaining components`
  - Files: client-next/messages/en.json, all component files listed above
  - Pre-commit: `cd client-next && npm run build`

- [ ] 9. Backend error codes (~30 static errors)

  **What to do**:
  - Identify all ~30 static error responses in `server/index.js` (responses with hardcoded English error strings like `{ error: "Config not found" }`)
  - Add a `code` field to each: `{ error: "Config not found", code: "CONFIG_NOT_FOUND" }`
  - Create a mapping table at top of server/index.js or in a separate file: `const ERROR_CODES = { CONFIG_NOT_FOUND: "Config not found", ... }`
  - Use the mapping: `res.status(404).json({ error: ERROR_CODES.CONFIG_NOT_FOUND, code: "CONFIG_NOT_FOUND" })`
  - Keep existing `error` field for backward compatibility
  - Do NOT touch dynamic errors that use `err.message` or template literals with runtime values
  - Add ~5 generic codes for common patterns: `INTERNAL_ERROR`, `VALIDATION_ERROR`, `NOT_FOUND`, `UNAUTHORIZED`, `FORBIDDEN`

  **Must NOT do**:
  - Do NOT remove or rename the existing `error` field
  - Do NOT attempt to code dynamic runtime errors (`err.message` 500s)
  - Do NOT translate backend error messages — keep them English
  - Do NOT change HTTP status codes
  - Do NOT modify API route signatures

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (independent of frontend work)
  - **Parallel Group**: Wave 2 (with Tasks 3-8)
  - **Blocks**: Tasks 10, 11
  - **Blocked By**: None (independent of frontend i18n)

  **References**:

  **Pattern References**:
  - `server/index.js:1191` — Example static error: `res.status(404).json({ error: "Config not found" })`
  - `server/index.js:1198` — Example validation error: `res.status(400).json({ error: "Invalid permission value..." })`
  - `server/profile-manager.js:55` — Example: `return res.status(409).json({ error: "Profile already exists" })`

  **API/Type References**:
  - Frontend error handling pattern (used in 20+ files): `const msg = err.response?.data?.error || err.message || "Unknown error"; toast.error(msg);`

  **WHY Each Reference Matters**:
  - server/index.js lines with static errors: These are the ~30 targets to add codes to
  - Frontend error pattern: The `err.response?.data?.error` pattern means adding `code` field is backward compatible — existing code still reads `error`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Backend returns error code alongside error message
    Tool: Bash (curl)
    Preconditions: Server running on port 1920
    Steps:
      1. curl -s http://localhost:1920/api/config -X PUT -H "Content-Type: application/json" -d '{}' | jq '{error, code}'
      2. Verify response has both "error" (string) and "code" (string) fields
      3. code field should be uppercase with underscores (e.g., "CONFIG_NOT_FOUND")
    Expected Result: Response contains { "error": "...", "code": "CONFIG_NOT_FOUND" }
    Failure Indicators: Missing "code" field, code is not uppercase/underscored format
    Evidence: .sisyphus/evidence/task-9-error-code.txt

  Scenario: Backward compatibility — error field still present
    Tool: Bash (curl)
    Steps:
      1. curl -s http://localhost:1920/api/profiles -X POST -H "Content-Type: application/json" -d '{"name":"__test_existing__"}' | jq '.error'
      2. Verify error message is still a readable English string
    Expected Result: "error" field contains the same English message as before
    Failure Indicators: Error field is missing or changed
    Evidence: .sisyphus/evidence/task-9-backward-compat.txt

  Scenario: Error code mapping covers all static errors
    Tool: Bash
    Steps:
      1. grep -c 'code:' server/index.js
      2. Verify count >= 25 (should be ~30 static errors coded)
    Expected Result: At least 25 error code additions in server/index.js
    Failure Indicators: Less than 25 — incomplete coverage
    Evidence: .sisyphus/evidence/task-9-code-count.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): add error codes to backend API responses`
  - Files: server/index.js
  - Pre-commit: `node -e "require('./server/index.js')" 2>&1 | head -1 || echo "Syntax check done"`

- [ ] 10. Create zh-CN.json + wire backend error code translation + replace confirm() dialogs

  **What to do**:
  - Create `client-next/messages/zh-CN.json` with Chinese translations for ALL keys in `en.json`
  - Use the same namespace structure as en.json
  - Translation quality: natural Chinese, not machine-translated feeling. Use standard Chinese UI terminology:
    - "Settings" → "设置", "Save" → "保存", "Cancel" → "取消", "Delete" → "删除"
    - "Add" → "添加", "Edit" → "编辑", "Search" → "搜索", "Close" → "关闭"
    - "Loading..." → "加载中...", "Error" → "错误", "Success" → "成功"
  - Create frontend error code translation utility: a function that maps backend `code` to translated message
  - Update frontend error handling pattern from `err.response?.data?.error` to: prefer translated error code, fallback to original error message
  - Add `errors` namespace to en.json with all backend error codes as keys
  - Find all 8 native `confirm()` calls across the codebase and replace with shadcn AlertDialog components
  - Each AlertDialog must use `useTranslations()` for its title, description, and button labels

  **Must NOT do**:
  - Do NOT use machine translation — write natural Chinese
  - Do NOT change backend error messages to Chinese (keep English in backend)
  - Do NOT break existing error handling (backward compatible)
  - Do NOT create a new "error translation service" class — a simple lookup function is enough
  - Do NOT add excessive comments explaining translations

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
    - Reason: Requires understanding all previously extracted strings, writing quality Chinese translations, and wiring error code integration across the app

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (with Task 11, sequential)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 3-9

  **References**:

  **Pattern References**:
  - `client-next/messages/en.json` — Source of all keys that need Chinese translations
  - `client-next/src/components/ui/alert-dialog.tsx` — shadcn AlertDialog component to use for confirm() replacements
  - Error handling pattern in 20+ files: `const msg = err.response?.data?.error || err.message || "Unknown error"; toast.error(msg);`

  **API/Type References**:
  - Backend error code mapping (created in Task 9): `CONFIG_NOT_FOUND`, `INVALID_PERMISSION`, `MISSING_AGENT_NAME`, etc.

  **WHY Each Reference Matters**:
  - en.json: Direct copy to zh-CN.json with values translated — 1:1 key mapping required
  - alert-dialog.tsx: Must use this component for confirm() replacements to maintain consistent UI
  - Error pattern: Must add code-based lookup BEFORE the existing error fallback

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: zh-CN.json has same keys as en.json
    Tool: Bash
    Steps:
      1. diff <(jq -r 'paths | join(".")' client-next/messages/en.json | sort) <(jq -r 'paths | join(".")' client-next/messages/zh-CN.json | sort)
      2. Check for any differences
    Expected Result: No differences — exact same key structure
    Failure Indicators: Missing or extra keys in zh-CN.json
    Evidence: .sisyphus/evidence/task-10-key-parity.txt

  Scenario: zh-CN.json values are Chinese (not English)
    Tool: Bash
    Steps:
      1. jq -r '.. | strings' client-next/messages/zh-CN.json | head -20
      2. Verify values contain Chinese characters (Unicode range \u4e00-\u9fff)
    Expected Result: At least 90% of sampled values contain Chinese characters
    Failure Indicators: Values are still English or empty
    Evidence: .sisyphus/evidence/task-10-chinese-values.txt

  Scenario: Error code translation works
    Tool: Playwright
    Preconditions: App running, language set to Chinese
    Steps:
      1. Switch language to 中文
      2. Trigger an error (e.g., try to create profile with existing name)
      3. Verify error message appears in Chinese
    Expected Result: Error toast shows Chinese message (not English error code)
    Failure Indicators: Raw error code shown, or English message when Chinese expected
    Evidence: .sisyphus/evidence/task-10-error-translation.png

  Scenario: No native confirm() dialogs remain
    Tool: Bash
    Steps:
      1. grep -rn 'confirm(' client-next/src/ --include="*.tsx" | grep -v 'node_modules' | grep -v '// ' | grep -v 'const'
      2. Count remaining confirm() calls
    Expected Result: Zero confirm() calls in component code
    Failure Indicators: Any confirm() calls remaining
    Evidence: .sisyphus/evidence/task-10-no-confirm.txt

  Scenario: Build succeeds with zh-CN translations
    Tool: Bash
    Steps:
      1. cd client-next && npm run build
    Expected Result: Exit code 0
    Failure Indicators: Build errors
    Evidence: .sisyphus/evidence/task-10-build.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): add Chinese translation, wire error codes, replace confirm dialogs`
  - Files: client-next/messages/zh-CN.json, client-next/messages/en.json (errors namespace), various files with confirm() replacements
  - Pre-commit: `cd client-next && npm run build`

- [ ] 11. Toast/error integration + ICU format for dynamic strings

  **What to do**:
  - Find all 119 toast calls across the codebase that still use hardcoded English strings
  - Replace each with `t('namespace.toastKey', { variables })` pattern
  - Use ICU message format for dynamic toasts:
    - Pluralization: `{count, plural, one{# plugin} other{# plugins}}` → zh-CN: `{count} 个插件`
    - Interpolation: `Added {count} plugin(s)` → `已添加 {count} 个插件`
  - Find all `setError()` validation messages across dialog components and replace with translated versions
  - Update the common error handling utility to handle both `err.response?.data?.code` (translated) and `err.response?.data?.error` (fallback) patterns
  - Ensure "Unknown error" and similar fallback messages are also translated
  - Verify the `common` namespace in en.json has shared toast patterns (success/error prefixes)

  **Must NOT do**:
  - Do NOT change toast component behavior or styling
  - Do NOT create a "toast translation middleware" — just replace strings directly
  - Do NOT over-abstract the ICU format — use simple interpolation where pluralization isn't needed

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []
    - Reason: Requires systematically finding and replacing 119+ toast calls with correct ICU format

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after Task 10)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 9, 10

  **References**:

  **Pattern References**:
  - Toast usage across 20+ files: `toast.success("Config saved")`, `toast.error("Failed to load MCP servers")`, `toast.error(err.response?.data?.error || "Unknown error")`
  - `client-next/src/components/add-mcp-dialog.tsx` — Example of setError() validation: `setError("name", { message: "Server name is required" })`
  - `client-next/src/components/quota-bar.tsx` — Time formatting: `${hours}h ${mins}m` needs ICU formatting

  **External References**:
  - next-intl ICU message format: https://next-intl.dev/docs/usage/messages#icu-messageformat
  - ICU plural rules: https://formatjs.io/docs/core-concepts/icu-syntax/#plural-format

  **WHY Each Reference Matters**:
  - Toast pattern: Understanding the exact toast.error()/toast.success() call pattern is essential for systematic replacement
  - setError pattern: Validation messages use a different pattern than toasts
  - ICU docs: Must use correct syntax for pluralization (Chinese has no plural form, but English does)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Toast messages use translation keys
    Tool: Bash
    Steps:
      1. grep -rn 'toast\.\(success\|error\|info\)(' client-next/src/ --include="*.tsx" | grep -v "t(" | grep -v "//" | head -20
      2. Count remaining hardcoded toast strings
    Expected Result: Fewer than 5 hardcoded toast strings remaining (only unavoidable ones like dynamic err.message passthrough)
    Failure Indicators: Many hardcoded toast strings remaining
    Evidence: .sisyphus/evidence/task-11-toast-check.txt

  Scenario: Dynamic toasts use ICU format in en.json
    Tool: Bash
    Steps:
      1. grep -c 'plural' client-next/messages/en.json
      2. grep -c '{count}' client-next/messages/en.json
    Expected Result: At least a few plural and interpolation entries
    Failure Indicators: No ICU format usage — dynamic strings still hardcoded
    Evidence: .sisyphus/evidence/task-11-icu-format.txt

  Scenario: Full app renders correctly in both languages
    Tool: Playwright
    Preconditions: App running
    Steps:
      1. Navigate to http://192.168.10.100:1080
      2. Switch to Chinese
      3. Visit settings page — snapshot
      4. Open MCP dialog — snapshot
      5. Switch back to English
      6. Visit same pages — snapshot
      7. Verify no console errors in either language
    Expected Result: All pages render correctly in both languages with no errors
    Failure Indicators: Missing translations (key shown raw), console errors, layout breaks
    Evidence: .sisyphus/evidence/task-11-full-render.png

  Scenario: Build succeeds
    Tool: Bash
    Steps:
      1. cd client-next && npm run build
    Expected Result: Exit code 0
    Failure Indicators: Build errors
    Evidence: .sisyphus/evidence/task-11-build.txt
  ```

  **Commit**: YES
  - Message: `feat(i18n): wire toast/error translation and ICU format for dynamic strings`
  - Files: client-next/messages/en.json, client-next/messages/zh-CN.json, 20+ files with toast calls
  - Pre-commit: `cd client-next && npm run build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> Do NOT auto-proceed after verification. Wait for user's explicit approval.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `cd client-next && npm run build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments on t() calls, unnecessary wrapper classes. Verify no hardcoded English strings remain in modified files (excluding imports, types, CSS).
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start both server and frontend. Execute full walkthrough: (1) Switch to Chinese via sidebar, (2) Visit every page, (3) Open every dialog, (4) Trigger error scenarios, (5) Verify no English text leaks, (6) Switch back to English, (7) Verify persistence after reload. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Verify no `localStorage` usage for locale, no URL locale routing, no ui/* component modifications.
  Output: `Tasks [N/N compliant] | VERDICT`

---

## Commit Strategy

- **Task 1**: `feat(i18n): install next-intl and configure i18n infrastructure` — client-next/package.json, client-next/src/i18n/request.ts, client-next/next.config.ts, client-next/messages/en.json (skeleton)
- **Task 2**: `feat(i18n): add language switcher to sidebar` — client-next/src/components/language-switcher.tsx, client-next/src/components/sidebar.tsx
- **Tasks 3-8**: `feat(i18n): extract strings from {scope}` — client-next/messages/en.json (append), respective TSX files
- **Task 9**: `feat(i18n): add error codes to backend API responses` — server/index.js
- **Task 10**: `feat(i18n): add Chinese (zh-CN) translation` — client-next/messages/zh-CN.json
- **Task 11**: `feat(i18n): wire error code translation and replace confirm() dialogs` — various files
- Pre-commit each: `cd client-next && npm run build`

---

## Success Criteria

### Verification Commands
```bash
# Build must pass
cd client-next && npm run build  # Expected: exit 0, no errors

# No hardcoded English strings remain in app/ and components/ (excluding imports, types, CSS)
grep -rn '"[A-Z][a-z]' client-next/src/app/ --include="*.tsx" | grep -v "import\|useTranslations\|className\|console\|type\|interface\|aria-\|data-\|http\|fetch\|NEXT_PUBLIC"
grep -rn '"[A-Z][a-z]' client-next/src/components/ --include="*.tsx" | grep -v "import\|useTranslations\|className\|console\|type\|interface\|aria-\|data-\|ui/"

# Backend error codes present
curl -s http://localhost:1920/api/config -X PUT -H "Content-Type: application/json" -d '{}' | jq '.code'  # Expected: "CONFIG_NOT_FOUND" or similar error code

# Language cookie works
# (Playwright: set cookie, reload, verify Chinese text)
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build passes with zero errors
- [ ] No hardcoded English in app/ and components/ (excluding allowed patterns)
- [ ] zh-CN.json has same keys as en.json
- [ ] Language switcher functional in sidebar
- [ ] Language persists on reload via cookies
- [ ] `<html lang="">` updates dynamically
- [ ] Backend returns error codes alongside error messages
