# Admin API Endpoints

Monorepo: Meridian Moto Group API (v1/admin)
Authentication: Sanctum (`Authorization: Bearer <token>`)

| Method | Endpoint | Authorized Roles | Request Summary / Parameters | Success Status | Error Statuses |
|---|---|---|---|---|---|
| GET | `/api/v1/admin/brands` | admin, data_entry | `search`, `status`, `per_page` | 200 OK | 401, 403 |
| POST | `/api/v1/admin/brands` | admin | `name`, `slug`, `segment`, `tagline`, `description`, `accent_color`, `logo`, `hero_image`, `is_active` | 201 Created | 401, 403, 422 |
| GET | `/api/v1/admin/brands/{id}` | admin, data_entry (assigned) | Path ID | 200 OK | 401, 403, 404 |
| PUT/PATCH | `/api/v1/admin/brands/{id}` | admin | Brand fields | 200 OK | 401, 403, 404, 422 |
| DELETE | `/api/v1/admin/brands/{id}` | admin | Path ID (fails if motorcycles/promotions exist) | 204 No Content | 401, 403, 404, 422 |
| GET | `/api/v1/admin/motorcycles` | admin, data_entry | `search`, `brand_id`, `status`, `per_page` | 200 OK | 401, 403 |
| POST | `/api/v1/admin/motorcycles` | admin, data_entry (assigned brand) | `brand_id`, `name`, `slug`, `price_from`, `engine_cc`, `power_hp`, `summary`, `image`, `is_featured`, `is_published` | 201 Created | 401, 403, 422 |
| GET | `/api/v1/admin/motorcycles/{id}` | admin, data_entry (assigned) | Path ID | 200 OK | 401, 403, 404 |
| PUT/PATCH | `/api/v1/admin/motorcycles/{id}` | admin, data_entry (assigned) | Motorcycle fields | 200 OK | 401, 403, 404, 422 |
| DELETE | `/api/v1/admin/motorcycles/{id}` | admin, data_entry (assigned) | Path ID | 204 No Content | 401, 403, 404 |
| GET | `/api/v1/admin/promotions` | admin, data_entry | `search`, `brand_id`, `status`, `per_page` | 200 OK | 401, 403 |
| POST | `/api/v1/admin/promotions` | admin, data_entry (assigned brand) | `brand_id`, `title`, `description`, `image`, `starts_at`, `ends_at`, `is_published` | 201 Created | 401, 403, 422 |
| GET | `/api/v1/admin/promotions/{id}` | admin, data_entry (assigned) | Path ID | 200 OK | 401, 403, 404 |
| PUT/PATCH | `/api/v1/admin/promotions/{id}` | admin, data_entry (assigned) | Promotion fields | 200 OK | 401, 403, 404, 422 |
| DELETE | `/api/v1/admin/promotions/{id}` | admin, data_entry (assigned) | Path ID | 204 No Content | 401, 403, 404 |
| GET | `/api/v1/admin/users` | admin | `search`, `brand_id`, `per_page` | 200 OK | 401, 403 |
| POST | `/api/v1/admin/users` | admin | `name`, `email`, `password`, `role`, `brand_ids` | 201 Created | 401, 403, 422 |
| GET | `/api/v1/admin/users/{id}` | admin | Path ID | 200 OK | 401, 403, 404 |
| PUT/PATCH | `/api/v1/admin/users/{id}` | admin | User fields | 200 OK | 401, 403, 404, 422 |
| DELETE | `/api/v1/admin/users/{id}` | admin | Path ID (admin cannot delete self) | 204 No Content | 401, 403, 404, 422 |
