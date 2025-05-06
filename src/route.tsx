import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { ProtectedWebViewLayout } from "./layouts/ProtectedWebViewLayout";
import { AuthWebViewLayout } from "./layouts/AuthWebviewLayout";
import { lazy } from "react";
import { loader as homeLoader } from "./pages/Home";
import ServiceProtectedRouter from "./components/provider/service-protect-router";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("./pages/Login"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthWebViewLayout>
        <Login />
      </AuthWebViewLayout>
    ),
  },
  {
    path: "/",
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
