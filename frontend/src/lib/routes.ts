export const Routes = {
  Home: "/",
  ModelDetail: (slug: string) => `/models/${slug}`,
  CmsLogin: "/cms/login",
  CmsModels: "/cms/models",
  CmsPromotions: "/cms/promotions",
  CmsBrands: "/cms/brands",
  CmsUsers: "/cms/admin/users",
  ApiAuthLogin: "/api/auth/login",
  ApiAuthLogout: "/api/auth/logout",
  ApiAuthMe: "/api/auth/me",
  ApiAdmin: "/api/admin",
} as const;
