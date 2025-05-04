import { createBrowserRouter, redirect } from "react-router-dom";
import { ProtectedWebViewLayout } from "./layouts/ProtectedWebViewLayout";
import Home, { loader as homeLoader } from "./pages/Home";
import Login from "./pages/Login";
import { AuthWebViewLayout } from "./layouts/AuthWebviewLayout";

export const router = createBrowserRouter([
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
    path: "/login",
    element: (
      <AuthWebViewLayout>
        <Login />
      </AuthWebViewLayout>
    ),
  },
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);
