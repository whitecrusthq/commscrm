# CommsCRM

A full-featured Customer Relationship Management system for communications teams.

## Project Structure

```
frontend/    # React + Vite frontend application
backend/     # Express + Sequelize API server
```

## Frontend

React application built with Vite, Tailwind CSS, and Radix UI components.

### Setup

```bash
cd frontend
npm install
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Dev server port (default: 5173) |
| `BASE_PATH` | Base URL path (default: /) |

## Backend

Express.js API server with Sequelize ORM and PostgreSQL.

### Setup

```bash
cd backend
npm install
npm run db:migrate
npm run dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Build and start the server |
| `npm run build` | Compile TypeScript |
| `npm run start` | Start compiled server |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:migrate:undo` | Undo last migration |
| `npm run db:migrate:undo:all` | Undo all migrations |
| `npm run db:migrate:status` | Check migration status |
| `npm run db:migration:generate` | Generate a new migration file |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT token signing |
| `SESSION_SECRET` | Secret for session management |

## Features

- Multi-channel conversation management
- Customer management with groups and tags
- AI-powered assistant with configurable providers (OpenAI, Anthropic, Google)
- Agent attendance tracking with geolocation and face verification
- Campaign management (Email, SMS, WhatsApp)
- Payment processing with multiple providers
- Product catalog with API source sync and webhooks
- Customizable branding and currency settings
- Knowledge base and compliance document management
- Analytics and KPI tracking
- Role-based access control (Super Admin, Admin, Supervisor, Agent)
