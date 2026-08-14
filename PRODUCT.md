# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- **Frontend**: React 19 + Vite, React Router, Axios, JS Cookies
- **Backend**: Java 21, Spring Boot (Web, Data JPA, Security, Validation), modular monolith
- **Database**: PostgreSQL (managed on Render)
- **Auth**: JWT (issued/validated server-side, BCrypt password hashing, stored in cookie)
- **API**: RESTful, documented via springdoc-openapi (Swagger UI)
- **Deployment**: Backend on Render (Docker build); frontend on Vercel
- **Dev**: Vite dev server (frontend), Maven wrapper + `mvnw` (backend)

## Users

**Primary**: University students, faculty, and librarians in an academic setting.

- **Students & Faculty** — browse the catalog, borrow and return books, place reservations, track personal loan history and fines.
- **Librarians / Admin** — manage the catalog (books, authors, publishers), oversee all loans, process returns, manage reservations, view library analytics.

## Product Purpose

A full-stack library management system that demonstrates modern web development practices: a modular Spring Boot backend with clear domain boundaries, JWT-authenticated REST API, and a React single-page application, all containerized and deployed. Serves as a portfolio piece showcasing end-to-end capability — from database schema design and secure authentication through to a responsive frontend with real-time analytics.

## Positioning

A complete, API-first library management platform built with production-grade architecture patterns — modular domain isolation, JWT-based stateless auth, and containerized deployment — that functions equally as a working system and a demonstration of professional full-stack engineering.

## Operating Context

- **Browsing & search**: Users discover books by title, author, or publisher. Guest visitors can browse; borrowing requires authentication.
- **Borrowing flow**: Authenticated members borrow books, which become loans with due dates. Overdue loans accrue fines.
- **Reservations**: If a book is checked out, members can reserve it; fulfilled when returned.
- **Admin functions**: Librarians manage the full catalog, process returns, handle reservations, and view aggregate analytics (total loans, active loans, overdue count, popular books).
- **Authentication**: JWT-based; token stored in an HTTP cookie (`lms_token`). Auto-redirect to login on 401. Two roles: `MEMBER` and `ADMIN`.

## Capabilities and Constraints

**Confirmed capabilities:**
- Book catalog CRUD with author and publisher associations
- Author and publisher management
- Book borrowing and return processing
- Reservation system for checked-out books
- Fine tracking for overdue loans
- User registration, login, and profile (JWT auth)
- Admin dashboard for loan oversight
- Library analytics (aggregate counts via SQL)
- Health check endpoint for deployment monitoring
- Swagger/OpenAPI documentation
- Dark mode support (CSS prefers-color-scheme)

**Constraints:**
- Backend deployed via Docker on Render (no native Java buildpack)
- CORS restricted to deployed frontend origin + localhost:3000
- Token expires at 24h (configurable via `JWT_EXPIRATION`)
- No MongoDB, Supabase, or ML/analytics libraries — analytics use SQL aggregation queries
- Solo project, not currently serving a real institution

## Brand Commitments

- **Name**: "Smart Library Management" / "LMS" (established in code, routes, and navigation)
- **Identity**: No brand guidelines, logo, or visual direction established yet — open to design
- **Voice**: Professional, helpful, academic-appropriate; no casual or playful tone
- **Commitment**: Purple accent (`#aa3bff` light / `#c084fc` dark) established as primary brand color in existing CSS variables (`--accent`)

## Evidence on Hand

- `lms_backend/CLAUDE.md` — architecture, conventions, and status documentation
- `lms_frontend/` — 14 page components (auth, catalog, loans, analytics, admin)
- `library_system/library-mockup.html` — early HTML mockup (pre-React concept)
- Backend deployed and reachable on Render (Docker build verified working)
- Frontend styling: existing CSS with light/dark theme support via `prefers-color-scheme`

## Product Principles

1. **API-first by design** — every frontend feature consumes a dedicated backend endpoint; the API is documented and independently testable via Swagger.
2. **Domain clarity** — catalog, loans, and members are separate modules with clear boundaries, communicating through service interfaces, never direct repository access across modules.
3. **Portfolio-grade completeness** — every feature includes its full lifecycle: create, read, update, delete where appropriate, plus error states, loading states, and auth enforcement.
4. **Security from the start** — authentication gates all mutating actions; passwords are hashed (BCrypt), tokens are signed (JWT), and CORS is explicitly scoped.
5. **Real-world deployment posture** — containerized, deployed, monitored (health check), with environment-based configuration for secrets and origins.

## Accessibility & Inclusion

- Light and dark mode support via `prefers-color-scheme`
- Semantic HTML with proper heading hierarchy
- Focus-visible outlines on interactive elements
- No product-specific accessibility standard has been established; the existing implementation follows basic web accessibility practices

## Workflow Defaults

- Build path: code-first (this session)