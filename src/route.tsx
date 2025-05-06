import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { ProtectedWebViewLayout } from "./layouts/ProtectedWebViewLayout";
import { AuthWebViewLayout } from "./layouts/AuthWebviewLayout";
import { lazy } from "react";
import { loader as homeLoader } from "./pages/Home";

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
      <ProtectedWebViewLayout>
        <Home />
      </ProtectedWebViewLayout>
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
