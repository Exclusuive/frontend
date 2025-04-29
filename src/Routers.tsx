import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./pages/LandingPage";

import Collection from "./pages/admin/Collection/Page";
import MembershipPolicy from "./pages/admin/MembershipPolicy/Page";

import MyMembership from "./pages/members/MyMembership/Page";
import MembershipStore from "./pages/members/MembershipStore/Page";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="admin">
            <Route path="collection" element={<Collection />} />
            <Route path="membershippolicy" element={<MembershipPolicy />} />
          </Route>
          <Route path="member">
            <Route path="mymembership" element={<MyMembership />} />
            <Route path="membershipstore" element={<MembershipStore />} />
          </Route>

          {/* 임시 404 */}
          <Route
            path="*"
            element={
              <div>
                <button
                  onClick={() => window.history.back()}
                  className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                >
                  Opps! ← 뒤로 가기
                </button>
              </div>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
