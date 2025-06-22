import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { paths } from "@/config/paths";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const SetCollectionPage = lazy(() => import("@/pages/SetCollection"));

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
    path: "*",
    loader: () => redirect("/"),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
