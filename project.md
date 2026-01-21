PRD — Dev Control Dashboard (Frontend-Only)
1. Purpose

Build a production-style frontend dashboard to demonstrate:

Correct use of Next.js App Router

Correct use of Server Components vs Client Components

Correct use of Zustand (minimal, only where justified)

Correct rendering, performance, and state architecture decisions

This is a portfolio-grade system, not a demo.

2. Non-Goals

This product will not:

Implement a real backend

Implement real authentication

Implement micro-frontends

Implement client-side data caching layers

Store server data in Zustand

Implement Redux-like architecture

Over-abstract folders, services, or state

3. Target User

Developer (you)

Goal: Showcase frontend architecture, performance thinking, and state discipline

4. Core Principles

Server-first rendering

Minimal client JavaScript

Zustand only for true global UI & preferences

No duplicated or derived state

Route-based code splitting

Lazy load heavy features

Performance is architectural, not cosmetic

Prefer boring, readable code

5. Tech Stack

Next.js (App Router)

TypeScript

Zustand

Tailwind (or equivalent)

Chart library (lazy-loaded)

Public APIs:

GitHub

OpenWeather

JSONPlaceholder or equivalent

6. Application Routes
Route	Purpose	Rendering
/	Landing	Static
/overview	Main dashboard	SSR + partial hydration
/projects	GitHub repos	SSR + virtualization
/analytics	Charts	Client-heavy (lazy)
/activity	Notifications	SSR + client interactions
/settings	Preferences	Client
7. Rendering Strategy

All pages are Server Components by default

Only interactive widgets are Client Components

Charts and heavy UI are dynamically imported

Static parts ship zero JS

Skeletons have fixed dimensions to prevent CLS

8. Data Fetching Rules

All API fetching happens in Server Components

Server data is passed down as props

Zustand never stores server data

No client-side cache duplication

9. State Management Rules (Zustand)

Zustand is used only for:

Global UI state

User preferences

Client-only interaction state

Global Store Slices
UI Slice
{
  sidebarOpen: boolean
  toggleSidebar(): void
}

Settings Slice (persisted)
{
  theme: "light" | "dark" | "system"
  githubUsername: string
  city: string
}

Auth Slice (mock)
{
  isAuthenticated: boolean
}

Analytics UI Slice
{
  range: "7d" | "30d" | "90d"
}

Notifications Slice (Reducer-based)
{
  items: Notification[]
  dispatch(action)
}

10. Features by Page
10.1 Landing (/)

Static marketing-style page

Zero client JS

SEO optimized

10.2 Overview (/overview)

GitHub stats cards (server fetched)

Weather card (server fetched)

Activity preview list (server fetched)

Fixed-size skeletons

No global state usage

10.3 Projects (/projects)

GitHub repo list

Filter + sort (client UI state only)

Virtualized list

Server fetch for data

Zustand only stores:

filter

sort

Derived data is computed in component.

10.4 Analytics (/analytics)

Charts

Date range selector

Charts loaded via dynamic import

Zustand only stores:

selected range

10.5 Activity (/activity)

Notifications list

Mark read/unread

Reducer pattern used because:

Multiple transitions

Predictable state machine

10.6 Settings (/settings)

Theme selector

Default GitHub username

Default city

Reset to defaults

All persisted in Zustand

11. Layout System

Sidebar + topbar layout

Sidebar collapse state in Zustand

Active route handled by Next router (not Zustand)

12. Performance Requirements

Route-based code splitting

Lazy load charts and heavy components

No server data in client store

Minimal JS on overview page

Virtualized long lists

Skeletons prevent CLS

Image optimization via Next Image

13. Folder Structure
src/
  app/
    (public)/
    (dashboard)/
      layout.tsx
      overview/
      projects/
      analytics/
      activity/
      settings/
  components/
    layout/
    cards/
    charts/
  store/
    index.ts
    ui.slice.ts
    settings.slice.ts
    auth.slice.ts
    notifications.slice.ts
  services/
    github.ts
    weather.ts

14. Quality Bar (Acceptance Criteria)

 Lighthouse Performance ≥ 85

 Overview page ships minimal JS

 Charts are lazy loaded

 No server data in Zustand

 Zustand store < 200 LOC total

 No duplicated or derived state

 No unnecessary client components

 All lists >100 items are virtualized

 No CLS during load

15. What This Project Proves

You understand rendering strategies

You understand state boundaries

You understand performance architecture

You do not over-engineer

You can explain every tradeoff

16. Explicit Anti-Patterns Forbidden

❌ Storing API responses in Zustand

❌ Redux-style ceremony

❌ “Service layer” abstraction for no reason

❌ Client-side caching layer

❌ Micro-frontend architecture

❌ Domain-driven folder cosplay

17. Delivery Definition

Project is complete when:

All routes implemented

All performance constraints satisfied

Architecture matches this PRD

Code is boring, readable, predictable