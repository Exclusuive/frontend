import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { paths } from "@/config/paths";
import { default as AppRoot, ErrorBoundary as AppRootErrorBoundary } from "@/components/root";
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminProtectedRouter from "./components/provider/AdminProtectedRouter";
import UserProtectedRouter from "./components/provider/UserProtectedRouter";
import { UserLayout } from "./layouts/UserLayout";
import AdminItems from "./pages/AdminItems";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const SetCollectionPage = lazy(() => import("@/pages/SetCollection"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminCollection = lazy(() => import("@/pages/AdminCollection"));
const MemberPage = lazy(() => import("@/pages/Member"));
const AdminMarket = lazy(() => import("@/pages/AdminMarket"));
const Profile = lazy(() => import("@/pages/Profile"));
const AdminBilling = lazy(() => import("@/pages/AdminBilling"));

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
        path: paths.adminDashboard.path,
        element: <AdminDashboard />,
      },
      {
        path: paths.adminCollection.path,
        element: <AdminCollection />,
      },
      {
        path: paths.adminItems.path,
        element: <AdminItems />,
      },
      {
        path: paths.adminMarket.path,
        element: <AdminMarket />,
      },
      {
        path: paths.adminProfile.path,
        element: <Profile />,
      },
      {
        path: paths.adminBilling.path,
        element: <AdminBilling />,
      },
    ],
  },
  {
    path: paths.memberPage.path,
    element: (
      <UserProtectedRouter>
        <UserLayout>
          <MemberPage />
        </UserLayout>
      </UserProtectedRouter>
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
