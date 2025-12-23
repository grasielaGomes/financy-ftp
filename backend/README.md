# Financy — Backend (API)

This is the **backend** for the Financy project: a finance management API built with **Fastify + GraphQL Yoga + Prisma + SQLite + JWT**.

---

## Tech Stack

- **Node.js + TypeScript**
- **Fastify** (HTTP server)
- **GraphQL Yoga** (GraphQL server)
- **Prisma ORM** + SQLite database
- **JWT** authentication
- **Zod** for input validation

---

## Features

### Authentication

- Sign up
- Sign in
- Current user (`me`)

### Multi-tenant

- Users can only manage their own categories and transactions

### Categories (CRUD)

- Create, list, update, delete

### Transactions (CRUD)

- Create, list, update, delete
- Supports optional category

### Consistent Error Handling

- Validation errors return structured GraphQL errors (code/http/details)

---

## Requirements

- **Node.js** 22+
- **pnpm**

---

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env` file based on `.env.example`.

#### `.env.example` (required):

```bash
JWT_SECRET=
DATABASE_URL=
```

#### Example for SQLite:

```bash
JWT_SECRET=your-secret
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Database Migrations

Run Prisma migrations to create the SQLite database:

```bash
pnpm db:migrate:init
```

If the database already exists and migrations were created before:

```bash
pnpm db:migrate
```

#### (Optional) Prisma Studio:

```bash
pnpm prisma:studio
```

### 4. Start the Server

#### Development Mode (watch):

```bash
pnpm dev
```

The GraphQL endpoint will be available at:

```
http://localhost:4000/graphql (default)
```

You can change the port using `PORT` in `.env`.

---

## GraphQL API (Quick Test)

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

### Sign In

```graphql
mutation {
  signIn(input: { email: "test@example.com", password: "123456" }) {
    accessToken
    user {
      id
      email
    }
  }
}
```

### Authenticated Request (`me`)

Add this header in the playground:

```json
{
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

Then run:

```graphql
query {
  me {
    id
    email
  }
}
```

---

## Notes

- Money values are stored as integer cents in the database (`amountCents`) to avoid float precision issues, and exposed as `amount` (Float) in GraphQL.
