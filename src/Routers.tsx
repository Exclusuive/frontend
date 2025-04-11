import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import CollectionsLayout from "./components/CollectionsLayout";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="collections" element={<CollectionsLayout />}>
            <Route path="editinfo" element={<Dashboard />} />
            <Route path="bases" element={<Dashboard />} />
            <Route path="items" element={<Dashboard />} />
            <Route path="suppliers" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
