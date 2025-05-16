import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { AuthWebViewLayout } from "@/layouts/AuthWebviewLayout";
import { lazy } from "react";
import { paths } from "@/config/paths";
import ServiceProtectedRouter from "@/components/provider/service-protected-router";
import AuthProtectedRouter from "@/components/provider/auth-protected-router";
import { default as AppRoot, ErrorBoundary as AppRootErrorBoundary } from "@/components/root";

const Login = lazy(() => import("@/pages/Login"));
const Home = lazy(() => import("@/pages/Home"));
const Map = lazy(() => import("@/pages/Map"));
const Friends = lazy(() => import("@/pages/Friends"));
const Messages = lazy(() => import("@/pages/Messages"));
const Likes = lazy(() => import("@/pages/Likes"));

// Import the loader from Home.tsx
import { loader as homeLoader } from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: paths.auth.login.path,
    element: (
      <AuthProtectedRouter>
        <AuthWebViewLayout>
          <Login />
        </AuthWebViewLayout>
      </AuthProtectedRouter>
    ),
  },
  {
    path: paths.home.path,
    element: (
      // <ServiceProtectedRouter>
      <AppRoot />
      // </ServiceProtectedRouter>
    ),
    ErrorBoundary: AppRootErrorBoundary,
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader,
      },
      {
        path: paths.app.map.path,
        element: <Map />,
      },
      {
        path: paths.app.friends.path,
        element: <Friends />,
      },
      {
        path: paths.app.messages.path,
        element: <Messages />,
      },
      {
        path: paths.app.likes.path,
        element: <Likes />,
      },
    ],
  },
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
