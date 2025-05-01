import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./pages/LandingPage";

import Collection from "./pages/admin/collection/Collection";
import MembershipPolicy from "./pages/admin/membership-policy/MembershipPolicy";

import MyMembership from "./pages/members/my-membership/MyMembership";
import MembershipStore from "./pages/members/membership-store/MembershipStore";
import NotFound from "./NotFound";
import EditCollection from "./pages/admin/collection/edit/EditCollection";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="admin">
            <Route path="collections">
              <Route path="" element={<Collection />} />
              <Route path="edit" element={<EditCollection />} />
            </Route>
            <Route path="membershippolicy" element={<MembershipPolicy />} />
          </Route>
          <Route path="member">
            <Route path="mymembership" element={<MyMembership />} />
            <Route path="membershipstore" element={<MembershipStore />} />
          </Route>

          {/* 임시 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}
