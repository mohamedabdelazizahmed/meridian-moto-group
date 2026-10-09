# Meridian Moto Group - Frontend (Next.js)

Frontend application for Meridian Moto Group, supporting the public motorcycle website and admin CMS.

## Architecture & Technology Stack

- **Framework**: Next.js App Router (React, TypeScript strict mode)
- **Styling**: Tailwind CSS with custom design tokens matching Meridian Moto brand guidelines
- **Typography**: Barlow Condensed (Headings) & Inter (Body) via `next/font/google`
- **Containerization**: Multi-stage Dockerfile with standalone output

## Design System Tokens

- **Background**: `#0B0B0D` (`--color-moto-bg`)
- **Surface**: `#141418` (`--color-moto-surface`)
- **Border**: `#26262C` (`--color-moto-border`)
- **Primary Text**: `#F4F1EA` (`--color-moto-text`)
- **Muted Text**: `#9A9AA3` (`--color-moto-muted`)
- **Copper Accent**: `#C8873A` (`--color-moto-copper`)
- **Brand Accents**: Volt (`#22D3C5`), Nomad (`#A8B36A`), Apex (`#E5322D`), Sovereign (`#C9CDD6`)

## Getting Started

### Prerequisites

- Node.js LTS (v20+ or v22+)
- npm

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Linting & Type Checking

```bash
npm run lint
npx tsc --noEmit
```

### Production Build

```bash
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```dotenv
LARAVEL_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Health Endpoint

- `GET /api/health`: Returns JSON confirming frontend service status.

## Docker Support

Build the Docker image:

```bash
docker build -t meridian-frontend .
```

Run the container:

```bash
docker run -p 3000:3000 meridian-frontend
```

## Intentionally Deferred (Future Phases)

- Homepage catalog sections, motorcycle detail pages, brand showrooms
- Admin CMS dashboard, authentication, session management (`httpOnly` cookies)
- TanStack Query, Zustand state management, Swiper carousel, Leaflet maps
