import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { paths } from "@/config/paths";
import { default as AppRoot, ErrorBoundary as AppRootErrorBoundary } from "@/components/root";
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminProtectedRouter from "./components/provider/AdminProtectedRouter";
import UserProtectedRouter from "./components/provider/UserProtectedRouter";
import { UserLayout } from "./layouts/UserLayout";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const SetCollectionPage = lazy(() => import("@/pages/SetCollection"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const AdminCollection = lazy(() => import("@/pages/AdminCollection"));
const AdminMarket = lazy(() => import("@/pages/AdminMarket"));
const AdminItems = lazy(() => import("@/pages/AdminItems"));
const MemberMyCharacter = lazy(() => import("@/pages/MemberMyCharacter"));
const Profile = lazy(() => import("@/pages/Profile"));
const AdminBilling = lazy(() => import("@/pages/AdminBilling"));
const AdminMission = lazy(() => import("@/pages/AdminMission"));
const MemberExplore = lazy(() => import("@/pages/MemberExplore"));
const MemberMission = lazy(() => import("@/pages/MemberMission"));
const MemberMarket = lazy(() => import("@/pages/MemberMarketplace"));

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
      {
        path: paths.adminMission.path,
        element: <AdminMission />,
      },
    ],
  },
  {
    path: paths.memberPage.path,
    element: (
      <UserProtectedRouter>
        <UserLayout>
          <AppRoot />
        </UserLayout>
      </UserProtectedRouter>
    ),
    ErrorBoundary: AppRootErrorBoundary,
    children: [
      {
        path: paths.memberMyCharacter.path,
        element: <MemberMyCharacter />,
      },
      {
        path: paths.memberProfile.path,
        element: <Profile />,
      },
      {
        path: paths.memberExplore.path,
        element: <MemberExplore />,
      },
      {
        path: paths.memberMarket.path,
        element: <MemberMarket />,
      },
      {
        path: paths.memberMission.path,
        element: <MemberMission />,
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
