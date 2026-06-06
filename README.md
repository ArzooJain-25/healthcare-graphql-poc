# Healthcare GraphQL POC

A full-stack proof of concept demonstrating complete GraphQL communication in a healthcare system — covering Queries, Mutations, Subscriptions, and Role-Based Access Control (RBAC).

Built with Node.js, TypeScript, Apollo Server 4, PostgreSQL, and React.

---

## What this POC covers

This project is built to learn and demonstrate every major GraphQL concept in a real-world domain:

- **Queries** — fetching patients, doctors, appointments, and prescriptions with filtering and pagination
- **Mutations** — creating and updating records, booking appointments, managing prescriptions
- **Subscriptions** — real-time appointment status updates over WebSocket
- **RBAC** — role-based access control using JWT authentication and graphql-shield, with operation-level and field-level permissions

---

## Tech stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Runtime          | Node.js v20 LTS                                   |
| Language         | TypeScript (strict mode)                          |
| GraphQL server   | Apollo Server 4                                   |
| Database         | PostgreSQL + pgAdmin                              |
| Database queries | Raw SQL via `node-postgres` (`pg`)                |
| Batching         | DataLoader (solves N+1)                           |
| Subscriptions    | `graphql-ws` over WebSocket                       |
| Authentication   | JSON Web Tokens (`jsonwebtoken` + `bcrypt`)       |
| Authorisation    | `graphql-shield` + `graphql-middleware`           |
| Frontend         | React 18 + Vite + TypeScript                      |
| Apollo Client    | `@apollo/client` with HTTP + WebSocket split link |
| Type generation  | `graphql-codegen` — typed hooks from SDL          |
| Routing          | React Router v6                                   |

---

## Domain

The system models a healthcare environment with the following entities:

- **Patient** — personal details, blood type, insurance, appointment and prescription history
- **Doctor** — specialty, department, patient and appointment lists
- **Department** — groups doctors by medical specialty
- **Appointment** — links a patient to a doctor with a scheduled time and status
- **Prescription** — medication orders linked to a patient, doctor, and optionally an appointment
- **User** — authentication account linked to a Patient or Doctor, with a role

### Roles

| Role      | Access level                                                          |
| --------- | --------------------------------------------------------------------- |
| `ADMIN`   | Full access to all operations and all fields including sensitive data |
| `DOCTOR`  | Read patients, manage appointments, create prescriptions              |
| `NURSE`   | Read patients, read and update appointments                           |
| `PATIENT` | Own appointments and prescriptions only                               |

---

## Project structure

```
healthcare-graphql-poc/
├── server/                         # Apollo Server — Node.js + TypeScript
│   ├── src/
│   │   ├── schema/                 # GraphQL SDL files (.graphql)
│   │   │   ├── patient.graphql
│   │   │   ├── doctor.graphql
│   │   │   ├── appointment.graphql
│   │   │   ├── prescription.graphql
│   │   │   ├── auth.graphql
│   │   │   └── index.ts            # mergeTypeDefs
│   │   ├── resolvers/
│   │   │   ├── query/              # Query resolvers
│   │   │   ├── mutation/           # Mutation resolvers
│   │   │   ├── subscription/       # Subscription resolvers
│   │   │   ├── loaders.ts          # DataLoader instances
│   │   │   └── index.ts            # mergeResolvers
│   │   ├── db/
│   │   │   └── index.ts            # pg Pool instance + query helper
│   │   ├── auth/
│   │   │   ├── jwt.ts              # signToken, verifyToken
│   │   │   └── context.ts          # buildContext — decode JWT per request
│   │   ├── permissions/
│   │   │   ├── rules.ts            # graphql-shield rules
│   │   │   └── shield.ts           # full permission map
│   │   └── index.ts                # Apollo Server entry point
│   ├── sql/
│   │   ├── 001_init.sql            # CREATE TABLE migrations
│   │   └── seed.sql                # Test data
│   ├── .env                        # Local environment variables (not committed)
│   ├── .env.example                # Environment variable template
│   ├── tsconfig.json
│   └── package.json
│
├── client/                         # React + Vite frontend
│   ├── src/
│   │   ├── apollo/                 # ApolloClient config, split link
│   │   ├── graphql/                # .graphql operation files
│   │   ├── generated/              # graphql-codegen output (typed hooks)
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── DoctorDashboard.tsx
│   │   │   ├── PatientView.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── components/
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   └── Navbar.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # JWT decode + auth context
│   │   └── App.tsx                 # Routes
│   ├── vite.config.ts
│   └── package.json
│
├── .gitignore
├── package.json                    # Monorepo root (npm workspaces)
└── README.md
```

---

## Build phases

The POC is built in 6 sequential phases. Each phase is independently committable.

### Phase 1 — Schema design ✅

**Branch:** `feature/phase-01-schema-design` → merged into `dev`

**Completed:**

- All `.graphql` SDL files written: `patient`, `doctor`, `appointment`, `prescription`, `auth`
- Enums defined: `BloodType`, `Gender`, `AppointmentStatus`, `UserRole`
- All Query, Mutation, and Subscription operations declared and typed
- `mergeTypeDefs` index wiring all SDL files into one schema
- Apollo Server starts with schema-only mode — full schema browsable in Apollo Sandbox at `localhost:4000`
- RBAC planning table written — defines access rules for all 21 operations across 4 roles

**Key files:**

- `server/src/schema/*.graphql` — one file per domain entity
- `server/src/schema/index.ts` — merges all SDL into one `typeDefs` export
- `server/src/index.ts` — minimal Apollo Server entry point (no resolvers yet)

---

### Phase 2 — Database integration

Design the database schema in `dbdiagram.io` using DBML, then implement it in PostgreSQL with raw SQL. No ORM — all queries use `node-postgres` directly. Covers enum type alignment between PostgreSQL and GraphQL, UUID primary keys, foreign key constraints, indexed columns, and a seed script with realistic test data. A single `pg.Pool` instance is injected into Apollo context.

**Status:** `[ ] Not started`

---

### Phase 3 — Backend resolvers & API

Implement all Query, Mutation, and Subscription resolvers backed by raw SQL. Covers dynamic WHERE clause construction, DataLoader for batching (solving N+1), PubSub event publishing from mutations, WebSocket subscription resolvers with `withFilter`, typed GraphQL errors, and PostgreSQL error mapping. Apollo Server switches to `expressMiddleware` to support WebSocket alongside HTTP.

**Status:** `[ ] Not started`

---

### Phase 4 — RBAC & authentication

Add JWT-based authentication and full role-based access control using `graphql-shield`. Covers the `login` and `register` mutations, JWT decoding in Apollo context, deny-by-default shield rules, operation-level permissions matching the RBAC matrix, field-level masking for sensitive patient data (`ssn`, `insuranceId`), and WebSocket connection authentication via `onConnect`.

**Status:** `[ ] Not started`

---

### Phase 5 — Frontend

Build the React frontend with Apollo Client wired to both HTTP and WebSocket via a split link. Covers `graphql-codegen` typed hook generation, in-memory JWT storage, role-gated routing with `PrivateRoute`, all three operation types in React (`useQuery`, `useMutation`, `useSubscription`), optimistic UI for status updates, and real-time appointment card updates with animation. The design system matches the project roadmap: `Space Mono` + `DM Sans`, dark `#0B0F1A` background, phase-coloured accents.

**Status:** `[ ] Not started`

---

### Phase 6 — Testing & POC demo

Write Jest resolver unit tests, React component tests with `MockedProvider`, and a Postman collection with one token per role. Includes a manual Apollo Sandbox testing guide for verifying RBAC, subscriptions, and DataLoader efficiency. Concludes with a structured 10-minute demo script covering all GraphQL operation types, role switching, and a live subscription update.

**Status:** `[ ] Not started`

---

## Getting started

### Prerequisites

- Node.js v20 LTS
- PostgreSQL 15+ with pgAdmin
- Git

### Environment setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/healthcare-graphql-poc.git
cd healthcare-graphql-poc

# Install all workspace dependencies
npm install

# Copy and fill in the server environment file
cp server/.env.example server/.env
```

### Server `.env` variables

```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthcare_poc
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Run the server

```bash
npm run server
# Apollo Server starts at http://localhost:4000
# Apollo Sandbox available at http://localhost:4000
```

### Run the client

```bash
npm run client
# Vite dev server starts at http://localhost:5173
```

### Generate typed hooks (after Phase 5)

```bash
cd client
npm run codegen
```

---

## Key concepts demonstrated

**DataLoader — solving N+1**
Without DataLoader, fetching 10 appointments with their doctors fires 11 SQL queries. With DataLoader, it fires 2: one for appointments, one batched `WHERE id = ANY($1::uuid[])` for all doctors at once.

**graphql-shield — deny by default**
Every operation not explicitly listed in the permission map is automatically forbidden. Access is opt-in, not opt-out.

**Split link — one client, two transports**
Apollo Client uses `HttpLink` for queries and mutations (HTTP POST) and `GraphQLWsLink` for subscriptions (WebSocket). The `split()` function routes at runtime based on operation type.

**graphql-codegen — end-to-end type safety**
The SDL in `server/src/schema/*.graphql` is the single source of truth. Running codegen generates TypeScript types and React hooks (`useGetPatientQuery`, `useBookAppointmentMutation`) so the frontend is always in sync with the server schema.

---

## Resources

- [GraphQL official docs](https://graphql.org/learn/)
- [Apollo Server 4 docs](https://www.apollographql.com/docs/apollo-server/)
- [Apollo Client docs](https://www.apollographql.com/docs/react/)
- [graphql-shield](https://github.com/dimatill/graphql-shield)
- [graphql-ws](https://github.com/enisdenjo/graphql-ws)
- [graphql-codegen](https://the-guild.dev/graphql/codegen)
- [node-postgres (pg)](https://node-postgres.com/)
- [DataLoader](https://github.com/graphql/dataloader)
- [dbdiagram.io](https://dbdiagram.io/)
