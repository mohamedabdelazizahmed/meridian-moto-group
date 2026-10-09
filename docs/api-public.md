# Public Catalog API Endpoints

Monorepo: Meridian Moto Group API (v1)
Authentication: None (Public, Read-Only, except Test Ride Requests which accept public submissions)

## Summary Table

| Method | Endpoint | Query Parameters / Request Fields | Success Status | Error Statuses | Query Budget | Cache / Rate Limit |
|---|---|---|---|---|---|---|
| GET | `/api/v1/brands` | None | 200 OK | 404 | 1 query | Cache (public, max-age=60, etag) |
| GET | `/api/v1/brands/{slug}` | Path `{slug}` | 200 OK | 404 | 3 queries | Cache (public, max-age=60, etag) |
| GET | `/api/v1/motorcycles` | `featured` (bool), `brand` (string slug), `per_page` (1-50) | 200 OK | 422, 404 | 3 queries | Cache (public, max-age=60, etag) |
| GET | `/api/v1/motorcycles/{slug}` | Path `{slug}` | 200 OK | 404 | 2 queries | Cache (public, max-age=60, etag) |
| GET | `/api/v1/promotions` | None | 200 OK | 404 | 2 queries | Cache (public, max-age=60, etag) |
| GET | `/api/v1/locations` | None | 200 OK | 404 | 1 query | Cache (public, max-age=60, etag) |
| POST | `/api/v1/test-ride-requests` | `name`, `phone`, `email`, `preferred_date`, `motorcycle` (slug), `website` (honeypot) | 201 Created | 422, 429 | <= 3 queries | Rate Limit: 5 requests/minute per IP |

## Resources & Fields

- **SiteBrandResource**: `name`, `slug`, `segment`, `tagline`, `description`, `accent_color`, `logo_url`, `hero_image_url`.
- **SiteBrandSummaryResource**: `name`, `slug`, `accent_color`.
- **SiteBrandDetailResource**: Everything in `SiteBrandResource` plus `motorcycles` (`SiteMotorcycleResource` collection, `whenLoaded`) and `promotions` (`SitePromotionResource` collection, `whenLoaded`).
- **SiteMotorcycleResource**: `name`, `slug`, `price_from` (float), `engine_cc`, `power_hp`, `summary`, `image_url`, `is_featured`, `brand` (`SiteBrandSummaryResource`, `whenLoaded`).
- **SitePromotionResource**: `title`, `description`, `image_url`, `starts_at` (ISO date), `ends_at` (ISO date), `brand` (`SiteBrandSummaryResource`, `whenLoaded`).
- **SiteLocationResource**: `name`, `type`, `city`, `address`, `phone`, `latitude` (float), `longitude` (float).
- **TestRideRequestResource**: `name`, `preferred_date`, `motorcycle` (`name`, `slug`, `whenLoaded`). (No internal IDs exposed).
