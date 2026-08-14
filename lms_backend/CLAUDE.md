# Smart Library Management Platform — Backend

## Project context
Solo school project, 3-4 day timeline. Backend-first: full API (all modules + auth) 
is being built and completed before any frontend work starts.

## Architecture
Modular monolith — NOT microservices. One Spring Boot application, three domain 
packages with clear boundaries:
- `catalog` — books, authors, publishers, search
- `loans` — borrow/return, fines, reservations
- `members` — registration, auth, profiles

Rule: modules talk to each other only through service interfaces, never by 
reaching directly into another module's repository layer.

## Tech stack
- Language/framework: Java, Spring Boot (Web, Data JPA, Security)
- Database: PostgreSQL, managed instance on Render
- Auth: JWT (issued/validated in the `members` module), passwords hashed with BCrypt
- API docs: springdoc-openapi, auto-generated (no hand-written per-endpoint descriptions)
- Deployment: Docker, hosted on Render (Dockerfile-based build, not Render's native 
  buildpacks — Render has no native Java runtime)
- No MongoDB, no Supabase, no ML/analytics libraries (Pandas/Scikit-learn/PyTorch/
  TensorFlow) — usage analytics will be SQL aggregation queries surfaced later in 
  the frontend, not a data-science pipeline

## Conventions
- Never hardcode credentials or secrets (DB connection string, JWT secret) — always 
  read from environment variables, set via Render's dashboard
- Every new module should get its Swagger annotations added as it's built, not 
  retrofitted later
- CORS: only the deployed frontend origin (Vercel) and localhost:3000 should be 
  allowed — no wildcard origins once auth headers are involved

## Current status
- Backend deployed to Render and reachable (Docker build working)
- Members module (auth + CRUD) — done (register/login/me with JWT + BCrypt)
- Catalog module — entities only (Author, Publisher, Book)
- Loans module — full (Loan + Reservation entities, repositories, services, controllers, DTOs; borrow/return/fines/reservations)
- Security — JWT filter, BCrypt, CORS (localhost:3000), stateless sessions
- API docs — springdoc-openapi wired (Swagger UI at /swagger-ui/index.html)
- Frontend — not started, deliberately deferred until backend is feature-complete

## Environment variables (.env / Render dashboard)
- `JWT_SECRET` — base64-encoded HMAC key for JWT signing
- `JWT_EXPIRATION` — token lifetime in milliseconds (default 86400000 = 24h)

## Priorities if time runs short
1. Loans module completeness (heaviest business logic, most credit)
2. Catalog CRUD
3. Members auth
4. Frontend (catalog UI > loans UI > analytics > members admin UI)