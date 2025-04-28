import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/Manage/HomePage";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/manage">
            <Route path="" element={<HomePage></HomePage>}></Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
