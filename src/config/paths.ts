export const paths = {
  home: {
    path: "/",
    getHref: () => "/",
  },
  auth: {
    login: {
      path: "/login",
      getHref: (redirectTo?: string) =>
        redirectTo ? `/login?redirectTo=${encodeURIComponent(redirectTo)}` : "/login",
    },
  },
  app: {
    root: {
      path: "/app",
      getHref: () => "/app",
    },
    map: {
      path: "/map",
      getHref: () => "/map",
    },
    friends: {
      path: "/friends",
      getHref: () => "/friends",
    },
    messages: {
      path: "/messages",
      getHref: () => "/messages",
    },
    likes: {
      path: "/likes",
      getHref: () => "/likes",
    },
  },
};
