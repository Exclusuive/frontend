export const paths = {
  landingPage: {
    path: "/",
    getHref: () => "/",
  },
  setCollectionPage: {
    path: "/setCollection",
    getHref: () => "/setCollection",
  },
  adminPage: {
    path: "/admin",
    getHref: () => "/admin",
  },
  adminDashboard: {
    path: "",
    getHref: () => "/admin",
  },
  adminCollection: {
    path: "collection",
    getHref: () => "/admin/collection",
  },
  adminItems: {
    path: "items",
    getHref: () => "/admin/items",
  },
  adminMarket: {
    path: "market",
    getHref: () => "/admin/market",
  },
  adminProfile: {
    path: "profile",
    getHref: () => "/admin/profile",
  },
  adminBilling: {
    path: "billing",
    getHref: () => "/admin/billing",
  },
  memberPage: {
    path: "/member",
    getHref: () => "/member",
  },
};
