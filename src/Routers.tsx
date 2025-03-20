import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Dashboard_Landing";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dev" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
