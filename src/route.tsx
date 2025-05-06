import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { ProtectedWebViewLayout } from "./layouts/ProtectedWebViewLayout";
import { AuthWebViewLayout } from "./layouts/AuthWebviewLayout";
import Home, { loader as homeLoader } from "./pages/Home";
import Login from "./pages/Login";

const router = createBrowserRouter([
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

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
