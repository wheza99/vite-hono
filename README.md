# Vite + Hono

Fullstack app: Vite + React + Hono + shadcn/ui + Supabase Auth.

## Quick Start

```bash
# Install dependencies
npm install && cd client && npm install && cd ../server && npm install

# Setup env
cp client/.env.example client/.env
# Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY

# Dev (1 server, Vite + Hono embedded)
npm run dev

# Docker
npm run docker:build && npm run docker:up
```

## Struktur File

```
vite-hono/
├── .dockerignore                    # File yang diabaikan saat Docker build
├── .env.example                     # Template env variable untuk Docker production
├── .gitignore                       # File yang diabaikan oleh Git
├── Dockerfile                       # Multi-stage build: build React lalu serve via Hono
├── docker-compose.yml               # Konfigurasi Docker Compose dengan auto port range
├── package.json                     # Root scripts: dev, build, docker commands
├── README.md                        # Dokumentasi project ini
│
├── client/                          # Frontend — Vite + React + shadcn/ui
│   ├── .env                         # Supabase URL dan anon key (tidak di-commit)
│   ├── .env.example                 # Template env variable untuk client
│   ├── components.json              # Konfigurasi shadcn/ui
│   ├── index.html                   # Entry point HTML
│   ├── package.json                 # Dependencies: React, Vite, shadcn, Supabase
│   ├── tsconfig.json                # TypeScript config dengan @ alias
│   ├── vite.config.ts               # Vite config: React, Tailwind, Hono API middleware
│   └── src/
│       ├── index.css                # Tailwind CSS + shadcn CSS variables
│       ├── main.tsx                 # Root component: routing, auth provider, navbar
│       ├── api/
│       │   └── index.ts             # Hono API untuk dev mode (embedded di Vite)
│       ├── components/ui/
│       │   ├── alert-dialog.tsx      # Komponen dialog konfirmasi (shadcn)
│       │   ├── badge.tsx             # Komponen label/badge (shadcn)
│       │   ├── button.tsx            # Komponen tombol dengan variants (shadcn)
│       │   ├── card.tsx              # Komponen kartu kontainer (shadcn)
│       │   ├── checkbox.tsx          # Komponen checkbox (shadcn)
│       │   ├── dialog.tsx            # Komponen modal dialog (shadcn)
│       │   ├── input.tsx             # Komponen input teks (shadcn)
│       │   ├── label.tsx             # Komponen label form (shadcn)
│       │   └── table.tsx             # Komponen tabel data (shadcn)
│       ├── lib/
│       │   ├── api.ts               # Helper fetch yang otomatis kirim JWT token
│       │   ├── auth.tsx             # AuthProvider dan useAuth hook untuk Supabase
│       │   ├── supabase.ts          # Inisialisasi Supabase client
│       │   └── utils.ts             # Utility cn() untuk merge Tailwind classes
│       └── pages/
│           ├── ApiKeys.tsx           # Halaman kelola API key dengan data table
│           ├── Home.tsx              # Halaman utama menampilkan pesan dari Hono
│           ├── Login.tsx             # Halaman login dengan email dan password
│           ├── Register.tsx          # Halaman registrasi dengan verifikasi email
│           └── Todos.tsx             # Halaman CRUD todo dengan auth protection
│
└── server/                          # Backend — Hono (production Docker)
    ├── package.json                 # Dependencies: Hono, Supabase, @hono/node-server
    ├── tsconfig.json                # TypeScript config untuk server
    └── src/
        ├── index.ts                 # Hono server: API routes, auth middleware, static files
        └── api-keys.ts              # Logic generate, store, dan verifikasi API key
```

## API Endpoints

| Method | Path                | Auth    | Deskripsi                       |
| ------ | ------------------- | ------- | ------------------------------- |
| GET    | `/api/hello`        | Public  | Test endpoint                   |
| GET    | `/api/todos`        | JWT     | List semua todos                |
| POST   | `/api/todos`        | JWT     | Tambah todo baru                |
| PUT    | `/api/todos/:id`    | JWT     | Toggle done todo                |
| DELETE | `/api/todos/:id`    | JWT     | Hapus todo                      |
| GET    | `/api/me`           | JWT     | Info user yang login            |
| POST   | `/api/keys`         | JWT     | Buat API key baru               |
| GET    | `/api/keys`         | JWT     | List semua API keys             |
| DELETE | `/api/keys/:key`    | JWT     | Hapus API key                   |
| GET    | `/api/public/todos` | API Key | Public endpoint: list todos     |
| GET    | `/api/public/stats` | API Key | Public endpoint: statistik todo |

## Auth

- **User Auth**: Supabase JWT (login/register via browser)
- **API Key Auth**: Access Key + Secret Key (untuk third-party API akses)

## Tech Stack

| Layer    | Teknologi                  |
| -------- | -------------------------- |
| Frontend | Vite, React, React Router  |
| UI       | shadcn/ui, Tailwind CSS v4 |
| Backend  | Hono                       |
| Auth     | Supabase Auth              |
| Deploy   | Docker                     |

