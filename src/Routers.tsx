import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./pages/LandingPage";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
