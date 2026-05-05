# TestForge AI — Frontend Build Plan

A premium SaaS UI (Linear/Notion/Vercel feel) for an AI-powered SQA test case generator. Frontend-only with mocked data, simulated loading, and persisted state via localStorage.

## Design System

- **Brand**: TestForge AI — wordmark with a subtle anvil/spark logo mark
- **Theme**: Dark-first with light toggle. Deep navy background (#0B0F1A range), white text, electric blue accent (#3B82F6 → #6366F1 gradient), muted slate borders
- **Typography**: Inter (Geist alternative) — tight tracking on headings, clear hierarchy
- **Surfaces**: Large rounded corners (xl/2xl), soft shadows, subtle glass blur on overlays/cards, restrained gradient borders
- **Motion**: tw-animate-css fade/slide/scale on mount, hover-lift on cards, skeleton shimmers, animated number counters
- **Components**: shadcn/ui (already installed) — Card, Table, Dialog, Sheet, DropdownMenu, Sidebar, Tabs, Badge, Toast (sonner), Tooltip, Skeleton

## Routes (TanStack file-based)

Public:
- `/` — Landing page
- `/login`, `/signup` — Auth

App (shared layout with sidebar + topbar):
- `/app` — Dashboard home (stats, recent activity, coverage gauge)
- `/app/projects` — Projects list + create
- `/app/projects/$projectId` — Project detail (repo URL, analyze button, status)
- `/app/requirements` — Requirements table (add/edit/delete, priority, status)
- `/app/test-cases` — Test Case Generator (the hero page)
- `/app/reports` — Reports list + preview + PDF export
- `/app/settings` — Profile, theme, API keys (mock)

## Page details

### Landing (`/`)
- Sticky translucent nav (logo, links, Login, Start Free)
- Hero: gradient headline "Generate SQA Test Cases from Your Code in Seconds", sub copy, CTAs, animated mock dashboard preview (browser chrome + table snippet) with floating glass cards
- Logo cloud strip ("Trusted by QA teams")
- Feature grid (4 cards): GitHub integration, AI generation, Requirement management, PDF export — each with icon, hover gradient border
- "How it works" 3-step section with connected line
- Pricing teaser (3 tiers, optional)
- FAQ accordion
- Footer

### Auth (`/login`, `/signup`)
- Split layout: left form card on glass surface, right gradient panel with quote/testimonial
- Email/password fields, "Continue with GitHub" button (mock), link to opposite page
- On submit: simulate 800ms loader → store mock user in localStorage → redirect to `/app`

### App shell
- Collapsible left sidebar (shadcn Sidebar): Dashboard, Projects, Requirements, Test Cases, Reports, Settings; user card at bottom
- Top bar: breadcrumb, global search, theme toggle, notifications bell, avatar menu
- Page transitions: fade+slide on outlet

### Dashboard (`/app`)
- 4 stat cards with animated counters: Total Projects, Test Cases Generated, Active Repositories, Coverage Score (radial)
- Recent generations list, recent projects, mini activity chart (recharts)

### Projects (`/app/projects`)
- Grid of project cards (name, repo, status badge, last analyzed, test case count)
- "New Project" dialog: name + GitHub URL
- Detail page: repo URL input, "Analyze Repository" button → simulated 2–4s progress (parsing → analyzing → generating) → status flips to Completed; tabs for Requirements / Test Cases scoped to project

### Requirements (`/app/requirements`)
- Toolbar: search, filter by priority/status, "Add Requirement"
- Table: ID, Description, Priority (High/Med/Low colored badges), Status (Draft/Approved/Implemented), actions
- Inline edit via dialog; optional drag handle for reordering

### Test Case Generator (`/app/test-cases`) — flagship page
- Header: project selector, "Generate with AI" primary button
- Generate flow: button click → skeleton rows fill in progressively over 2–4s with toast progress
- Powerful table: Module, Title, Steps (multi-line), Expected Result, Type (positive/negative/edge — colored chips), Priority, Status, actions
- Filters: type, priority, module, search bar; column visibility toggle; bulk select
- Row click → side Sheet for full edit (Notion-like)
- Export menu: PDF, CSV (CSV via Blob; PDF via jsPDF + autotable)

### Reports (`/app/reports`)
- List of past generations (project, date, count, coverage)
- Preview pane: rendered report with summary stats and sample test cases
- Download PDF button

## State & data

- Zustand store with localStorage persistence for: projects, requirements, test cases, reports, user, theme
- Seed with realistic mock data on first load (3 projects, ~12 requirements, ~25 test cases, 2 reports)
- Simulated async helpers (`await delay(2000+random)`) for analyze/generate
- Sonner toasts for all mutations

## Technical notes

- Stack: TanStack Start + React 19 + Tailwind v4 + shadcn/ui (all present)
- Add deps: `zustand`, `recharts`, `jspdf`, `jspdf-autotable`, `lucide-react` (likely already present)
- Theme toggle: `next-themes`-style class on `<html>`, persisted; respects system on first load
- All routes are pure client pages (no auth backend); guard `/app/*` by checking localStorage user, redirect to `/login` if absent
- No backend/Cloud needed for this scope; can be added later for real auth + AI calls

## Out of scope (can add later)
- Real authentication and database (Lovable Cloud)
- Real GitHub OAuth and repo analysis
- Real AI test case generation (AI Gateway)
- Team/collaboration features
