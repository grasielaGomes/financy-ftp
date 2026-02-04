# Financy

A full-stack personal finance management application composed of:

- **Backend** (`/backend`): TypeScript + GraphQL + Prisma + SQLite API
- **Frontend** (`/frontend`): React + TypeScript + Vite + GraphQL SPA
- **Contracts** (`/contracts`): shared types/constants used by backend and frontend

## Requirements checklist

### Core features (Backend + Frontend)

- [x] Users can sign up and sign in
- [x] Users can only manage their own transactions and categories (multi-tenant)
- [x] Create a transaction
- [x] Edit a transaction
- [x] Delete a transaction
- [x] List all transactions
- [x] Create a category
- [x] Edit a category
- [x] Delete a category
- [x] List all categories

### Frontend rules

- [x] Built with **React + TypeScript**
- [x] Uses **Vite** as the bundler (no framework)
- [x] Uses **GraphQL** to query the API
- [x] Matches the **Figma** layout as closely as possible
- [x] App has **6 pages** and **2 form modals (Dialogs)**
- [x] `frontend/.env.example` exists with:
  - [x] `VITE_BACKEND_URL=`

### Backend rules

- [x] Built with **TypeScript + GraphQL + Prisma**
- [x] Uses **SQLite** (Postgres is allowed as an alternative)
- [x] CORS is enabled
- [x] `backend/.env.example` exists with:
  - [x] `JWT_SECRET=`
  - [x] `DATABASE_URL=`
  - [x] Any additional env vars are also documented

## Running The Full App Locally

### 1. Clone and install workspace dependencies

```bash
git clone https://github.com/grasielaGomes/financy-ftp.git
cd financy-ftp
pnpm install
```

### 2. Configure environment variables

Create these files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Expected defaults:

```env
# backend/.env
JWT_SECRET=your-secret-here
DATABASE_URL="file:./prisma/dev.db"
PORT=4000
```

```env
# frontend/.env
VITE_BACKEND_URL=http://localhost:4000/graphql
```

### 3. Run database migrations

For first run:

```bash
pnpm --filter financy-backend db:migrate:init
```

For subsequent runs:

```bash
pnpm --filter financy-backend db:migrate
```

### 4. Start backend + frontend + contracts watcher

```bash
pnpm dev
```

This starts the full workspace in parallel:
- Backend: `http://localhost:4000/graphql`
- Frontend: `http://localhost:5173`

## Running Packages Separately (Optional)

```bash
pnpm dev:backend
pnpm dev:frontend
```

## Pages & dialogs

- `/`
  - Shows **Login** when logged out
  - Shows **Dashboard** when logged in

- [x] AuthPage: /
- [x] DashboardPage: /
- [x] CategoriesPage: /categories
- [x] TransactionsPage: /transactions
- [x] ProfilePage: /profile
- [x] NotFoundPage: \*
