import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { lazy } from "react";
import { paths } from "@/config/paths";

const LandingPage = lazy(() => import("@/pages/LandingPage"));

const router = createBrowserRouter([
  {
    path: paths.landingPage.path,
    element: <LandingPage />,
  },

  {
    path: "*",
    loader: () => redirect("/"),
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
