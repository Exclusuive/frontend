// Application paths configuration

export const paths = {
  home: "/",
  auth: {
    login: {
      path: "/login",
      getHref: (redirectTo?: string) =>
        redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login",
    },
    register: "/register",
    forgotPassword: "/forgot-password",
  },
  dashboard: "/dashboard",
  profile: "/profile",
};
