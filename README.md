# Meridian Moto Group - Monorepo

Meridian Moto Group is a FICTIONAL company created solely for recruitment assessment and demonstration purposes. It is not intended for commercial use. All trademarks, brand names and other intellectual property remain the property of their respective owners.

## 1. Overview

Meridian Moto Group is an enterprise-grade web application and API platform showcasing a modern motorcycle manufacturer and dealer group. The monorepo houses a robust Laravel 13 backend API (`backend/`) and a high-performance Next.js 16 frontend application (`frontend/`).

## 2. What Is Included

- **Public Website**: Immersive brand showcases, motorcycle catalog with multi-criteria filtering (brand, category, price, power, transmission), promotions, dealership locations with interactive Leaflet maps, and test-ride booking.
- **Admin CMS (`/cms`)**: Role-based content management system for managing motorcycles, promotions, and brand assignments.
- **Laravel API (`/api/v1`)**: RESTful JSON API adhering to strict architectural layers, API Resources, and robust validation.
- **Interactive API Docs**: Swagger UI bundled at `/docs` reflecting `backend/resources/openapi/openapi.yaml`.
- **Postman Collection & Environment**: Located in `docs/postman/`.
- **Database ERD**: Database markup language definition in `docs/erd.dbml` and diagram `docs/erd.png`.

## 3. Architecture

```mermaid
graph TD
    Browser[User Browser / Client] -->|HTTPS / Port 3000| Next[Next.js Frontend & BFF Gateway]
    Next -->|API Calls / Port 8000| Laravel[Laravel 13 REST API (/api/v1)]
    Laravel -->|SQL / Port 3306| MySQL[(MySQL 8.4 Database)]
```

### Folder Structure
```
meridian-moto-group/
├── backend/            # Laravel 13 API application
├── frontend/           # Next.js 16 App Router application
├── docs/               # Architecture docs, OpenAPI specs, Postman files, ERD
└── docker-compose.yml  # Root Docker Compose orchestrating all services
```

## 4. Technology Choices & Design Rationale

### Backend (`backend/`)
- **Laravel 13 & PHP 8.3**: Enterprise stability, elegant ORM, robust ecosystem.
- **Laravel Sanctum**: Secure token-based authentication via httpOnly cookies and BFF proxy pattern.
- **Spatie Laravel Permission**: Granular role-based access control (Admin vs Data Entry) with brand-scoping policies (`BrandOwnedPolicy`).
- **Controller-Service-Repository Pattern**: Thin controllers delegating to service classes and repository interfaces, ensuring separation of concerns and testability.
- **DTOs & Form Requests**: Strict typing and validation payloads.
- **API Resources**: Consistent JSON response formatting.
- **Pest Testing**: Expressive syntax with query-count assertions and lazy-loading prevention enabled in test/dev environments.

### Frontend (`frontend/`)
- **Next.js 16 (App Router)**: Server-side rendering, React Server Components, and API route handlers acting as a Backend-For-Frontend (BFF).
- **TypeScript (Strict Mode)**: Comprehensive type safety across client and server.
- **Tailwind CSS v4**: Utility-first styling with custom design tokens (`--color-moto-bg`, `--color-moto-surface`, etc.).
- **TanStack Query & Zustand**: Robust server state caching and global client state management.
- **React Hook Form & Zod**: Performant form handling and runtime schema validation.
- **Swiper & Leaflet**: Touch-enabled carousels and interactive OpenStreetMap dealership locators.

### Security Design
- **HttpOnly Cookies**: Auth tokens stored securely on the backend; never exposed to client-side JavaScript.
- **BFF Gateway Route Handlers**: Next.js API routes attach Bearer tokens server-side.
- **CSRF & Origin Protection**: Origin checks on mutating requests and safe path guards.
- **Login Throttling & Role Enforcement**: Backend policy checks and UI element visibility mirroring server permissions.

## 5. Getting Started with Docker

### Prerequisites
- Docker Desktop (Docker Compose v2.20+)

### Setup Steps
1. Clone the repository and navigate to the root folder.
2. Copy `.env.example` to `.env` in both `backend/` and `frontend/` (or configure via environment files). Note: Never commit actual secrets.
3. Start the entire stack from the project root:
   ```bash
   docker compose up -d
   ```
4. **First-Time Backend Initialization** (Sail container setup - *not verified in this run*):
   - **PowerShell**:
     ```powershell
     docker compose exec laravel.test composer install
     docker compose exec laravel.test php artisan key:generate
     docker compose exec laravel.test php artisan migrate --seed
     docker compose exec laravel.test php artisan storage:link
     ```
   - **Bash / Linux / macOS**:
     ```bash
     docker compose exec laravel.test composer install
     docker compose exec laravel.test php artisan key:generate
     docker compose exec laravel.test php artisan migrate --seed
     docker compose exec laravel.test php artisan storage:link
     ```

### Services & URLs
| Service | URL | Description |
| :--- | :--- | :--- |
| Public Frontend | http://localhost:3000 | Public website and catalog |
| Admin CMS | http://localhost:3000/cms/login | Administration dashboard |
| Laravel API | http://localhost:8000/api/v1 | REST API endpoints |
| Swagger UI | http://localhost:8000/docs | OpenAPI documentation |
| phpMyAdmin | http://localhost:8080 | Database management UI |

## 6. Running Without Docker

Ensure PHP 8.3+, Composer, MySQL, and Node.js 22+ are installed locally. Configure `backend/.env` and `frontend/.env.local`, run `composer install`, `php artisan migrate --seed`, and `npm install && npm run dev` in their respective directories.

## 7. Test Credentials

The database seeder provisions three test accounts with password `Meridian @2026` (defined as `SEED_USER_PASSWORD` in `backend/.env.example`). These are demo accounts for seeded fictional data. See `docs/authorization-matrix.md` for details.

| Email | Role | Assigned Brands |
| :--- | :--- | :--- |
| `admin@meridian.test` | Admin | All Brands (Volt, Nomad, Apex, Sovereign) |
| `entry1@meridian.test` | Data Entry | Apex, Nomad |
| `entry2@meridian.test` | Data Entry | Volt |

## 8. CMS Capabilities by Role

- **Admin**: Full CRUD access across all brands (Volt, Nomad, Apex, Sovereign), models, promotions, brand management, and User Management (`/cms/users`) with role filtering, brand scope assignment, and self-protection guard rails.
- **Data Entry**: Limited CRUD access to motorcycles and promotions restricted strictly to their assigned brands. Cannot access user management or brand management.

## 9. API Documentation

- **Swagger UI**: Available at [http://localhost:8000/docs](http://localhost:8000/docs).
- **OpenAPI Spec**: `backend/resources/openapi/openapi.yaml` (enforced by `OpenApiTest`).
- **Guides**: `docs/api-public.md`, `docs/api-admin.md`, `docs/openapi-and-postman.md`.
- **Postman Collection**: `docs/postman/meridian-moto-api.postman_collection.json` with environment `meridian-moto-local.postman_environment.json`.

## 10. Database & ERD

- **Database Definition**: `docs/erd.dbml`
- **Visual Diagram**: `docs/erd.png` (exported from DBML).

## 11. Running Tests

- **Backend Tests (Pest)**:
  ```bash
  docker compose exec laravel.test php artisan test
  ```
- **Frontend Tests (Vitest)**:
  ```bash
  cd frontend
  npx vitest run
  ```

## 12. Assumptions & Trade-Offs

- Admin CMS resides under `/cms`.
- Test-ride requests are captured and stored in the database; email notifications are logged locally.
- Imagery includes stylized SVG placeholders and AI-generated assets.
- Token session expiry is configured to 8 hours.
- Dev-oriented Docker configuration (not tuned for production container multi-stage deployment out-of-the-box).

## 13. Future Improvements

- Production multi-stage Docker builds and Helm charts for Kubernetes.
- CI/CD automated pipeline (GitHub Actions for lint, test, OpenAPI verification).
- Dedicated user management screen in CMS.
- End-to-end browser testing with Playwright.
- CDN image optimization pipeline and comprehensive audit logging.

## 14. Attribution & References

- **Typography**: Barlow Condensed & Inter (Google Fonts via `next/font`, SIL Open Font License).
- **Icons**: `lucide-react` (ISC License).
- **Carousels**: Swiper.
- **Maps**: Leaflet & OpenStreetMap (`(c) OpenStreetMap contributors`).
- **Libraries**: TanStack Query, Zustand, React Hook Form, Zod, Sonner, Tailwind CSS, Next.js, Laravel, Sanctum, Spatie Laravel Permission, Pest.

## 15. AI-Generated Assets & Disclosure

The visual design concept and motorcycle imagery were generated using Google Stitch (AI) specifically for this fictional company assessment. Code structure and implementation were assisted by AI (Gemini CLI) and rigorously reviewed, tested, and validated by the author. AI-generated imagery is located under `frontend/public/images/`.

## 16. Links & Verification

- **Stitch Design Link**: [TODO by author]
- **Demo Video Link**: [TODO by author]
- **Deployed URL**: None (Local Docker deployment)
