import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { paths } from "@/config/paths";
import { default as AppRoot, ErrorBoundary as AppRootErrorBoundary } from "@/components/root";
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminProtectedRouter from "./components/provider/AdminProtectedRouter";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const SetCollectionPage = lazy(() => import("@/pages/SetCollection"));
const AdminPage = lazy(() => import("@/pages/Admin"));
const MemberPage = lazy(() => import("@/pages/Member"));

const router = createBrowserRouter([
  {
    path: paths.landingPage.path,
    element: <LandingPage />,
  },
  {
    path: paths.setCollectionPage.path,
    element: <SetCollectionPage />,
  },
  {
    path: paths.adminPage.path,
    element: (
      <AdminProtectedRouter>
        <AdminLayout>
          <AppRoot />
        </AdminLayout>
      </AdminProtectedRouter>
    ),
    ErrorBoundary: AppRootErrorBoundary,
    children: [
      {
        path: "",
        element: <AdminPage />,
      },
    ],
  },
  {
    path: paths.memberPage.path,
    element: <MemberPage />,
  },

  {
    path: "*",
    loader: () => redirect("/"),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
