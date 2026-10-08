# Meridian Moto Group - Authorization Matrix

This document defines the access control matrix and rules for the Meridian Moto Group backend API.

## Roles & Permissions Matrix

| Resource | Role | List / ViewAny | View | Create | Update | Delete |
| --- | --- | --- | --- | --- | --- | --- |
| **Brands** | `admin` | Allowed | Allowed | Allowed | Allowed | Allowed |
| | `data_entry` | Allowed | Assigned brands only | Denied | Denied | Denied |
| **Motorcycles** | `admin` | Allowed | Allowed | Allowed | Allowed | Allowed |
| | `data_entry` | Assigned brands only | Assigned brands only | Assigned brands only | Assigned brands only | Assigned brands only |
| **Promotions** | `admin` | Allowed | Allowed | Allowed | Allowed | Allowed |
| | `data_entry` | Assigned brands only | Assigned brands only | Assigned brands only | Assigned brands only | Assigned brands only |
| **Users** | `admin` | Allowed | Allowed | Allowed | Allowed | Allowed |
| | `data_entry` | Denied | Denied | Denied | Denied | Denied |

## Key Architectural Rules

1. **Deny by Default (Least Privilege):** Users without a recognized role, or `data_entry` users with no assigned brands, are denied access to resources outside their scope.
2. **Brand Scoping (`brand_user` pivot):** The `data_entry` role is strictly scoped to brands assigned via the `brand_user` pivot table. Operations on motorcycles and promotions check whether the user has access to the underlying brand ID.
3. **Explicit Policies:** Authorization rules are enforced explicitly via Laravel Policies without blanket `Gate::before` passes for administrators, ensuring complete clarity and testability.
