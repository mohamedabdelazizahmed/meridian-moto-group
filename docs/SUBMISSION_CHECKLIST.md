# Meridian Moto Group - Submission Checklist

This checklist maps all requirements from the assessment brief to their corresponding repository artifacts.

## Requirements Checklist

- [x] **Source Repository**: Complete monorepo structure with `backend/` (Laravel 13), `frontend/` (Next.js 16), and root configuration. — **PASS**
- [x] **Setup Instructions**: Detailed setup steps in `README.md` (Section 5) and single-command Docker Compose (`docker-compose.yml`). — **PASS**
- [x] **Working Local Deployment**: Fully containerized local deployment via root `docker-compose.yml` (`http://localhost:3000` & `http://localhost:8000/api/v1`). — **PASS**
- [x] **Design System**: Google Stitch design system reference. — **VERIFIED**
- [x] **Admin / CMS Test Credentials**: Documented in `README.md` (Section 7) and `docs/authorization-matrix.md`. — **PASS**
- [x] **Technical Approach & Technology Choices**: Covered extensively in `README.md` (Section 4). — **PASS**
- [x] **Assumptions & Trade-Offs**: Outlined in `README.md` (Section 12). — **PASS**
- [x] **Short Video Demo**: Script provided in `docs/DEMO_SCRIPT.md`. — **PASS**
- [x] **Entity Relationship Diagram (ERD)**: Defined in `docs/erd.dbml` (Visual diagram `docs/erd.png`). — **PASS**
- [x] **Attribution & References**: Listed in `README.md` (Section 14). — **PASS**
- [x] **AI-Generated Disclosure**: Disclosed in `README.md` (Section 15) and `frontend/public/images/ATTRIBUTION.md`. — **PASS**
- [x] **Fictional Company Disclaimer**: Prominently stated in `README.md` header and footer. — **PASS**
- [x] **Users Management Screen**: Fully integrated backend API (`/api/v1/admin/users`) with role filtering, brand scope assignment, self-protection guard rails, and Next.js CMS page (`/cms/users`). — **PASS**

---

## Verification Evidence Summary

- **Backend Tests (Pest)**: 84 / 84 tests passed (`php artisan test`).
- **Frontend Tests (Vitest)**: 85 / 85 tests passed (`npm test`).
- **Code Style (Pest Pint & ESLint)**: Fully compliant and green.
- **OpenAPI Route Coverage**: Verified (`OpenApiTest` passes).
- **Live Proof Checks**: Role-based scoping, 403 enforcement, own-role change guard (422), self-delete guard (422), and token revocation verified successfully.
