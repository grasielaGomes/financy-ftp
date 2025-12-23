# Financy

A full-stack personal finance management application composed of:

- **Backend** (`/backend`): TypeScript + GraphQL + Prisma + SQLite API
- **Frontend** (`/frontend`): React + TypeScript + Vite + GraphQL SPA

## Requirements checklist

### Core features (Backend + Frontend)

- [x] Users can sign up and sign in
- [ ] Users can only manage their own transactions and categories (multi-tenant)
- [ ] Create a transaction
- [ ] Edit a transaction
- [ ] Delete a transaction
- [ ] List all transactions
- [x] Create a category
- [x] Edit a category
- [x] Delete a category
- [x] List all categories

### Frontend rules

- [ ] Built with **React + TypeScript**
- [ ] Uses **Vite** as the bundler (no framework)
- [ ] Uses **GraphQL** to query the API
- [ ] Matches the **Figma** layout as closely as possible
- [ ] App has **6 pages** and **2 form modals (Dialogs)**
- [ ] `frontend/.env.example` exists with:

  - [ ] `VITE_BACKEND_URL=`

### Backend rules

- [ ] Built with **TypeScript + GraphQL + Prisma**
- [ ] Uses **SQLite** (Postgres is allowed as an alternative)
- [ ] CORS is enabled
- [ ] `backend/.env.example` exists with:

  - [ ] `JWT_SECRET=`
  - [ ] `DATABASE_URL=`
  - [ ] Any additional env vars are also documented

## Getting Started

```bash
git clone https://github.com/grasielaGomes/financy-ftp.git
cd financy-ftp
```

## Backend setup (`/backend`)

1. Install dependencies

```bash
cd backend
pnpm install
```

2. Create your `.env` from `.env.example`

```bash
# backend/.env.example (required)
JWT_SECRET=
DATABASE_URL=
```

3. Run Prisma and start the server

```bash
npx prisma generate
npx prisma migrate dev
pnpm run dev
```

> Make sure CORS is enabled in the backend.

## Frontend setup (`/frontend`)

1. Install dependencies

```bash
cd frontend
pnpm install
```

2. Create your `.env` from `.env.example`

```bash
# frontend/.env.example (required)
VITE_BACKEND_URL=
```

3. Start the app

```bash
pnpm run dev
```

## Pages & dialogs

- `/`

  - Shows **Login** when logged out
  - Shows **Dashboard** when logged in

> Fill in the remaining pages and dialogs with the final names/routes:

- [ ] Page 2:
- [ ] Page 3:
- [ ] Page 4:
- [ ] Page 5:
- [ ] Page 6:
- [ ] Dialog 1 (form):
- [ ] Dialog 2 (form):
