import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { ProtectedWebViewLayout } from "@/layouts/ProtectedWebViewLayout";
import { AuthWebViewLayout } from "@/layouts/AuthWebviewLayout";
import { lazy } from "react";
import { loader as homeLoader } from "@/pages/Home";
import { paths } from "@/config/paths";
import ServiceProtectedRouter from "@/components/provider/service-protected-router";
import AuthProtectedRouter from "@/components/provider/auth-protected-router";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Login"));

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
      <ServiceProtectedRouter>
        <ProtectedWebViewLayout>
          <Home />
        </ProtectedWebViewLayout>
      </ServiceProtectedRouter>
    ),
    loader: homeLoader,
  },
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
