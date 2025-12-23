# Onboarding (Backend)

This guide helps you quickly understand and work on this backend, even if you're new to GraphQL/Prisma.

---

## How to Run

1. **Install dependencies**:

```bash
pnpm install
```

2. **Create `.env` from `.env.example`**:

```bash
cp .env.example .env
```

Example `.env` content:

```env
JWT_SECRET=your-secret
DATABASE_URL="file:./prisma/dev.db"
```

3. **Run migrations**:

```bash
pnpm db:migrate:init
```

4. **Start the server**:

```bash
pnpm dev
```

5. **Open**:
   [http://localhost:4000/graphql](http://localhost:4000/graphql)

---

## Where to Find Things

- **GraphQL server + routing**: `src/server.ts`
- **GraphQL schema composition**: `src/graphql/schema.ts`
- **Context (JWT parsing, Prisma injection)**: `src/graphql/context.ts`
- **Prisma client**: `src/prisma.ts`
- **Database schema**: `prisma/schema.prisma`

### Domain Modules

- **Auth**: `src/modules/auth`
- **Categories**: `src/modules/categories`
- **Transactions**: `src/modules/transactions`

---

## How Authentication Works

1. Client sends header:  
   `Authorization: Bearer <token>`

2. `buildContext` verifies token and sets `ctx.userId` (or `null`).

3. Resolvers that require authentication call:

```ts
requireUser(ctx) → returns userId or throws UNAUTHENTICATED
```

---

## How to Add a New Module (Step-by-Step)

**Example**: Add a "budgets" module.

1. **Create folder**:  
   `src/modules/budgets`

2. **Add files**:

- `budgets.typeDefs.ts`
- `budgets.resolvers.ts`
- `budgets.service.ts`

3. **Export typeDefs + resolvers** and register them in:  
   `src/graphql/schema.ts`

### Service Rules

- Validate all inputs using:
  ```ts
  parseOrThrow(schema, input)
  ```
- Use Prisma inside the service.
- Enforce multi-tenancy via `userId`.

### Resolver Rules

- Keep resolvers thin.
- Use `requireUser(ctx)` for protected operations.
- Do not catch expected errors in resolvers.

---

## Debugging Tips

### See Prisma Data

```bash
pnpm prisma:studio
```

### Typical Issues

- **Missing Prisma Client**:  
  Run:

  ```bash
  pnpm prisma:generate
  ```

- **Migrations out of sync**:  
  Run:

  ```bash
  pnpm prisma migrate status
  ```

- **Native driver issues (better-sqlite3)**:  
  Ensure pnpm build scripts are allowed:
  ```bash
  pnpm approve-builds
  ```

---

## Testing GraphQL Quickly

### Sign Up

```graphql
mutation {
  signUp(input: { email: "test@example.com", password: "123456" }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

### Use the Token in Headers

```json
{ "Authorization": "Bearer <ACCESS_TOKEN>" }
```

### Query Current User

```graphql
query {
  me {
    id
    email
  }
}
```

---

## Common Patterns Used in Services

- **Always scope by `userId`**:

  ```ts
  findMany({ where: { userId } })
  findFirst({ where: { id, userId } })
  ```

- **Convert money**:

  ```ts
  toCents(amount) / fromCents(amountCents)
  ```

- **Throw expected errors**:
  ```ts
  badRequest(...), conflict(...), notFound(...)
  ```
