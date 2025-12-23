# Architecture Notes (Backend)

This backend follows a simple and scalable structure designed for small projects that can grow safely.

## High-level flow

GraphQL request → Resolver → Service → Prisma → Database

- **Resolvers** are thin: they only extract `userId` from context and forward inputs.
- **Services** contain business rules, validation, and all database access.
- **Prisma** is the only layer that talks to the database.
- **Errors** are thrown (not returned) and normalized by GraphQL Yoga.

## Modules

Domain code lives under:

- `src/modules/auth`
- `src/modules/categories`
- `src/modules/transactions`

Each module typically contains:

- `*.typeDefs.ts` → GraphQL schema for the module
- `*.resolvers.ts` → GraphQL resolvers (thin)
- `*.service.ts` → business logic + Prisma calls

## Multi-tenancy

Multi-tenancy is enforced by **linking every Category and Transaction to a User** (`userId`).

Rules:

- Every query in services uses `where: { userId }` or `findFirst({ where: { id, userId } })`.
- For updates/deletes, we never allow actions across tenants.
- We avoid leaking existence of other users' data (prefer `Not found` vs `Forbidden`).

Authentication is done via JWT:

- `src/graphql/context.ts` parses the Bearer token and sets `ctx.userId`.
- Resolvers call `requireUser(ctx)` for protected operations.

## Validation and Error Handling (Canonical Rules)

1. Always validate service inputs using `parseOrThrow(...)` (Zod).
2. Always throw `AppError` (prefer factories like `badRequest`, `unauthenticated`, `conflict`, etc.) for expected errors.
3. Never catch/return raw errors in resolvers; let errors bubble up and Yoga normalizes them through `toGraphQLError`.

### GraphQL error format

Expected errors return:

- `message` (human readable)
- `extensions.code` (e.g. `BAD_REQUEST`, `UNAUTHENTICATED`, `CONFLICT`)
- `extensions.http.status` (e.g. 400/401/409)
- `extensions.details` (optional structured details, e.g. validation issues)

## Money handling

Money is stored as integer cents in the database:

- DB: `amountCents: Int`
- GraphQL: `amount: Float`

Conversions are centralized in:

- `src/shared/utils/money.ts`

This avoids floating point precision issues when persisting values.

## Dates

Transactions have:

- `occurredAt` → when the transaction happened (business timeline)
- `createdAt` / `updatedAt` → audit timestamps

GraphQL exposes dates as ISO strings for simplicity.

## Key shared utilities

- `src/shared/validation/zod.ts` → `parseOrThrow` (validation)
- `src/shared/errors/*` → AppError + factories + GraphQL conversion
- `src/shared/auth/*` → JWT helpers + `requireUser`
