# Meridian Moto Group - 5-Minute Video Demo Script

## Before Recording Checklist
- [ ] Docker containers running (`docker compose up -d`).
- [ ] Database fresh and seeded (`docker compose exec laravel.test php artisan migrate:fresh --seed`).
- [ ] Browser window sized for dual view (desktop 1920x1080 or responsive mobile simulation).
- [ ] Microphone tested and screen recording software ready.

---

## Script & Timings

### 0:00 - 0:45 | Public Website & Experience
- **Action**: Open `http://localhost:3000`.
- **Narration**: 
  > "Welcome to Meridian Moto Group, a fictional premium motorcycle manufacturer and dealer network. Here on the public site, visitors are greeted with an immersive hero section showcasing our flagship brands: Volt, Nomad, Apex, and Sovereign."
- **Action**: Scroll through brand cards, featured motorcycle models with tabbed filtering, services, and active promotions.
- **Action**: Toggle viewport to mobile width to demonstrate responsive layout and mobile navigation menu.
- **Action**: Scroll to the dealership locations section featuring interactive Leaflet maps with pins.
- **Action**: Scroll to the Test-Ride Booking form. Submit once with invalid/missing fields to show real-time Zod validation errors. Then fill correctly (`admin@meridian.test` or test data) and submit to see the success toast message.

### 0:45 - 1:45 | Admin CMS - Full Access (`admin@meridian.test`)
- **Action**: Navigate to `http://localhost:3000/cms/login`. Log in using `admin@meridian.test` and password `Meridian @2026`.
- **Narration**:
  > "Logging into the CMS as an administrator provides complete control over all four brands, motorcycle catalog, and promotions."
- **Action**: 
  1. Navigate to Motorcycles. Click **Create New Model**. Fill in details, select a brand (e.g., Apex RS 900), upload/select image, and submit.
  2. Edit the newly created model, change a field (e.g., price or stock status), and save.
  3. Use the search/filter bar to filter by brand or category.
  4. Delete a test model.
  5. Briefly visit the Promotions and Brands management screens to demonstrate admin capabilities.
- **Action**: Click **Logout**.

### 1:45 - 2:30 | Data Entry CMS Role (`entry1@meridian.test`)
- **Action**: Log in as `entry1@meridian.test` with password `Meridian @2026`.
- **Narration**:
  > "Now logging in as a Data Entry user, `entry1@meridian.test`, who is assigned only to Apex and Nomad brands."
- **Action**: 
  1. Navigate to Motorcycles and Promotions. Observe that only Apex and Nomad records appear.
  2. Attempt to navigate or access Brand management or unassigned brand records, showing how role and brand-scoped policies (`BrandOwnedPolicy`) restrict unauthorized access.
- **Action**: Log out.

### 2:30 - 3:15 | API Documentation & Postman
- **Action**: Open `http://localhost:8000/docs` (Swagger UI).
- **Narration**:
  > "For developers and integrators, our Laravel API comes with interactive OpenAPI documentation at `/docs`."
- **Action**: Expand auth or catalog endpoints, click **Try it out**, execute a request, and review JSON responses.
- **Action**: Mention the provided Postman collection and environment in `docs/postman/`.

### 3:15 - 4:15 | Quick Code Tour
- **Action**: Open editor to highlight key architectural patterns:
  - **Backend (`backend/app/`)**: Thin controllers (`Http/Controllers/`), Form Requests, Service classes (`Services/`), and Repository interfaces (`Repositories/`).
  - **Frontend (`frontend/src/`)**: Next.js App Router structure, BFF route handlers (`app/api/`), TanStack Query hooks, and Zustand stores.

### 4:15 - 5:00 | Closing Summary
- **Narration**:
  > "In summary, Meridian Moto Group demonstrates a robust monorepo architecture combining Laravel 13, Next.js 16, strict security practices, and thorough documentation. Thank you for watching!"
