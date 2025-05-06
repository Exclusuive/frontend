import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { CollectionProvider } from "./context/CollectionContext";

import Layout from "./Layout";
import NotFound from "./NotFound";

import LandingPage from "./pages/LandingPage";

import CollectionPage from "./pages/admin/collection/CollectionPage";
import EditCollectionPage from "./pages/admin/collection/EditCollectionPage";
import ManageStorePage from "./pages/admin/collection/ManageStorePage";
import MintAndTransferPage from "./pages/admin/collection/MintAndTransferPage";

import MembershipPolicyPage from "./pages/admin/membership-policy/MembershipPolicyPage";

import MembershipStorePage from "./pages/members/membership-store/MembershipStorePage";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />

          {/* Admin Pages */}
          <Route path="admin">
            <Route
              path="collections"
              element={
                <CollectionProvider>
                  <Outlet />
                </CollectionProvider>
              }
            >
              <Route path="" element={<CollectionPage />} />
              <Route path="edit" element={<EditCollectionPage />} />
              <Route path="store" element={<ManageStorePage />} />
              <Route path="mint" element={<MintAndTransferPage />} />
            </Route>
            <Route path="membershippolicy" element={<MembershipPolicyPage />} />
          </Route>

          {/* Member Pages */}
          <Route path="member">
            <Route path="mymembership" element={<MembershipPolicyPage />} />
            <Route path="membershipstore" element={<MembershipStorePage />} />
          </Route>

          {/* 임시 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
