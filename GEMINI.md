# Meridian Moto Group - Project Conventions

- Monorepo: backend/ (Laravel API) and frontend/ (Next.js), root docker-compose.yml, README.md, docs/.
- API prefix /api/v1, JSON only, every response through an API Resource.
- Roles: admin (all brands) and data_entry (assigned brands only).
- Backend layers: Controller (thin) -> Form Request (validation) -> Service (business logic) -> Repository interface + Eloquent implementation -> Policy (authorization) -> API Resource (output); status codes via Symfony Response constants.
- SOLID, small classes and functions, clear names, no dead code, no secrets committed.
- Fictional company note: "Fictional company created for recruitment assessment purposes only."
- Brands: Volt, Nomad, Apex, Sovereign. Models: Apex RS 900, Apex Track 600, Volt Pulse RS, Nomad Horizon 1250, Sovereign Wraith 1800.
