# Workflow Management Dashboard (Angular 18 + NgRx)

Internal dashboard to **track, manage, and analyze workflows** (approvals, tasks, SLAs). Includes **mock auth**, **role-based access**, **lazy-loaded routes**, **NgRx state**, **server-side pagination (mocked)**, and **dashboard analytics + charts**.

## Setup

### Prerequisites
- Node **20 LTS** (recommended)
- npm

### Install / Run

```bash
npm install
npm start
```

App: `http://localhost:4200/`

## Notes (per assignment constraints)
- **No unit tests / e2e / PWA** are included in this submission.
- Auth + API are **mocked** but follow real-world patterns (interceptors + typed services).

## Roles
- **Admin**: full access (create/edit/delete/approve)
- **Manager**: view + approve
- **User**: create + view

Login is mocked at `/auth/login`.

## Architecture (feature-first)
- `src/app/core/`
  - Interceptors: `mock-api`, `auth-token`, `error-handling`
  - Storage: token/session
  - Theme service
- `src/app/shared/`
  - App shell layout (`mat-sidenav` + topbar)
- `src/app/features/`
  - `auth/` (NgRx auth state + login)
  - `workflows/` (NgRx entity state + CRUD)
  - `dashboard/` (analytics selectors + chart)

## State flow (NgRx)
- **UI event** (search/pagination/create/update/delete) →
- **Action** (`WorkflowsActions.*`) →
- **Effect** calls API (`/api/workflows…`) →
- **Reducer** updates entity state →
- **Selectors** derive view models →
- **UI** renders with `async` pipe (minimal manual subscriptions)

Auth is similar: `AuthActions.login` → effect calls `/api/auth/login` → session stored + token persisted.

## Performance optimizations used
- **Lazy-loaded routes** for `auth`, `dashboard`, `workflows`
- **OnPush** change detection across feature components
- **trackBy** in workflow table rows
- **Debounced search** using RxJS in workflow list filters
- **Selector-based derived data** for dashboard analytics (no recompute in templates)

## Error handling
- Global interceptor shows user-friendly errors via snackbar.
- Mock API returns typed errors (e.g., name uniqueness).

## Mock backend (server-side pagination)
Implemented via `src/app/core/http/mock-api.interceptor.ts`:
- `/api/auth/login`
- `/api/workflows` (GET list with paging/filter/search)
- `/api/workflows` (POST create)
- `/api/workflows/:id` (PUT update, DELETE delete)
- `/api/workflows/validate-name` (async validator)

## Theme
- Simple **Light/Dark** toggle (adds `body.wmd-dark`).

## Assumptions & limitations
- Auth and API are mocked (no real identity provider / backend).
- Assigned users are represented as simple user id strings.
- SLA policies are not fully modeled yet (can be extended from `Workflow` model).

