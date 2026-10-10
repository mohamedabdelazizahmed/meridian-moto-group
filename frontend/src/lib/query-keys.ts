export const queryKeys = {
  all: ["meridian"] as const,
  models: {
    all: () => [...queryKeys.all, "models"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.models.all(), "list", filters] as const,
    detail: (slug: string) => [...queryKeys.models.all(), "detail", slug] as const,
    featured: () => [...queryKeys.models.all(), "featured"] as const,
  },
  brands: {
    all: () => [...queryKeys.all, "brands"] as const,
    list: () => [...queryKeys.brands.all(), "list"] as const,
    detail: (slug: string) => [...queryKeys.brands.all(), "detail", slug] as const,
  },
  promotions: {
    all: () => [...queryKeys.all, "promotions"] as const,
    list: () => [...queryKeys.promotions.all(), "list"] as const,
  },
  locations: {
    all: () => [...queryKeys.all, "locations"] as const,
    list: () => [...queryKeys.locations.all(), "list"] as const,
  },
  users: {
    all: () => [...queryKeys.all, "users"] as const,
    list: () => [...queryKeys.users.all(), "list"] as const,
  },
  auth: {
    me: () => [...queryKeys.all, "auth", "me"] as const,
  },
} as const;
