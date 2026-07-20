<div align="center">

# OpenTheory

### Enterprise Recruitment Management Platform

*A full-stack SaaS solution enabling job consultants to manage candidates, publish opportunities, and orchestrate the end-to-end recruitment lifecycle.*

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Table of Contents

1. [Overview](#1-overview)
2. [Key Capabilities](#2-key-capabilities)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Repository Structure](#5-repository-structure)
6. [Data Model](#6-data-model)
7. [API Reference](#7-api-reference)
8. [Getting Started](#8-getting-started)
9. [Configuration](#9-configuration)
10. [Operational Scripts](#10-operational-scripts)
11. [Security](#11-security)
12. [Contributing](#12-contributing)
13. [Support](#13-support)
14. [License](#14-license)

---

## 1. Overview

**OpenTheory (OT-SAAS)** is a multi-tenant recruitment management platform built for professional job consultants. Each consultant maintains a private portfolio of job seekers, publishes and administers job openings, and leverages built-in document intelligence — automated resume parsing with OCR — to eliminate manual data entry. The platform is monetized through Stripe-powered subscription plans and instrumented end to end with a full audit trail.

The system is delivered as an **npm-workspaces monorepo** comprising two independently deployable applications:

| Application | Description | Stack | Default Port |
|:---|:---|:---|:---:|
| [`frontend/`](frontend) | Client application & marketing site | Next.js 14 (App Router), React 18, TypeScript | `3000` |
| [`backend/`](backend) | REST API & business logic | Express 4, TypeScript, Drizzle ORM, PostgreSQL | `5000` |

---

## 2. Key Capabilities

### 2.1 Identity & Access Management
- Credential-based registration and sign-in with **bcrypt** password hashing (10 salt rounds).
- Stateless **JWT session tokens** (HS256, signed via `jose`/`jsonwebtoken`) transported exclusively in HTTP-only cookies.
- Layered authorization middleware on the API: `optionalAuth` (identity resolution), `requireAuth`, `requireAdmin`, and parameterized `hasRole()` guards.
- Edge-level route protection in the frontend ([frontend/middleware.ts](frontend/middleware.ts)): unauthenticated requests to protected routes are redirected to sign-in with the original destination preserved.
- **Email verification via one-time passwords** (6-digit OTP with short-lived expiry), password-reset, and welcome-email workflows.

### 2.2 Candidate Management
- Complete lifecycle management of job-seeker profiles — identity, contact details, skill inventory, experience, education, location, and professional summary — with strict per-consultant ownership.
- Full-text candidate search and per-consultant portfolio views.
- Immutable activity history on every candidate record.

### 2.3 Document Intelligence — Resume Processing
- Secure resume ingestion via **Multer** with per-consultant storage isolation, timestamped file naming, and MIME-type allow-listing (PDF, DOC, DOCX, RTF, TXT).
- Client-side **PDF text extraction** (`pdfjs-dist`) with an automatic **OCR fallback** (`tesseract.js`) for scanned or image-based documents.
- Structured-data extraction ([frontend/lib/ocr/resumeParser.ts](frontend/lib/ocr/resumeParser.ts)) that identifies name, email, phone, location, skills, years of experience, education, and summary — and **auto-populates the candidate intake form**, reducing onboarding time to seconds.

### 2.4 Job Requisition Management
- Publish, revise, close, and search job openings with structured metadata: title, company, location, compensation, employment type, required skills, application deadline, and status.
- Dedicated detail views and a per-requisition audit trail.

### 2.5 Billing & Subscriptions
- **Stripe Checkout** integration offering Monthly (USD 49) and Annual (USD 499) plans.
- Server-side payment verification endpoints with automatic entitlement updates (`is_paid`) upon confirmed settlement.
- Administrative override for entitlement management.

### 2.6 Communications
- Centralized **SMTP email service** (Nodemailer) with branded HTML templates for candidate notifications, job-opportunity outreach, support requests, OTP delivery, password resets, and onboarding.
- Administrator-only endpoint for verifying mail-transport configuration.

### 2.7 Audit & Compliance
- Every material action — authentication events, profile changes, candidate operations, requisition lifecycle events — is captured in a dedicated audit table with actor, entity, action, contextual details, IP address, and timestamp.
- Audit feeds are surfaced on the consultant dashboard, entity detail pages, and the administrative console.

### 2.8 User Experience
- **Consultant dashboard** with operational statistics, recent requisitions, and activity feed.
- **Administrative console** with user administration, entitlement control, and platform-wide audit visibility.
- Marketing landing page, pricing, profile, and support surfaces.
- In-app **support assistant** ([frontend/components/chat-bot.tsx](frontend/components/chat-bot.tsx)) with keyword-driven responses and guided follow-up suggestions, complemented by a support-mail form.
- Design system built on **shadcn/ui and Radix primitives** — accessible dialogs, tabs, menus, and toasts — with light/dark theming (`next-themes`) and schema-validated forms (**react-hook-form + Zod**).

---

## 3. System Architecture

```
┌───────────────────────────────┐          ┌────────────────────────────────┐
│    Frontend · Next.js 14      │          │     Backend · Express + TS     │
│                               │   HTTPS  │                                │
│  App Router pages             │ ───────► │  REST API  (/api/*)            │
│  RTK Query data layer         │  cookies │  JWT auth middleware chain     │
│  Redux store                  │ ◄─────── │  Controllers & services        │
│  shadcn/ui · Tailwind CSS     │          │  Drizzle ORM data access       │
│  PDF / OCR resume pipeline    │          │  Multer upload pipeline        │
│  Edge middleware (auth guard) │          │  Stripe · Nodemailer           │
└───────────────────────────────┘          └───────────────┬────────────────┘
                                                           │
                                                  ┌────────▼─────────┐
                                                  │    PostgreSQL    │
                                                  └──────────────────┘
```

**Design principles**

- **Single data-access seam.** All frontend data flows through **RTK Query** slices ([frontend/apiSlice/](frontend/apiSlice)) built on one shared base slice targeting `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`), with `credentials: 'include'` so the session cookie accompanies every request. Cache invalidation is tag-driven (`User`, `Consultant`, `JobSeeker`, `Job`, `Activity`).
- **Fail-fast startup.** The API validates its database connection before binding the port and refuses to boot without a signing secret.
- **Defense in depth.** CORS is restricted to the configured frontend origin with credential support; identity is resolved globally on every request; role checks are enforced per route; a terminal error-handling middleware normalizes failures (stack details are suppressed outside development).
- **Static asset isolation.** Uploaded resumes are served from a dedicated `/uploads` static mount with per-consultant directory partitioning.
- **Complementary frontend APIs.** The Next.js layer exposes its own routes (`/api/auth/*`, `/api/resume-parser`) for auth passthrough and server-side document handling.

---

## 4. Technology Stack

| Concern | Technology |
|:---|:---|
| Frontend framework | Next.js 14 (App Router), React 18, TypeScript 5 |
| State management & data fetching | Redux Toolkit, RTK Query |
| UI & design system | Tailwind CSS, shadcn/ui (Radix UI), lucide-react, next-themes |
| Forms & validation | react-hook-form, Zod |
| API framework | Express 4, TypeScript, ts-node, nodemon |
| Persistence | PostgreSQL, Drizzle ORM, drizzle-kit (migrations & studio) |
| Authentication | jose / jsonwebtoken (JWT · HS256), bcryptjs, cookie-parser |
| Payments | Stripe Checkout Sessions |
| Email | Nodemailer (SMTP) |
| File handling | Multer |
| Document intelligence | pdfjs-dist, pdf-parse, pdf-lib, tesseract.js (OCR) |
| Build & orchestration | npm workspaces, concurrently |

---

## 5. Repository Structure

```
Opentheory/
├── package.json                 # Workspace root — cross-app orchestration
├── frontend/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             #   Landing page
│   │   ├── (login)/             #   Sign-in / sign-up
│   │   ├── dashboard/           #   Consultant dashboard
│   │   ├── jobs/                #   Requisition list + [id] detail
│   │   ├── job-seekers/         #   Candidate list, intake form, [id] detail
│   │   ├── admin/               #   Administrative console
│   │   ├── pricing/             #   Subscription plans (Stripe)
│   │   ├── profile/             #   Consultant profile
│   │   ├── support/             #   Support center (assistant + mail form)
│   │   └── api/                 #   Next API routes (auth, resume-parser)
│   ├── apiSlice/                # RTK Query slices (users, jobs, jobSeekers,
│   │                            #   emails, emailAuth, stripe, activities)
│   ├── components/
│   │   ├── auth/                # Auth forms, UserProvider, ProtectedRoute
│   │   ├── ui/                  # shadcn/ui component library
│   │   ├── chat-bot.tsx         # Support assistant widget
│   │   └── navbar.tsx
│   ├── lib/ocr/                 # PDF extraction & resume-parsing pipeline
│   ├── middleware.ts            # Edge auth guard
│   └── store/                   # Redux store configuration
└── backend/
    ├── server.ts                # Application entry point
    ├── routes/                  # users · jobs · jobSeekers · activities
    │                            #   emails · emailAuth · stripe · upload
    ├── controllers/             # Email & user controllers
    ├── lib/
    │   ├── auth/                # Session signing, hashing, middleware chain
    │   ├── db/                  # Drizzle client, schema, queries, migrations
    │   └── services/            # emailService · emailAuthService
    │                            #   verificationService (OTP)
    └── uploads/resumes/         # Resume storage (per-consultant isolation)
```

---

## 6. Data Model

Schema is defined declaratively with Drizzle ORM in [backend/lib/db/schema.ts](backend/lib/db/schema.ts); versioned SQL migrations reside in `backend/lib/db/migrations/`.

| Table | Purpose |
|:---|:---|
| `users` | Consultant and administrator accounts — credentials, role, session state, professional profile (phone, avatar, bio, company, position, location), `is_paid` entitlement flag, soft-delete support |
| `job_seekers` | Candidate profiles under consultant ownership (`consultant_id` FK, cascading delete) — resume reference, skills array, experience, education, location, summary |
| `jobs` | Requisitions — title, company, location, description, skills array, compensation, employment type, deadline, lifecycle status |
| `job_activity_logs` | Audit trail — actor, entity type & identifier, action, contextual details, IP address, timestamp |

A strongly-typed `ActivityType` enumeration standardizes the audited action vocabulary (authentication events, account changes, candidate CRUD, requisition lifecycle transitions).

---

## 7. API Reference

All endpoints are versionless and mounted under `/api`. Authentication is cookie-based; role requirements are noted where applicable.

<details>
<summary><strong>Identity & Users — <code>/api/users</code></strong></summary>

| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/register` | Create an account | Public |
| `POST` | `/login` | Authenticate; issues JWT cookie | Public |
| `POST` | `/logout` | Terminate session | Authenticated |
| `GET` | `/me` | Retrieve current profile | Authenticated |
| `PUT` | `/me` | Update profile | Authenticated |
| `POST` | `/change-password` | Rotate credentials | Authenticated |
| `DELETE` | `/me` | Delete account | Authenticated |
| `GET` | `/consultants` · `/consultants/:id` | List / retrieve consultants | Authenticated |
| `GET` | `/:id/activities` | User audit history | Admin / Member |
| `PATCH` | `/payment-status/:id` | Override entitlement | Admin |
| `GET` | `/` | Enumerate all users | Admin |

</details>

<details>
<summary><strong>Candidates — <code>/api/job-seekers</code></strong></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/` | Register a candidate |
| `GET` | `/consultant/:consultantId` | Consultant's candidate portfolio |
| `GET` | `/search` | Search candidates |
| `GET` / `PUT` / `DELETE` | `/:id` | Retrieve / update / remove |
| `GET` | `/:id/activities` | Candidate audit history |

</details>

<details>
<summary><strong>Requisitions — <code>/api/jobs</code></strong></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/` | Publish a requisition |
| `GET` | `/` · `/all` · `/search` | List / search requisitions |
| `GET` / `PUT` | `/:id` | Retrieve / revise |
| `POST` | `/:id/close` | Close a requisition |
| `GET` | `/:id/activities` | Requisition audit history |

</details>

<details>
<summary><strong>Billing — <code>/api/checkout</code></strong></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/` | Create a Stripe Checkout session (monthly / annual) |
| `GET` | `/status/:sessionId` | Query settlement status |
| `POST` | `/session-update` | Apply entitlement post-settlement |
| `POST` | `/check-payment` | Verify a user's entitlement |

</details>

<details>
<summary><strong>Communications — <code>/api/emails</code> · <code>/api/email-auth</code></strong></summary>

| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| `POST` | `/emails/send` | Dispatch a general email | Authenticated |
| `POST` | `/emails/job-seeker` | Candidate notification | Authenticated |
| `POST` | `/emails/job-opportunity` | Opportunity outreach | Authenticated |
| `POST` | `/emails/support` | Support request intake | Public |
| `GET` | `/emails/verify` | Validate mail-transport configuration | Admin |
| `POST` | `/email-auth/send-otp` · `/verify-otp` | OTP issuance & verification | Public |
| `POST` | `/email-auth/request-reset` | Password-reset dispatch | Public |
| `POST` | `/email-auth/welcome` | Onboarding email | Public |

</details>

<details>
<summary><strong>Documents & Audit — <code>/api/upload</code> · <code>/api/activities</code></strong></summary>

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/upload/resume?consultantId=…` | Ingest a resume (PDF / DOC / DOCX / RTF / TXT) |
| `GET` | `/upload/resume/check/:consultantId` | Check for an existing resume |
| `GET` | `/activities` | Platform-wide audit feed |

</details>

---

## 8. Getting Started

### 8.1 Prerequisites

| Requirement | Version / Notes |
|:---|:---|
| Node.js | 18 LTS or later |
| PostgreSQL | Any supported release, local or managed |
| Stripe account | Test-mode keys are sufficient for development |
| SMTP credentials | e.g., a Gmail application password |

### 8.2 Installation

```bash
# 1 · Clone
git clone <repository-url>
cd Opentheory

# 2 · Install all workspace dependencies
npm install

# 3 · Configure environment variables (see §9)

# 4 · Apply database migrations
npm run db:migrate

# 5 · Launch both applications
npm run dev
```

| Surface | URL |
|:---|:---|
| Client application | http://localhost:3000 |
| REST API | http://localhost:5000/api |

---

## 9. Configuration

Provide a `.env` file in `backend/` and a `.env.local` in `frontend/` for public variables. **Never commit secrets to version control.**

| Variable | Scope | Required | Description |
|:---|:---|:---:|:---|
| `POSTGRES_URL` | backend | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | backend | ✅ | JWT signing secret — the server refuses to start without it |
| `JWT_SECRET` | backend | ✅ | Secret for auth-cookie verification |
| `STRIPE_SECRET_KEY` | backend | ✅ | Stripe secret API key |
| `POSTGRES_SSL` | backend | — | `true` to enforce TLS to the database |
| `BACKEND_PORT` | backend | — | API port (default `5000`) |
| `FRONTEND_URL` | backend | — | Authorized CORS origin (default `http://localhost:3000`) |
| `EMAIL_HOST` / `EMAIL_PORT` | backend | — | SMTP endpoint (default `smtp.gmail.com:587`) |
| `EMAIL_USER` / `EMAIL_PASSWORD` | backend | — | SMTP credentials (email features disabled if absent) |
| `EMAIL_FROM` | backend | — | Sender address (defaults to `EMAIL_USER`) |
| `NEXT_PUBLIC_API_URL` | frontend | — | API base URL (default `http://localhost:5000/api`) |
| `NODE_ENV` | both | — | `development` / `production` |

---

## 10. Operational Scripts

Execute from the repository root:

| Script | Purpose |
|:---|:---|
| `npm run dev` | Launch frontend and backend concurrently in watch mode |
| `npm run dev:frontend` / `npm run dev:backend` | Launch a single application |
| `npm run build` | Produce production builds of both applications |
| `npm run start` | Serve both production builds |
| `npm run db:generate` | Generate Drizzle migrations from the schema |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:seed` | Seed reference data |
| `npm run db:studio` | Open Drizzle Studio for database inspection |

---

## 11. Security

- **Credential storage** — passwords are hashed with bcrypt (10 salt rounds); plaintext credentials are never persisted.
- **Session integrity** — sessions are HS256-signed JWTs delivered in HTTP-only cookies, mitigating XSS-based token theft.
- **Transport policy** — CORS is pinned to the configured frontend origin with an explicit method and header allow-list.
- **Least privilege** — administrative endpoints are gated by server-side role checks, never by client-side state alone.
- **Upload hygiene** — resume ingestion enforces a MIME-type allow-list and writes to consultant-scoped directories with sanitized, timestamped filenames.
- **Error discipline** — stack traces and internal error details are exposed only in development mode.
- **Auditability** — security-relevant events are recorded with actor, action, IP address, and timestamp.

> **Responsible disclosure:** if you identify a vulnerability, please report it privately to the maintainers rather than opening a public issue.

---

## 12. Contributing

1. **Fork** the repository and create a feature branch: `git checkout -b feature/<short-description>`.
2. Keep changes **scoped and typed** — the codebase is TypeScript-first across both applications.
3. Follow the existing structure: API logic in `backend/routes` + `backend/lib/services`, data access in `backend/lib/db`, client data fetching in `frontend/apiSlice`.
4. For schema changes, update [backend/lib/db/schema.ts](backend/lib/db/schema.ts) and generate a migration (`npm run db:generate`) — never edit applied migrations.
5. Open a pull request with a clear summary of the change, its motivation, and any configuration impact.

---

## 13. Support

| Channel | Details |
|:---|:---|
| In-app | Support center at `/support` (assistant + contact form) |
| Email | enterprise@opentheory.com |

---

## 14. License

This project is distributed under the terms described in [frontend/LICENSE](frontend/LICENSE).

---

<div align="center">
<sub>OpenTheory — built with Next.js, Express, and PostgreSQL.</sub>
</div>
