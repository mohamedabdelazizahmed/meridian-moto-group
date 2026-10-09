# OpenAPI Specification & Postman Collection Guide

## 1. Swagger UI & OpenAPI Specification
- **Swagger UI URL:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Raw OpenAPI YAML Spec:** [http://localhost:8000/docs/openapi.yaml](http://localhost:8000/docs/openapi.yaml)
- **Attribution Note:** Swagger UI (Apache-2.0) is bundled locally under `backend/public/vendor/swagger-ui`.

### Authorization Flow in Swagger UI
1. Send a `POST /api/v1/auth/login` request using one of the demo credentials.
2. Copy the `token` string from the JSON response.
3. Click the **Authorize** button at the top right of the Swagger UI page.
4. Paste the token into the Bearer token dialog and click **Authorize**.

---

## 2. Demo Accounts & Role Permissions
- **Admin User** (`admin@meridian.test` / `Meridian @2026`):
  - Full access to all brands, motorcycles, promotions, and user accounts. Can create, update, and delete across all entities.
- **Data Entry One** (`entry1@meridian.test` / `Meridian @2026`):
  - Scoped access assigned to **Apex** and **Nomad** brands. Can view and manage motorcycles and promotions belonging to Apex and Nomad. Cannot access user management or unassigned brands.
- **Data Entry Two** (`entry2@meridian.test` / `Meridian @2026`):
  - Scoped access assigned to **Volt** brand. Can view and manage motorcycles and promotions belonging to Volt. Cannot access user management or unassigned brands.

---

## 3. Postman Collection & Environment
The Postman collection and environment files are located in `docs/postman/`:
- **Collection:** `docs/postman/meridian-moto-api.postman_collection.json`
- **Environment:** `docs/postman/meridian-moto-local.postman_environment.json`

### How to Import into Postman
1. **Import File:** Open Postman -> Click **Import** -> Select both JSON files from `docs/postman/`.
2. **Import Link:** Alternatively, select **Import -> Link** and enter: `http://localhost:8000/docs/openapi.yaml`.
3. Select the **Meridian Moto Local** environment in the top-right environment dropdown.
4. Run any of the **Login** requests in the **Auth** folder (`admin`, `entry1`, or `entry2`). The test script automatically captures the returned token into the `token` environment variable for subsequent authenticated requests.

---

## 4. File Uploads & Multipart Note (`PUT`/`PATCH`)
Laravel does not natively parse `multipart/form-data` request bodies on `PUT` or `PATCH` HTTP methods. 
- **Workaround:** When updating resources with file uploads (`logo`, `hero_image`, `image`), send a `POST` request with `_method: PUT` (or `_method: PATCH`) included in the form-data body along with the binary files and updated fields. This is fully documented in the OpenAPI spec and demonstrated in the Postman collection.

---

## 5. Regenerating Postman Collection
To regenerate or update the Postman collection from the OpenAPI spec:
1. Ensure the OpenAPI spec is updated at `backend/resources/openapi/openapi.yaml`.
2. Update or regenerate collection JSON files in `docs/postman/`.
