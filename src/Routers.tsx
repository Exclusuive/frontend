import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import SDK_TEST from "./pages/SDK_TEST";
import Dashboard from "./pages/Dashboard";
import MakeCollectionPage from "./pages/MakeCollectionPage";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/makecollection" element={<MakeCollectionPage />} />
          <Route path="/dev" element={<SDK_TEST />} />
        </Route>
      </Routes>
    </Router>
  );
}
